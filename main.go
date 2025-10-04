package main

import (
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/middleware"
	"github.com/Simon-Martens/go-send/storage"
)

//go:embed frontend/templates/*
var templatesFS embed.FS

//go:embed frontend/dist
var distFS embed.FS

var (
	db       *storage.DB
	manifest map[string]string
	tmpl     *template.Template

	// Track active cleanup goroutines with their cancel functions
	activeCleanups   = make(map[string]context.CancelFunc)
	activeCleanupsMu sync.RWMutex
)

// scheduleCleanup schedules a file for deletion at its expiration time.
// Only schedules if no cleanup is already active for this file.
// Returns true if a new goroutine was started.
func scheduleCleanup(fileID string, expiresAt int64) bool {
	activeCleanupsMu.Lock()
	if _, exists := activeCleanups[fileID]; exists {
		activeCleanupsMu.Unlock()
		return false
	}

	ctx, cancel := context.WithCancel(context.Background())
	activeCleanups[fileID] = cancel
	activeCleanupsMu.Unlock()

	go func(id string, exp int64) {
		duration := time.Until(time.Unix(exp, 0))

		// Wait for expiration or cancellation
		select {
		case <-time.After(duration):
			// Delete file from disk and database
			log.Printf("Auto-deleting expired file: %s", id)
			storage.DeleteFile(id)
			db.DeleteFile(id)
		case <-ctx.Done():
			log.Printf("Cleanup cancelled for file: %s", id)
		}

		// Remove from active cleanups map
		activeCleanupsMu.Lock()
		delete(activeCleanups, id)
		activeCleanupsMu.Unlock()
	}(fileID, expiresAt)

	return true
}

// cancelCleanup cancels the cleanup goroutine for a file.
// Call this when a file is manually deleted.
func cancelCleanup(fileID string) {
	activeCleanupsMu.Lock()
	if cancel, exists := activeCleanups[fileID]; exists {
		cancel()
		delete(activeCleanups, fileID)
	}
	activeCleanupsMu.Unlock()
}

