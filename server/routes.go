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
		uploadHandler = middleware.RequireUser(app, middleware.UserGuardOptions{
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

	// Public user endpoints (accessible to logged-in users OR guests)
	if app.Config.UseUserManagement {
		mux.HandleFunc("/api/users", handlers.NewUsersListHandler(app))
		mux.HandleFunc("/api/users/", handlers.NewUserDetailsHandler(app))
	}

	if app.Config.UseUserManagement {
		mux.HandleFunc("/api/me/files", handlers.NewUserFilesHandler(app))
		mux.HandleFunc("/api/me/inbox", handlers.NewInboxHandler(app))
		mux.HandleFunc("/api/me/outbox", handlers.NewOutboxHandler(app))
		mux.HandleFunc("/api/me/file-info/", handlers.NewFileInfoHandler(app))
		mux.HandleFunc("/api/me/profile", handlers.NewAccountProfileHandler(app))
		mux.HandleFunc("/api/me/clear-sessions", handlers.NewAccountClearSessionsHandler(app))
		mux.HandleFunc("/api/me/deactivate", handlers.NewAccountDeactivateHandler(app))
		mux.HandleFunc("/api/passwordreset", handlers.NewPasswordResetHandler(app))
		mux.HandleFunc("/api/admin/upload-links", handlers.NewAdminUploadLinksHandler(app))
		mux.HandleFunc("/api/admin/upload-links/", handlers.NewAdminUploadLinkHandler(app))
		mux.HandleFunc("/api/admin/signup-links", handlers.NewSignupLinksHandler(app))
		mux.HandleFunc("/api/admin/users", handlers.NewAdminUsersHandler(app))
		mux.HandleFunc("/api/admin/users/", handlers.NewAdminUserHandler(app))

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

	rootHandler := http.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Try to serve static files first
		if r.URL.Path != "/" && r.URL.Path != "/download/" && r.URL.Path != "/error" && r.URL.Path != "/settings" {
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
			AllowExact:         []string{"/login", "/login/", "/logout", "/error"},
			AllowStatic:        true,
			AllowGuest:         true,
			GuestAllowExact:    []string{"/", "/upload", "/upload/"},
			GuestAllowPrefixes: []string{"/download"},
		}
		rootHandler = middleware.RequireUser(app, guardOpts)(rootHandler)
	}

	mux.Handle("/", rootHandler)

	return mux
}
