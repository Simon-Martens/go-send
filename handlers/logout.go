package handlers

import (
	"net/http"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
)

func NewLogoutHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := auth.GetSessionFromRequest(app.DB, r)
		if err == nil && session != nil {
			if session.ID != 0 {
				if err := app.DB.DeleteSessionByID(session.ID); err != nil {
					app.Logger.Warn("Failed to delete session during logout", "error", err)
				}
			}
		}

		auth.ClearSessionCookie(w, r.TLS != nil)
		http.Redirect(w, r, "/login", http.StatusSeeOther)
	}
}