func init() {
	var err error

	// Initialize database
	db, err = storage.NewDB("./send.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Load manifest.json
	manifestData, err := distFS.ReadFile("frontend/dist/manifest.json")
	if err != nil {
		log.Println("Warning: manifest.json not found, using defaults")
		manifest = map[string]string{
			"app.js":  "app.js",
			"app.css": "app.css",
		}
	} else {
		if err := json.Unmarshal(manifestData, &manifest); err != nil {
			log.Fatal("Failed to parse manifest.json:", err)
		}
	}
}

// loadTemplates loads templates from user directory first, falling back to embedded templates
func loadTemplates(userFrontendDir string) (*template.Template, error) {
	userTemplatesDir := filepath.Join(userFrontendDir, "templates")

	// Check if user templates directory exists
	if info, err := os.Stat(userTemplatesDir); err == nil && info.IsDir() {
		log.Printf("Loading templates from user directory: %s", userTemplatesDir)

		// Load all .html files from user templates directory
		pattern := filepath.Join(userTemplatesDir, "*.html")
		tmpl, err := template.ParseGlob(pattern)
		if err != nil {
			log.Printf("Warning: Failed to parse user templates, falling back to embedded: %v", err)
		} else {
			// Check if at least index.html exists
			if tmpl.Lookup("index.html") != nil {
				log.Println("Successfully loaded user templates")
				return tmpl, nil
			}
			log.Println("Warning: index.html not found in user templates, falling back to embedded")
		}
	}

	// Fall back to embedded templates
	log.Println("Loading embedded templates")
	return template.ParseFS(templatesFS, "frontend/templates/*.html")
}

func main() {
	// Load configuration
	cfg := config.Load()

	log.Printf("User frontend directory: %s", cfg.UserFrontendDir)
	log.Printf("  - Place custom templates in: %s/templates/", cfg.UserFrontendDir)
	log.Printf("  - Place custom static files in: %s/public/", cfg.UserFrontendDir)

	// Load templates (user overrides or embedded)
	var err error
	tmpl, err = loadTemplates(cfg.UserFrontendDir)
	if err != nil {
		log.Fatal("Failed to load templates:", err)
	}

	// Create uploads directory from config
	if err := os.MkdirAll(cfg.FileDir, 0o755); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	// Clean up expired files on startup (for files that expired while server was down)
	log.Println("Cleaning up expired files...")
	if err := db.CleanupExpired(); err != nil {
		log.Printf("Warning: Failed to cleanup expired files: %v", err)
	}

	// Start goroutine to schedule cleanups for files expiring soon
	// Runs hourly and schedules cleanup goroutines for files expiring within the next hour
	go func() {
		// Schedule on startup
		scheduleUpcomingCleanups := func() {
			files, err := db.GetFilesExpiringWithin(1 * time.Hour)
			if err != nil {
				log.Printf("Error querying upcoming expirations: %v", err)
				return
			}

			scheduled := 0
			for _, f := range files {
				if scheduleCleanup(f.ID, f.ExpiresAt) {
					scheduled++
				}
			}
			if scheduled > 0 {
				log.Printf("Scheduled %d cleanup goroutines for files expiring within 1 hour", scheduled)
			}
		}

		scheduleUpcomingCleanups()

		// Then run hourly
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			scheduleUpcomingCleanups()
		}
	}()

	mux := http.NewServeMux()

	// HTML routes
	indexHandler := handlers.NewIndexHandler(tmpl, manifest, cfg)
	downloadPageHandler := handlers.NewDownloadPageHandler(tmpl, manifest, db, cfg)
	mux.HandleFunc("/download/", downloadPageHandler)
	mux.HandleFunc("/error", indexHandler)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(cfg))

	// Upload endpoint with concurrency limiting (max 3 concurrent uploads per IP)
	uploadHandler := handlers.NewUploadHandler(db, cfg, scheduleCleanup)
	uploadLimited := middleware.LimitConcurrency(3)(http.HandlerFunc(uploadHandler))
	mux.Handle("/api/ws", uploadLimited)

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(db, cancelCleanup))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(db))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(db))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(db, cancelCleanup))
	mux.HandleFunc("/api/password/", handlers.NewPasswordHandler(db))
	mux.HandleFunc("/api/info/", handlers.NewInfoHandler(db))

	// Health checks
	mux.HandleFunc("/__lbheartbeat__", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("/__heartbeat__", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	// Static files from dist/
	distHandler := http.FileServer(http.FS(distFS))
	mux.Handle("/dist/", http.StripPrefix("/", distHandler))

	// Serve static files directly from dist root (app.* and send.* chunks)
	mux.HandleFunc("/app.", func(w http.ResponseWriter, r *http.Request) {
		// Serve JS/CSS files
		name := filepath.Base(r.URL.Path)
		data, err := distFS.ReadFile("frontend/dist/" + name)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Set correct content type
		if filepath.Ext(name) == ".js" {
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		} else if filepath.Ext(name) == ".css" {
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
		}
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		w.Write(data)
	})

	// Serve lazy-loaded chunks (send.*.js, shim.*.js, etc.)
	mux.HandleFunc("/send.", func(w http.ResponseWriter, r *http.Request) {
		name := filepath.Base(r.URL.Path)
		data, err := distFS.ReadFile("frontend/dist/" + name)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		w.Write(data)
	})

	// Serve other chunks (polyfill, shim, asmcrypto)
	serveChunk := func(w http.ResponseWriter, r *http.Request) {
		name := filepath.Base(r.URL.Path)
		data, err := distFS.ReadFile("frontend/dist/" + name)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		w.Write(data)
	}
	mux.HandleFunc("/polyfill.", serveChunk)
	mux.HandleFunc("/shim.", serveChunk)
	mux.HandleFunc("/asmcrypto.", serveChunk)

	mux.HandleFunc("/serviceWorker.js", func(w http.ResponseWriter, r *http.Request) {
		data, err := distFS.ReadFile("frontend/dist/serviceWorker.js")
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/javascript")
		w.Write(data)
	})

	// Root and static file handler
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "/download" && r.URL.Path != "/error" {
			// First, try to serve from user public directory
			userPublicPath := filepath.Join(cfg.UserFrontendDir, "public", r.URL.Path)
			if info, err := os.Stat(userPublicPath); err == nil && !info.IsDir() {
				http.ServeFile(w, r, userPublicPath)
				return
			}

			// Fall back to serving from embedded dist/
			data, err := distFS.ReadFile("frontend/dist" + r.URL.Path)
			if err == nil {
				http.ServeContent(w, r, filepath.Base(r.URL.Path), time.Time{}, bytes.NewReader(data))
				return
			}

			http.NotFound(w, r)
			return
		}
		// Serve index for root
		indexHandler(w, r)
	})

	// Wrap with security and rate limiting middleware
	isDev := os.Getenv("ENV") == "development"
	handler := middleware.SecurityHeaders(isDev)(mux)
	handler = middleware.CSP(isDev, cfg.BaseURL)(handler)

	// Limit request body size for non-websocket requests (10MB for API calls)
	handler = middleware.LimitRequestBody(10 * 1024 * 1024)(handler)

	// Rate limiting: 100 requests per second with burst of 200
	// Adjust these values based on your needs:
	// - 100.0 = 100 requests/second average
	// - 200 = burst size (allows temporary spikes)
	handler = middleware.RateLimit(100.0, 200)(handler)

	// Configure HTTP server with timeouts
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: handler,
		// ReadTimeout: Maximum duration for reading the entire request
		// For file uploads, this needs to be large enough
		ReadTimeout: 10 * time.Minute,
		// WriteTimeout: Maximum duration before timing out writes of the response
		// For file downloads, this needs to be large enough
		WriteTimeout: 10 * time.Minute,
		// IdleTimeout: Maximum amount of time to wait for the next request
		IdleTimeout: 120 * time.Second,
		// ReadHeaderTimeout: Amount of time allowed to read request headers
		ReadHeaderTimeout: 10 * time.Second,
		// MaxHeaderBytes: Maximum size of request headers
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	log.Printf("Server starting on port %s", cfg.Port)
	log.Fatal(server.ListenAndServe())
}
