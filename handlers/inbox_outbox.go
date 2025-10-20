package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
)

type fileWithUserInfoResponse struct {
	ID                          string  `json:"id"`
	OwnerToken                  string  `json:"owner_token,omitempty"` // Only sent if user is owner
	Metadata                    string  `json:"metadata"`
	Nonce                       string  `json:"nonce"`
	DlLimit                     int     `json:"dl_limit"`
	DlCount                     int     `json:"dl_count"`
	Password                    bool    `json:"password"`
	CreatedAt                   int64   `json:"created_at"`
	ExpiresAt                   int64   `json:"expires_at"`
	TimeLimit                   int64   `json:"time_limit"`
	OwnerUserID                 *int64  `json:"owner_user_id,omitempty"`
	RecipientUserID             *int64  `json:"recipient_user_id,omitempty"`
	OwnerName                   string  `json:"owner_name,omitempty"`
	OwnerEmail                  string  `json:"owner_email,omitempty"`
	RecipientName               string  `json:"recipient_name,omitempty"`
	RecipientEmail              string  `json:"recipient_email,omitempty"`
	SecretCiphertext            string  `json:"secret_ciphertext,omitempty"`
	SecretEphemeralPub          string  `json:"secret_ephemeral_pub,omitempty"`
	SecretNonce                 string  `json:"secret_nonce,omitempty"`
	SecretVersion               int     `json:"secret_version,omitempty"`
	RecipientSecretCiphertext   string  `json:"recipient_secret_ciphertext,omitempty"`
	RecipientSecretEphemeralPub string  `json:"recipient_secret_ephemeral_pub,omitempty"`
	RecipientSecretNonce        string  `json:"recipient_secret_nonce,omitempty"`
	RecipientSecretVersion      int     `json:"recipient_secret_version,omitempty"`
}

