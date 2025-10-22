package middleware

import (
	"net/http"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

// RequireAdmin ensures the request is from an authenticated admin user.
// Returns 401 if not logged in, 403 if not admin.
func RequireAdmin(app *core.App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := app.GetAuthenticatedSession(r)
			if err != nil {
				app.Logger.Warn("RequireAdmin: session lookup failed", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// No session at all
			if session == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Guest session (has auth_token_id instead of user_id)
			if session.AuthTokenID != nil {
				http.Error(w, "Forbidden: admin access required", http.StatusForbidden)
				return
			}

			// No user_id in session
			if session.UserID == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Get the user
			user, err := app.DB.GetUser(*session.UserID)
			if err != nil {
				app.Logger.Error("RequireAdmin: failed to load user", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if user == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Check if user is admin
			if user.Role != storage.RoleAdmin {
				http.Error(w, "Forbidden: admin access required", http.StatusForbidden)
				return
			}

			app.TouchSession(session, r)
			next.ServeHTTP(w, r)
		})
	}
}

// RequireUser ensures the request is from an authenticated user account.
// Guest sessions (with auth_token_id) are rejected.
// Returns 401 if not authenticated, 403 if guest session.
func RequireUser(app *core.App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := app.GetAuthenticatedSession(r)
			if err != nil {
				app.Logger.Warn("RequireUser: session lookup failed", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// No session at all
			if session == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Guest session (has auth_token_id instead of user_id)
			if session.AuthTokenID != nil {
				http.Error(w, "Forbidden: user account required", http.StatusForbidden)
				return
			}

			// No user_id in session
			if session.UserID == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Get the user
			user, err := app.DB.GetUser(*session.UserID)
			if err != nil {
				app.Logger.Error("RequireUser: failed to load user", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if user == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			app.TouchSession(session, r)
			next.ServeHTTP(w, r)
		})
	}
}

// RequireUserOrGuest allows both authenticated users and guests with valid tokens.
// Returns 401 if neither is present.
func RequireUserOrGuest(app *core.App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check for authenticated session first
			session, err := app.GetAuthenticatedSession(r)
			if err != nil {
				app.Logger.Warn("AllowUserOrGuest: session lookup failed", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if session != nil {
				app.TouchSession(session, r)

				// User session (has user_id) - allow access
				if session.UserID != nil {
					next.ServeHTTP(w, r)
					return
				}

				// Guest session (has auth_token_id) - check if it's a valid upload token (type 2 or 3)
				if session.AuthTokenID != nil {
					token, err := app.GetSessionAuthToken(session)
					if err != nil {
						app.Logger.Warn("AllowUserOrGuest: failed to load session auth token", "error", err)
						http.Error(w, "Internal Server Error", http.StatusInternalServerError)
						return
					}
					if token != nil && (token.Type == storage.TokenTypeGeneralGuestUpload || token.Type == storage.TokenTypeSpecificGuestUpload) {
						next.ServeHTTP(w, core.WithGuestToken(r, token))
						return
					}
				}
			}

			// Fallback to legacy guest token cookie for backward compatibility
			guestToken, err := app.GetGuestAuthToken(r)
			if err != nil {
				app.Logger.Warn("AllowUserOrGuest: guest token lookup failed", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if guestToken != nil {
				next.ServeHTTP(w, core.WithGuestToken(r, guestToken))
				return
			}

			// Neither user session nor guest token
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		})
	}
}
