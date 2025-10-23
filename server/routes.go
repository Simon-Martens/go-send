package server

import (
	"embed"
	"net/http"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/server/middleware"
	"github.com/Simon-Martens/go-send/storage"
)

// SetupRoutes configures all HTTP routes and handlers
func SetupRoutes(app *core.App, distFS embed.FS) http.Handler {
	mux := http.NewServeMux()

	indexHandler := handlers.IndexHandler(app)

	// API routes
	mux.HandleFunc("/config", handlers.NewConfigHandler(app))

	uploadHandler := http.Handler(handlers.NewUploadHandler(app))
	if app.Config.UploadGuard {
		uploadHandler = middleware.RequireUserGuard(app, middleware.UserGuardOptions{
			RedirectToLogin: false,
			AllowGuest:      true,
			GuestAllowExact: []string{"/api/ws"},
		})(uploadHandler)
	}
	mux.Handle("/api/ws", uploadHandler)

	mux.HandleFunc("/api/download/", handlers.NewDownloadHandler(app))
	mux.HandleFunc("/api/metadata/", handlers.NewMetadataHandler(app))
	mux.HandleFunc("/api/exists/", handlers.NewExistsHandler(app))
	mux.HandleFunc("/api/delete/", handlers.NewDeleteHandler(app))
	mux.HandleFunc("/api/password/", handlers.NewPasswordHandler(app))
	mux.HandleFunc("/api/info/", handlers.NewInfoHandler(app))

	// User management endpoints
	if app.Config.UseUserManagement {
		// Public user endpoints (accessible to logged-in users OR guests with upload tokens)
		mux.Handle("/api/users", middleware.RequireUserOrGuest(app)(http.HandlerFunc(handlers.NewUsersListHandler(app))))
		mux.Handle("/api/users/", middleware.RequireUserOrGuest(app)(http.HandlerFunc(handlers.NewUserDetailsHandler(app))))

		// User-only endpoints (no guest access)
		mux.Handle("/api/me/files", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewUserFilesHandler(app))))
		mux.Handle("/api/me/profile", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewAccountProfileHandler(app))))
		mux.Handle("/api/me/clear-sessions", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewAccountClearSessionsHandler(app))))
		mux.Handle("/api/me/deactivate", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewAccountDeactivateHandler(app))))
		mux.Handle("/api/passwordreset", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewPasswordResetHandler(app))))
		mux.Handle("/api/logs", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewLogsHandler(app))))

		// User-only endpoints
		mux.Handle("/api/upload-links/", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewUploadLinksHandler(app))))
		mux.Handle("/api/upload-links", middleware.RequireUser(app)(http.HandlerFunc(handlers.NewUploadLinksHandler(app))))

		// Admin-only endpoints
		mux.Handle("/api/admin/signup-links", middleware.RequireAdmin(app)(http.HandlerFunc(handlers.NewSignupLinksHandler(app))))
		mux.Handle("/api/admin/users", middleware.RequireAdmin(app)(http.HandlerFunc(handlers.NewAdminUsersHandler(app))))
		mux.Handle("/api/admin/users/", middleware.RequireAdmin(app)(http.HandlerFunc(handlers.NewAdminUserHandler(app))))

		// Auth and registration routes
		mux.HandleFunc("/auth/challenge", handlers.NewLoginChallengeHandler(app))
		mux.HandleFunc("/auth/login", handlers.NewLoginHandler(app))
		mux.HandleFunc("/auth/claim/", handlers.NewClaimHandler(app))
		mux.HandleFunc("/logout", handlers.NewLogoutHandler(app))

		// Registration routes - handle both GET (render page) and POST (submit form)
		mux.HandleFunc("/register/admin", func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodPost {
				handlers.NewRegisterAdminHandler(app)(w, r)
			} else {
				indexHandler(w, r)
			}
		})

		mux.HandleFunc("/register/user", func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodPost {
				handlers.NewRegisterUserHandler(app)(w, r)
			} else {
				indexHandler(w, r)
			}
		})

		// Registration page with token in URL - validate token before serving page
		mux.HandleFunc("/register/admin/", handlers.NewRegisterPageHandler(app, indexHandler, storage.TokenTypeAdminSignup))
		mux.HandleFunc("/register/user/", handlers.NewRegisterPageHandler(app, indexHandler, storage.TokenTypeUserSignup))
	}

	// Help page route (public, no auth required)
	mux.HandleFunc("/help", handlers.HelpHandler(app))

	rootHandler := http.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Try to serve static files first
		if r.URL.Path != "/" && r.URL.Path != "/download/" && r.URL.Path != "/error" && r.URL.Path != "/settings" && r.URL.Path != "/help" {
			if middleware.ServeUserStaticFile(w, r, app.Config.UserFrontendDir, config.USER_DIST_SUBDIR) {
				return
			}

			if middleware.ServeEmbeddedDistFile(w, r, distFS) {
				return
			}
		}

		// For all other paths (including /download/*, /), serve index.gohtml
		indexHandler(w, r)
	}))

	if app.Config.UploadGuard {
		guardOpts := middleware.UserGuardOptions{
			RedirectToLogin:    true,
			AllowPrefixes:      []string{"/download"},
			AllowExact:         []string{"/login", "/login/", "/logout", "/error", "/help"},
			AllowStatic:        true,
			AllowGuest:         true,
			GuestAllowExact:    []string{"/", "/upload", "/upload/"},
			GuestAllowPrefixes: []string{"/download"},
		}
		rootHandler = middleware.RequireUserGuard(app, guardOpts)(rootHandler)
	}

	// Apply setup redirect middleware only if no users exist at startup
	if app.InitialAdminClaimURL != "" {
		rootHandler = middleware.RedirectToSetup(app)(rootHandler)
	}

	mux.Handle("/", rootHandler)

	return mux
}
