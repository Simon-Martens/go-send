package middleware

import (
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

// UserGuardOptions configures RequireUser middleware behaviour
type UserGuardOptions struct {
	RedirectToLogin    bool
	AllowPrefixes      []string
	AllowExact         []string
	AllowStatic        bool
	AllowGuest         bool
	GuestAllowPrefixes []string
	GuestAllowExact    []string
}

// RequireUserGuard ensures the requester has an authenticated user session with configurable options.
// This is used for the upload guard feature with flexible guest access rules.
func RequireUserGuard(app *core.App, opts UserGuardOptions) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if isGuardBypassed(r, opts) {
				next.ServeHTTP(w, r)
				return
			}

			session, err := app.GetAuthenticatedSession(r)
			if err != nil {
				app.Logger.Warn("User guard session lookup failed", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// Session exists - check if it's a user session or guest session
			if session != nil {
				// User session (has user_id) - allow access
				if session.UserID != nil {
					app.TouchSession(session, r)
					next.ServeHTTP(w, r)
					return
				}

				// Guest session (has auth_token_id) - check token type and path restrictions
				if session.AuthTokenID != nil && opts.AllowGuest {
					token, err := app.GetSessionAuthToken(session)
					if err != nil {
						app.Logger.Warn("User guard failed to load session auth token", "error", err, "auth_token_id", *session.AuthTokenID)
						http.Error(w, "Internal Server Error", http.StatusInternalServerError)
						return
					}

					if token != nil && isGuestSessionAllowed(r, token, opts) {
						app.TouchSession(session, r)
						next.ServeHTTP(w, core.WithGuestToken(r, token))
						return
					}
				}
			}

			// Fallback to legacy guest token cookie for backward compatibility
			if opts.AllowGuest {
				guestToken, err := app.GetGuestAuthToken(r)
				if err != nil {
					app.Logger.Warn("User guard guest token lookup failed", "error", err)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				if guestToken != nil && isGuestAccessAllowed(r, opts) {
					next.ServeHTTP(w, core.WithGuestToken(r, guestToken))
					return
				}
			}

			if opts.RedirectToLogin {
				http.Redirect(w, r, "/login", http.StatusFound)
			} else {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
			}
		})
	}
}

func isGuardBypassed(r *http.Request, opts UserGuardOptions) bool {
	path := r.URL.Path

	for _, exact := range opts.AllowExact {
		if path == exact {
			return true
		}
	}

	for _, prefix := range opts.AllowPrefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}

	if opts.AllowStatic {
		if strings.Contains(path, ".") {
			return true
		}

		accept := r.Header.Get("Accept")
		if !strings.Contains(accept, "text/html") {
			return true
		}
	}

	return false
}

func isGuestAccessAllowed(r *http.Request, opts UserGuardOptions) bool {
	path := r.URL.Path

	for _, exact := range opts.GuestAllowExact {
		if path == exact {
			return true
		}
	}

	for _, prefix := range opts.GuestAllowPrefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}

	return false
}

// isGuestSessionAllowed checks if a guest session (with auth_token_id) is allowed to access the path.
// Enforces token type-specific path restrictions.
func isGuestSessionAllowed(r *http.Request, token *storage.AuthToken, opts UserGuardOptions) bool {
	if token == nil {
		return false
	}

	path := r.URL.Path

	// Type 0 (Admin Signup): Only allow /register/admin/* paths
	if token.Type == storage.TokenTypeAdminSignup {
		return strings.HasPrefix(path, "/register/admin")
	}

	// Type 1 (User Signup): Only allow /register/user/* paths
	if token.Type == storage.TokenTypeUserSignup {
		return strings.HasPrefix(path, "/register/user")
	}

	// Type 2 (General Guest Upload) and Type 3 (Specific Guest Upload):
	// Check against GuestAllowExact and GuestAllowPrefixes
	if token.Type == storage.TokenTypeGeneralGuestUpload || token.Type == storage.TokenTypeSpecificGuestUpload {
		return isGuestAccessAllowed(r, opts)
	}

	// Unknown token type - deny
	return false
}
