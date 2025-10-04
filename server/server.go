package server

import (
	"bytes"
	"embed"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/server/middleware"
)

// SetupRoutes configures all HTTP routes and handlers
func SetupRoutes(app *core.App, distFS embed.FS) http.Handler {
	mux := http.NewServeMux()

	// HTML routes
	indexHandler := handlers.NewIndexHandler(app.Template, app.Manifest, app.Config, app.Logger)
	downloadPageHandler := handlers.NewDownloadPageHandler(app.Template, app.Manifest, app.DB, app.Config, app.Logger)
	mux.HandleFunc("/download/", downloadPageHandler)
	mux.HandleFunc("/error", indexHandler)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(app.Config))

	// Upload endpoint with concurrency limiting (max 3 concurrent uploads per IP)
	uploadHandler := handlers.NewUploadHandler(app.DB, app.Config, app.ScheduleCleanup, app.Logger)
	uploadLimited := middleware.LimitConcurrency(config.MAX_CONCURRENT_UPLOADS_PER_IP)(uploadHandler)
	mux.Handle("/api/ws", uploadLimited)

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(app.DB, app.CancelCleanup, app.Logger))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(app.DB, app.Logger))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(app.DB))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(app.DB, app.CancelCleanup))
	mux.HandleFunc("/api/password/", handlers.NewPasswordHandler(app.DB))
	mux.HandleFunc("/api/info/", handlers.NewInfoHandler(app.DB))

	// Health checks
	mux.HandleFunc("/__lbheartbeat__", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("/__heartbeat__", func(w http.ResponseWriter, r *http.Request) {
		if err := app.DB.Ping(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	// Root and static file handler
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "/download" && r.URL.Path != "/error" {
			// First, try to serve from user public directory
			userPublicPath := filepath.Join(app.Config.UserFrontendDir, config.USER_PUBLIC_SUBDIR, r.URL.Path)
			if info, err := os.Stat(userPublicPath); err == nil && !info.IsDir() {
				http.ServeFile(w, r, userPublicPath)
				return
			}

			// Fall back to serving from embedded dist/
			data, err := distFS.ReadFile(config.EMBEDDED_DIST_PATH + r.URL.Path)
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

	return mux
}

// ApplyMiddleware wraps the handler with all middleware in the correct order
func ApplyMiddleware(handler http.Handler, cfg *config.Config) http.Handler {
	isDev := os.Getenv("ENV") == "development"

	handler = middleware.SecurityHeaders(isDev)(handler)
	handler = middleware.CSP(isDev, cfg.BaseURL)(handler)
	handler = middleware.LimitRequestBody(config.MAX_REQUEST_BODY_SIZE)(handler)
	handler = middleware.RateLimit(config.RATE_LIMIT_REQUESTS_PER_SECOND, config.RATE_LIMIT_BURST_SIZE)(handler)

	return handler
}

// New creates and configures a new HTTP server
func New(app *core.App, distFS embed.FS) *http.Server {
	routes := SetupRoutes(app, distFS)
	handler := ApplyMiddleware(routes, app.Config)

	return &http.Server{
		Addr:    ":" + app.Config.Port,
		Handler: handler,
		// ReadTimeout: Maximum duration for reading the entire request
		// For file uploads, this needs to be large enough
		ReadTimeout: config.SERVER_READ_TIMEOUT,
		// WriteTimeout: Maximum duration before timing out writes of the response
		// For file downloads, this needs to be large enough
		WriteTimeout: config.SERVER_WRITE_TIMEOUT,
		// IdleTimeout: Maximum amount of time to wait for the next request
		IdleTimeout: config.SERVER_IDLE_TIMEOUT,
		// ReadHeaderTimeout: Amount of time allowed to read request headers
		ReadHeaderTimeout: config.SERVER_READ_HEADER_TIMEOUT,
		// MaxHeaderBytes: Maximum size of request headers
		MaxHeaderBytes: config.MAX_HEADER_BYTES,
	}
}

// Start starts the HTTP server and blocks until it exits
func Start(server *http.Server, app *core.App) error {
	app.Logger.Info("HTTP server listening", "address", server.Addr)
	return server.ListenAndServe()
}
