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

	"github.com/yourusername/send-go/handlers"
	"github.com/yourusername/send-go/storage"
)

//go:embed templates/*
var templatesFS embed.FS

//go:embed dist
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

	// Create uploads directory
	if err := os.MkdirAll("./uploads", 0755); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// HTML routes
	indexHandler := handlers.NewIndexHandler(tmpl, manifest)
	downloadPageHandler := handlers.NewDownloadPageHandler(tmpl, manifest, db)
	mux.HandleFunc("/download/", downloadPageHandler)
	mux.HandleFunc("/error", indexHandler)

	// API routes
	mux.HandleFunc("/config", handlers.ConfigHandler)
	mux.HandleFunc("/api/ws", handlers.NewUploadHandler(db))
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

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
