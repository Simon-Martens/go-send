package handlers

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/storage"
)

const userSessionDuration = 24 * time.Hour

func NewAuthClaimHandler(db *storage.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		token := strings.TrimPrefix(r.URL.Path, "/auth/claim/")
		token = strings.TrimSpace(token)
		if token == "" {
			http.Error(w, "Invalid token", http.StatusBadRequest)
			return
		}

		hash := auth.HashToken(token)
		link, err := db.ConsumeAuthLink(hash)
		if err != nil {
			switch err {
			case storage.ErrLinkNotFound:
				http.Error(w, "Invalid link", http.StatusNotFound)
			case storage.ErrLinkExpired:
				http.Error(w, "Link expired", http.StatusGone)
			case storage.ErrLinkDepleted:
				http.Error(w, "Link already used", http.StatusGone)
			default:
				http.Error(w, "Unable to redeem link", http.StatusInternalServerError)
			}
			return
		}

		sessionToken, err := auth.GenerateToken(24)
		if err != nil {
			http.Error(w, "Unable to create session", http.StatusInternalServerError)
			return
		}

		session := &storage.Session{
			TokenHash: auth.HashToken(sessionToken),
			UserType:  "user",
			AdminID:   sql.NullInt64{},
			LinkID: sql.NullInt64{
				Int64: link.ID,
				Valid: true,
			},
			ExpiresAt: time.Now().Add(userSessionDuration).Unix(),
			CreatedAt: time.Now().Unix(),
		}

		if _, err := db.CreateSession(session); err != nil {
			http.Error(w, "Unable to persist session", http.StatusInternalServerError)
			return
		}

		auth.SetSessionCookie(w, sessionToken, r.TLS != nil, int(userSessionDuration.Seconds()))
		http.Redirect(w, r, "/", http.StatusSeeOther)
	}
}