// NewInboxHandler creates a handler for the inbox endpoint
// GET /api/me/inbox - returns files where user is recipient
func NewInboxHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, err := app.GetAuthenticatedSession(r)
		if err != nil {
			app.Logger.Warn("Inbox: failed to resolve user session", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if session == nil || session.UserID == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		app.TouchSession(session, r)

		files, err := app.DB.GetInboxFilesWithInfo(*session.UserID)
		if err != nil {
			app.Logger.Error("Inbox: failed to load inbox files", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		response := struct {
			Files []fileWithUserInfoResponse `json:"files"`
		}{Files: make([]fileWithUserInfoResponse, 0, len(files))}

		for _, f := range files {
			timeLimit := f.ExpiresAt - f.CreatedAt
			if timeLimit < 0 {
				timeLimit = 0
			}

			item := fileWithUserInfoResponse{
				ID:                          f.ID,
				// Don't include OwnerToken for inbox files (user is recipient, not owner)
				Metadata:                    f.Metadata,
				Nonce:                       f.Nonce,
				DlLimit:                     f.DlLimit,
				DlCount:                     f.DlCount,
				Password:                    f.Password,
				CreatedAt:                   f.CreatedAt,
				ExpiresAt:                   f.ExpiresAt,
				TimeLimit:                   timeLimit,
				OwnerUserID:                 f.OwnerUserID,
				RecipientUserID:             f.RecipientUserID,
				OwnerName:                   f.OwnerName,
				OwnerEmail:                  f.OwnerEmail,
				RecipientName:               f.RecipientName,
				RecipientEmail:              f.RecipientEmail,
				RecipientSecretCiphertext:   f.RecipientSecretCiphertext,
				RecipientSecretEphemeralPub: f.RecipientSecretEphemeralPub,
				RecipientSecretNonce:        f.RecipientSecretNonce,
				RecipientSecretVersion:      f.RecipientSecretVersion,
			}

			// Only include files with encryption fields
			if item.RecipientSecretCiphertext == "" || item.RecipientSecretNonce == "" || item.RecipientSecretEphemeralPub == "" {
				continue
			}

			response.Files = append(response.Files, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Inbox: failed to encode response", "error", err)
		}
	}
}

// NewOutboxHandler creates a handler for the outbox endpoint
// GET /api/me/outbox - returns files where user is owner
func NewOutboxHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, err := app.GetAuthenticatedSession(r)
		if err != nil {
			app.Logger.Warn("Outbox: failed to resolve user session", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if session == nil || session.UserID == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		app.TouchSession(session, r)

		files, err := app.DB.GetOutboxFilesWithInfo(*session.UserID)
		if err != nil {
			app.Logger.Error("Outbox: failed to load outbox files", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		response := struct {
			Files []fileWithUserInfoResponse `json:"files"`
		}{Files: make([]fileWithUserInfoResponse, 0, len(files))}

		for _, f := range files {
			timeLimit := f.ExpiresAt - f.CreatedAt
			if timeLimit < 0 {
				timeLimit = 0
			}

			item := fileWithUserInfoResponse{
				ID:                          f.ID,
				OwnerToken:                  f.OwnerToken, // Include for owners
				Metadata:                    f.Metadata,
				Nonce:                       f.Nonce,
				DlLimit:                     f.DlLimit,
				DlCount:                     f.DlCount,
				Password:                    f.Password,
				CreatedAt:                   f.CreatedAt,
				ExpiresAt:                   f.ExpiresAt,
				TimeLimit:                   timeLimit,
				OwnerUserID:                 f.OwnerUserID,
				RecipientUserID:             f.RecipientUserID,
				OwnerName:                   f.OwnerName,
				OwnerEmail:                  f.OwnerEmail,
				RecipientName:               f.RecipientName,
				RecipientEmail:              f.RecipientEmail,
				SecretCiphertext:            f.SecretCiphertext,
				SecretEphemeralPub:          f.SecretEphemeralPub,
				SecretNonce:                 f.SecretNonce,
				SecretVersion:               f.SecretVersion,
				RecipientSecretCiphertext:   f.RecipientSecretCiphertext,
				RecipientSecretEphemeralPub: f.RecipientSecretEphemeralPub,
				RecipientSecretNonce:        f.RecipientSecretNonce,
				RecipientSecretVersion:      f.RecipientSecretVersion,
			}

			// Only include files with owner encryption fields
			if item.SecretCiphertext == "" || item.SecretNonce == "" || item.SecretEphemeralPub == "" {
				continue
			}

			response.Files = append(response.Files, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Outbox: failed to encode response", "error", err)
		}
	}
}

// NewFileInfoHandler creates a handler for getting file info with user details
// GET /api/me/file-info/:id - returns file metadata with owner/recipient info
func NewFileInfoHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, err := app.GetAuthenticatedSession(r)
		if err != nil {
			app.Logger.Warn("FileInfo: failed to resolve user session", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if session == nil || session.UserID == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		app.TouchSession(session, r)

		// Extract file ID from URL path
		fileID := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/me/file-info/"), "/")
		if fileID == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		fileInfo, err := app.DB.GetFileWithInfo(fileID)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Check if user is owner or recipient
		isOwner := fileInfo.OwnerUserID != nil && *fileInfo.OwnerUserID == *session.UserID
		isRecipient := fileInfo.RecipientUserID != nil && *fileInfo.RecipientUserID == *session.UserID

		if !isOwner && !isRecipient {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		timeLimit := fileInfo.ExpiresAt - fileInfo.CreatedAt
		if timeLimit < 0 {
			timeLimit = 0
		}

		response := fileWithUserInfoResponse{
			ID:                          fileInfo.ID,
			Metadata:                    fileInfo.Metadata,
			Nonce:                       fileInfo.Nonce,
			DlLimit:                     fileInfo.DlLimit,
			DlCount:                     fileInfo.DlCount,
			Password:                    fileInfo.Password,
			CreatedAt:                   fileInfo.CreatedAt,
			ExpiresAt:                   fileInfo.ExpiresAt,
			TimeLimit:                   timeLimit,
			OwnerUserID:                 fileInfo.OwnerUserID,
			RecipientUserID:             fileInfo.RecipientUserID,
			OwnerName:                   fileInfo.OwnerName,
			OwnerEmail:                  fileInfo.OwnerEmail,
			RecipientName:               fileInfo.RecipientName,
			RecipientEmail:              fileInfo.RecipientEmail,
			RecipientSecretCiphertext:   fileInfo.RecipientSecretCiphertext,
			RecipientSecretEphemeralPub: fileInfo.RecipientSecretEphemeralPub,
			RecipientSecretNonce:        fileInfo.RecipientSecretNonce,
			RecipientSecretVersion:      fileInfo.RecipientSecretVersion,
		}

		// Only include owner token if user is owner
		if isOwner {
			response.OwnerToken = fileInfo.OwnerToken
			response.SecretCiphertext = fileInfo.SecretCiphertext
			response.SecretEphemeralPub = fileInfo.SecretEphemeralPub
			response.SecretNonce = fileInfo.SecretNonce
			response.SecretVersion = fileInfo.SecretVersion
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("FileInfo: failed to encode response", "error", err)
		}
	}
}
