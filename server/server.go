package server

import (
	"bytes"
	"embed"
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/server/middleware"
	"github.com/Simon-Martens/go-send/storage"
)

// SetupRoutes configures all HTTP routes and handlers
func SetupRoutes(app *core.App, distFS embed.FS) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/login", handlers.NewLoginHandler(app.DB, app.Logger))
	mux.HandleFunc("/auth/claim/", handlers.NewAuthClaimHandler(app.DB))
	// HTML routes
	indexHandler := handlers.IndexHandler(app.Template, app.Manifest, app.Config, app.Logger)
	downloadPageHandler := handlers.DownloadPageHandler(app.Template, app.Manifest, app.DB, app.Config, app.Logger)
	mux.HandleFunc("/download/", downloadPageHandler)
	mux.HandleFunc("/error", indexHandler)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(app.Config))
	mux.HandleFunc("/api/admin/auth-links", handlers.NewCreateAuthLinkHandler(app.DB, app.Config))

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
		if app.Config.UploadGuard && r.URL.Path == "/" {
			if _, err := auth.GetSessionFromRequest(app.DB, r); err != nil {
				if errors.Is(err, storage.ErrSessionExpired) {
					auth.ClearSessionCookie(w, r.TLS != nil)
				}
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}
		}

		if r.URL.Path != "/" && r.URL.Path != "/download" && r.URL.Path != "/error" {
			if serveUserStaticFile(w, r, app.Config.UserFrontendDir, config.USER_DIST_SUBDIR) {
				return
			}

			if serveUserStaticFile(w, r, app.Config.UserFrontendDir, config.USER_PUBLIC_SUBDIR) {
				return
			}

			if serveEmbeddedDistFile(w, r, distFS) {
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

func serveEmbeddedDistFile(w http.ResponseWriter, r *http.Request, distFS embed.FS) bool {
	data, err := distFS.ReadFile(config.EMBEDDED_DIST_PATH + r.URL.Path)
	if err != nil {
		return false
	}

	http.ServeContent(w, r, filepath.Base(r.URL.Path), time.Time{}, bytes.NewReader(data))
	return true
}

func serveUserStaticFile(w http.ResponseWriter, r *http.Request, baseDir, subdir string) bool {
	if baseDir == "" || subdir == "" {
		return false
	}

	relativePath := strings.TrimPrefix(r.URL.Path, "/")
	if relativePath == "" {
		return false
	}

	rootDir := filepath.Join(baseDir, subdir)
	fullPath := filepath.Join(rootDir, relativePath)
	if !strings.HasPrefix(fullPath, rootDir+string(os.PathSeparator)) && fullPath != rootDir {
		return false
	}

	info, err := os.Stat(fullPath)
	if err != nil || info.IsDir() {
		return false
	}

	http.ServeFile(w, r, fullPath)
	return true
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

func New(app *core.App, distFS embed.FS) *http.Server {
	routes := SetupRoutes(app, distFS)
	handler := ApplyMiddleware(routes, app.Config)

	return &http.Server{
		Addr:              ":" + app.Config.Port,
		Handler:           handler,
		ReadTimeout:       config.SERVER_READ_TIMEOUT,
		WriteTimeout:      config.SERVER_WRITE_TIMEOUT,
		IdleTimeout:       config.SERVER_IDLE_TIMEOUT,
		ReadHeaderTimeout: config.SERVER_READ_HEADER_TIMEOUT,
		MaxHeaderBytes:    config.MAX_HEADER_BYTES,
	}
}

func Start(server *http.Server, app *core.App) error {
	app.Logger.Info("HTTP server listening", "address", server.Addr)
	return server.ListenAndServe()
}
