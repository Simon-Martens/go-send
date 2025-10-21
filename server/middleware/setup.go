package middleware

import (
	"net/http"

	"github.com/Simon-Martens/go-send/core"
)

// RedirectToSetup redirects requests to the initial admin setup page when no users exist.
// This middleware is only applied when the server starts with no users.
// It checks on every request until a user is created, then stops checking.
func RedirectToSetup(app *core.App) func(http.Handler) http.Handler {
	userExists := false // Closure state: starts false, flips to true once a user exists

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Fast path: once we know users exist, skip all checks
			if userExists {
				next.ServeHTTP(w, r)
				return
			}

			// Check if a user was created
			count, err := app.DB.CountUsers(nil)
			if err == nil && count > 0 {
				userExists = true // Flip the flag, never check again
				next.ServeHTTP(w, r)
				return
			}

			// Still no users - redirect only GET / requests
			if r.Method == http.MethodGet && r.URL.Path == "/" {
				http.Redirect(w, r, app.InitialAdminClaimURL, http.StatusTemporaryRedirect)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
