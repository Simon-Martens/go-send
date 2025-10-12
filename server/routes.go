package server

import (
	"embed"
	"errors"
	"net/http"

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

	// Simple redirects
	mux.HandleFunc("/logout", handlers.NewLogoutHandler(app))
	mux.HandleFunc("/auth/claim/", handlers.NewAuthClaimHandler(app))

	// HTML
	loginHandler := handlers.NewLoginHandler(app)
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/account/password", handlers.NewAccountPasswordHandler(app))
	mux.HandleFunc("/account/links", handlers.NewAccountLinksHandler(app))
	indexHandler := handlers.IndexHandler(app)
	mux.HandleFunc("/download/", handlers.DownloadPageHandler(app))
	mux.HandleFunc("/error", indexHandler)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(app))
	mux.HandleFunc("/api/admin/auth-links", handlers.NewCreateAuthLinkHandler(app))

	// Upload endpoint (concurrency limiting disabled)
	mux.Handle("/api/ws", handlers.NewUploadHandler(app))

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(app))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(app))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(app))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(app))
	mux.HandleFunc("/api/password/", handlers.NewPasswordHandler(app))
	mux.HandleFunc("/api/info/", handlers.NewInfoHandler(app))

	// Health checks
	// mux.HandleFunc("/__lbheartbeat__", func(w http.ResponseWriter, r *http.Request) {
	// 	w.WriteHeader(http.StatusOK)
	// })
	// mux.HandleFunc("/__heartbeat__", func(w http.ResponseWriter, r *http.Request) {
	// 	if err := app.DB.Ping(); err != nil {
	// 		w.WriteHeader(http.StatusInternalServerError)
	// 		return
	// 	}
	// 	w.WriteHeader(http.StatusOK)
	// })

	// Root and static file handler
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if app.Config.UploadGuard && r.URL.Path == "/" {
			if _, err := auth.GetSessionFromRequest(app.DB, r); err != nil {
				if errors.Is(err, storage.ErrSessionExpired) {
					auth.ClearSessionCookie(w, r.TLS != nil)
				}
				loginHandler(w, r)
				return
			}
		}

		if r.URL.Path != "/" && r.URL.Path != "/download" && r.URL.Path != "/error" {
			if middleware.ServeUserStaticFile(w, r, app.Config.UserFrontendDir, config.USER_DIST_SUBDIR) {
				return
			}

			if middleware.ServeEmbeddedDistFile(w, r, distFS) {
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
