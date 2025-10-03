package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/middleware"
	"github.com/Simon-Martens/go-send/storage"
)

//go:embed templates/*
var templatesFS embed.FS

//go:embed frontend/dist
var distFS embed.FS

var (
	db       *storage.DB
	manifest map[string]string
	tmpl     *template.Template
)

func init() {
	var err error

	// Initialize database
	db, err = storage.NewDB("./send.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Load manifest.json
	manifestData, err := distFS.ReadFile("dist/manifest.json")
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

	// Parse HTML template
	tmpl, err = template.ParseFS(templatesFS, "templates/index.html")
	if err != nil {
		log.Fatal("Failed to parse template:", err)
	}
}

func main() {
	// Load configuration
	cfg := config.Load()

	// Create uploads directory from config
	if err := os.MkdirAll(cfg.FileDir, 0o755); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	// Clean up expired files on startup
	log.Println("Cleaning up expired files...")
	if err := db.CleanupExpired(); err != nil {
		log.Printf("Warning: Failed to cleanup expired files: %v", err)
	}

	// Start background cleanup goroutine (runs every hour)
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			log.Println("Running scheduled cleanup of expired files...")
			if err := db.CleanupExpired(); err != nil {
				log.Printf("Error during scheduled cleanup: %v", err)
			}
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
	uploadHandler := handlers.NewUploadHandler(db, cfg)
	uploadLimited := middleware.LimitConcurrency(3)(http.HandlerFunc(uploadHandler))
	mux.Handle("/api/ws", uploadLimited)

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(db))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(db))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(db))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(db))
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

	// Serve static files directly from dist root
	mux.HandleFunc("/app.", func(w http.ResponseWriter, r *http.Request) {
		// Serve JS/CSS files
		name := filepath.Base(r.URL.Path)
		data, err := distFS.ReadFile("dist/" + name)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Set correct content type
		if filepath.Ext(name) == ".js" {
			w.Header().Set("Content-Type", "application/javascript")
		} else if filepath.Ext(name) == ".css" {
			w.Header().Set("Content-Type", "text/css")
		}
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		w.Write(data)
	})

	mux.HandleFunc("/serviceWorker.js", func(w http.ResponseWriter, r *http.Request) {
		data, err := distFS.ReadFile("dist/serviceWorker.js")
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
			// Try to serve from dist/
			data, err := distFS.ReadFile("dist" + r.URL.Path)
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

	// Rate limiting: 10 requests per second with burst of 20
	// Adjust these values based on your needs:
	// - 10.0 = 10 requests/second average
	// - 20 = burst size (allows temporary spikes)
	handler = middleware.RateLimit(10.0, 20)(handler)

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
