package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

type recipientInfo struct {
	UserID int64  `json:"user_id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
}

type userFileResponse struct {
	ID                 string          `json:"id"`
	OwnerToken         string          `json:"owner_token"`
	Metadata           string          `json:"metadata"`
	Nonce              string          `json:"nonce"`
	DlLimit            int             `json:"dl_limit"`
	DlCount            int             `json:"dl_count"`
	Password           bool            `json:"password"`
	CreatedAt          int64           `json:"created_at"`
	ExpiresAt          int64           `json:"expires_at"`
	TimeLimit          int64           `json:"time_limit"`
	SecretCiphertext   string          `json:"secret_ciphertext,omitempty"`
	SecretEphemeralPub string          `json:"secret_ephemeral_pub,omitempty"`
	SecretNonce        string          `json:"secret_nonce,omitempty"`
	SecretVersion      int             `json:"secret_version,omitempty"`
	OwnerString        string          `json:"owner_string,omitempty"`
	AuthString         string          `json:"auth_string,omitempty"`
	Recipients         []recipientInfo `json:"recipients,omitempty"`
}

func NewUserFilesHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures user authentication
		session, _ := app.GetAuthenticatedSession(r)

		files, err := app.DB.GetFilesByUserIDWithInfo(*session.UserID)
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

			var item userFileResponse
			isOwner := f.OwnerUserID != nil && *f.OwnerUserID == *session.UserID

			// Check if user is a recipient
			var recipientRecord *storage.RecipientWithUserInfo
			for _, r := range f.Recipients {
				if r.UserID == *session.UserID {
					recipientRecord = r
					break
				}
			}

			if isOwner {
				// User is the owner
				item = userFileResponse{
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
			} else if recipientRecord != nil {
				// User is a recipient
				item = userFileResponse{
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
					SecretCiphertext:   recipientRecord.SecretCiphertext,
					SecretEphemeralPub: recipientRecord.SecretEphemeralPub,
					SecretNonce:        recipientRecord.SecretNonce,
					SecretVersion:      recipientRecord.SecretVersion,
				}
			} else {
				// User is neither owner nor recipient, skip
				continue
			}

			if item.SecretCiphertext == "" || item.SecretNonce == "" || item.SecretEphemeralPub == "" {
				// Skip entries that predate the wrapped-secret migration
				continue
			}

			// Set owner_string or auth_string based on who uploaded the file
			if f.OwnerUserID != nil {
				// File uploaded by a logged-in user
				item.OwnerString = f.OwnerName
			} else if f.OwnerAuthTokenID != nil {
				// File uploaded by a guest with auth link
				item.AuthString = f.AuthLinkLabel
			}

			// Set recipients list
			if len(f.Recipients) > 0 {
				item.Recipients = make([]recipientInfo, 0, len(f.Recipients))
				for _, r := range f.Recipients {
					item.Recipients = append(item.Recipients, recipientInfo{
						UserID: r.UserID,
						Name:   r.UserName,
						Email:  r.UserEmail,
					})
				}
			}

			response.Files = append(response.Files, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Failed to encode user files response", "error", err)
		}
	}
}
