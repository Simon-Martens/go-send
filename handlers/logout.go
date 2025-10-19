package handlers

import (
	"net/http"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/utils"
)

// NewLogoutHandler creates a handler that terminates the user's session
// and redirects to /login. It clears the session cookie and deletes the
// session from the database.
func NewLogoutHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get session cookie if it exists
		cookie, err := r.Cookie(sessionCookie)
		if err == nil && cookie.Value != "" {
			// Hash the token to find the session in DB
			hashedToken := utils.HashToken(cookie.Value)

			// Delete session from database (best effort)
			if err := app.DB.DeleteSessionByToken(hashedToken); err != nil {
				app.Logger.Warn("Failed to delete session during logout", "error", err)
			}

			// Log the logout event
			app.DBLogger.LogRequest(r, http.StatusFound, nil, "user logged out")
		}

		// Clear the session cookie by setting it to expire in the past
		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookie,
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Secure:   r.TLS != nil,
			SameSite: http.SameSiteLaxMode,
			MaxAge:   -1,
			Expires:  time.Unix(0, 0),
		})

		// Redirect to login page
		http.Redirect(w, r, "/login", http.StatusFound)
	}
}
