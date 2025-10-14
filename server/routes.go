package server

import (
	"embed"
	"net/http"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/server/middleware"
)

// SetupRoutes configures all HTTP routes and handlers
func SetupRoutes(app *core.App, distFS embed.FS) http.Handler {
	mux := http.NewServeMux()

	indexHandler := handlers.IndexHandler(app)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(app))

	// Upload endpoint
	mux.Handle("/api/ws", handlers.NewUploadHandler(app))

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(app))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(app))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(app))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(app))
	mux.HandleFunc("/api/password/", handlers.NewPasswordHandler(app))
	mux.HandleFunc("/api/info/", handlers.NewInfoHandler(app))

	// Root and static file handler - serve index.gohtml for all paths
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Try to serve static files first
		if r.URL.Path != "/" && r.URL.Path != "/download/" && r.URL.Path != "/error" {
			if middleware.ServeUserStaticFile(w, r, app.Config.UserFrontendDir, config.USER_DIST_SUBDIR) {
				return
			}

			if middleware.ServeEmbeddedDistFile(w, r, distFS) {
				return
			}
		}

		// For all other paths (including /download/*, /), serve index.gohtml
		indexHandler(w, r)
	})

	return mux
}
