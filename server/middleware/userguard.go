package middleware

import (
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
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

// RequireUser ensures the requester has an authenticated user session.
func RequireUser(app *core.App, opts UserGuardOptions) func(http.Handler) http.Handler {
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

			if session != nil {
				app.TouchSession(session, r)
				next.ServeHTTP(w, r)
				return
			}

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
