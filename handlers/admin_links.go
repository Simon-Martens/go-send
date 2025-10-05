package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/storage"
)

type CreateAuthLinkRequest struct {
	ExpiresInSeconds *int    `json:"expiresInSeconds,omitempty"`
	Username         *string `json:"username,omitempty"`
}

type CreateAuthLinkResponse struct {
	Token    string  `json:"token"`
	URL      string  `json:"url"`
	Username *string `json:"username,omitempty"`
}

func NewCreateAuthLinkHandler(db *storage.DB, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, err := auth.GetSessionFromRequest(db, r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if session.UserType != "admin" || !session.AdminID.Valid {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		var req CreateAuthLinkRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		now := time.Now()
		expires := sql.NullInt64{}
		if req.ExpiresInSeconds != nil {
			if *req.ExpiresInSeconds <= 0 {
				http.Error(w, "expiresInSeconds must be positive", http.StatusBadRequest)
				return
			}
			expires = sql.NullInt64{Int64: now.Add(time.Duration(*req.ExpiresInSeconds) * time.Second).Unix(), Valid: true}
		}

		token, err := auth.GenerateToken(24)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		hash := auth.HashToken(token)

		var username sql.NullString
		if req.Username != nil {
			if value := strings.TrimSpace(*req.Username); value != "" {
				username = sql.NullString{String: value, Valid: true}
			}
		}

		link := &storage.AuthLink{
			TokenHash: hash,
			ExpiresAt: expires,
			CreatedAt: now.Unix(),
			CreatedBy: session.AdminID,
			Username:  username,
		}

		if _, err := db.CreateAuthLink(link); err != nil {
			http.Error(w, "Failed to store token", http.StatusInternalServerError)
			return
		}

		url := buildAuthLinkURL(cfg, r, token)

		w.Header().Set("Content-Type", "application/json")
		var usernamePtr *string
		if username.Valid {
			usernamePtr = &username.String
		}

		json.NewEncoder(w).Encode(CreateAuthLinkResponse{Token: token, URL: url, Username: usernamePtr})
	}
}

func buildAuthLinkURL(cfg *config.Config, r *http.Request, token string) string {
	base := cfg.BaseURL
	if base == "" && cfg.DetectBaseURL {
		scheme := "http"
		if r.TLS != nil {
			scheme = "https"
		}
		base = scheme + "://" + r.Host
	} else if base == "" {
		base = "http://localhost:" + cfg.Port
	}
	if len(base) > 0 && base[len(base)-1] == '/' {
		base = base[:len(base)-1]
	}
	return base + "/auth/claim/" + token
}
