package handlers

import (
	"log/slog"
	"net/http"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/storage"
)

func NewLogoutHandler(db *storage.DB, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := auth.GetSessionFromRequest(db, r)
		if err == nil && session != nil {
			if session.ID != 0 {
				if err := db.DeleteSessionByID(session.ID); err != nil {
					logger.Warn("Failed to delete session during logout", "error", err)
				}
			}
		}

		auth.ClearSessionCookie(w, r.TLS != nil)
		http.Redirect(w, r, "/login", http.StatusSeeOther)
	}
}
