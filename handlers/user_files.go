package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Simon-Martens/go-send/core"
)

type userFileResponse struct {
	ID                 string `json:"id"`
	OwnerToken         string `json:"owner_token"`
	Metadata           string `json:"metadata"`
	Nonce              string `json:"nonce"`
	DlLimit            int    `json:"dl_limit"`
	DlCount            int    `json:"dl_count"`
	Password           bool   `json:"password"`
	CreatedAt          int64  `json:"created_at"`
	ExpiresAt          int64  `json:"expires_at"`
	TimeLimit          int64  `json:"time_limit"`
	SecretCiphertext   string `json:"secret_ciphertext,omitempty"`
	SecretEphemeralPub string `json:"secret_ephemeral_pub,omitempty"`
	SecretNonce        string `json:"secret_nonce,omitempty"`
	SecretVersion      int    `json:"secret_version,omitempty"`
}

func NewUserFilesHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, err := app.GetAuthenticatedSession(r)
		if err != nil {
			app.Logger.Warn("Failed to resolve user session", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if session == nil || session.UserID == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		app.TouchSession(session, r)

		files, err := app.DB.GetFilesByUserID(*session.UserID)
		if err != nil {
			app.Logger.Error("Failed to load user files", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		response := struct {
			Files []userFileResponse `json:"files"`
		}{Files: make([]userFileResponse, 0, len(files))}

		for _, f := range files {
			timeLimit := f.ExpiresAt - f.CreatedAt
			if timeLimit < 0 {
				timeLimit = 0
			}

			item := userFileResponse{
				ID:                 f.ID,
				OwnerToken:         f.OwnerToken,
				Metadata:           f.Metadata,
				Nonce:              f.Nonce,
				DlLimit:            f.DlLimit,
				DlCount:            f.DlCount,
				Password:           f.Password,
				CreatedAt:          f.CreatedAt,
				ExpiresAt:          f.ExpiresAt,
				TimeLimit:          timeLimit,
				SecretCiphertext:   f.SecretCiphertext,
				SecretEphemeralPub: f.SecretEphemeralPub,
				SecretNonce:        f.SecretNonce,
				SecretVersion:      f.SecretVersion,
			}

			if item.SecretCiphertext == "" || item.SecretNonce == "" || item.SecretEphemeralPub == "" {
				// Skip entries that predate the wrapped-secret migration
				continue
			}

			response.Files = append(response.Files, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Failed to encode user files response", "error", err)
		}
	}
}
