package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

type recipientInfoDetailed struct {
	UserID             int64  `json:"user_id"`
	Name               string `json:"name,omitempty"`
	Email              string `json:"email,omitempty"`
	SecretCiphertext   string `json:"secret_ciphertext,omitempty"`
	SecretEphemeralPub string `json:"secret_ephemeral_pub,omitempty"`
	SecretNonce        string `json:"secret_nonce,omitempty"`
	SecretVersion      int    `json:"secret_version,omitempty"`
}

type fileWithUserInfoResponse struct {
	ID                 string                  `json:"id"`
	OwnerToken         string                  `json:"owner_token,omitempty"` // Only sent if user is owner
	Metadata           string                  `json:"metadata"`
	Nonce              string                  `json:"nonce"`
	DlLimit            int                     `json:"dl_limit"`
	DlCount            int                     `json:"dl_count"`
	Password           bool                    `json:"password"`
	CreatedAt          int64                   `json:"created_at"`
	ExpiresAt          int64                   `json:"expires_at"`
	TimeLimit          int64                   `json:"time_limit"`
	OwnerUserID        *int64                  `json:"owner_user_id,omitempty"`
	OwnerName          string                  `json:"owner_name,omitempty"`
	OwnerEmail         string                  `json:"owner_email,omitempty"`
	SecretCiphertext   string                  `json:"secret_ciphertext,omitempty"`
	SecretEphemeralPub string                  `json:"secret_ephemeral_pub,omitempty"`
	SecretNonce        string                  `json:"secret_nonce,omitempty"`
	SecretVersion      int                     `json:"secret_version,omitempty"`
	Recipients         []recipientInfoDetailed `json:"recipients,omitempty"`
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

			// Find the recipient record for this user
			var myRecipientRecord *storage.RecipientWithUserInfo
			for _, r := range f.Recipients {
				if r.UserID == *session.UserID {
					myRecipientRecord = r
					break
				}
			}

			if myRecipientRecord == nil {
				// User is not a recipient of this file, skip
				continue
			}

			item := fileWithUserInfoResponse{
				ID:                 f.ID,
				// Don't include OwnerToken for inbox files (user is recipient, not owner)
				Metadata:           f.Metadata,
				Nonce:              f.Nonce,
				DlLimit:            f.DlLimit,
				DlCount:            f.DlCount,
				Password:           f.Password,
				CreatedAt:          f.CreatedAt,
				ExpiresAt:          f.ExpiresAt,
				TimeLimit:          timeLimit,
				OwnerUserID:        f.OwnerUserID,
				OwnerName:          f.OwnerName,
				OwnerEmail:         f.OwnerEmail,
				SecretCiphertext:   myRecipientRecord.SecretCiphertext,
				SecretEphemeralPub: myRecipientRecord.SecretEphemeralPub,
				SecretNonce:        myRecipientRecord.SecretNonce,
				SecretVersion:      myRecipientRecord.SecretVersion,
			}

			// Only include files with encryption fields
			if item.SecretCiphertext == "" || item.SecretNonce == "" || item.SecretEphemeralPub == "" {
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
				ID:                 f.ID,
				OwnerToken:         f.OwnerToken, // Include for owners
				Metadata:           f.Metadata,
				Nonce:              f.Nonce,
				DlLimit:            f.DlLimit,
				DlCount:            f.DlCount,
				Password:           f.Password,
				CreatedAt:          f.CreatedAt,
				ExpiresAt:          f.ExpiresAt,
				TimeLimit:          timeLimit,
				OwnerUserID:        f.OwnerUserID,
				OwnerName:          f.OwnerName,
				OwnerEmail:         f.OwnerEmail,
				SecretCiphertext:   f.SecretCiphertext,
				SecretEphemeralPub: f.SecretEphemeralPub,
				SecretNonce:        f.SecretNonce,
				SecretVersion:      f.SecretVersion,
			}

			// Only include files with owner encryption fields
			if item.SecretCiphertext == "" || item.SecretNonce == "" || item.SecretEphemeralPub == "" {
				continue
			}

			// Add recipients
			if len(f.Recipients) > 0 {
				item.Recipients = make([]recipientInfoDetailed, 0, len(f.Recipients))
				for _, r := range f.Recipients {
					item.Recipients = append(item.Recipients, recipientInfoDetailed{
						UserID:             r.UserID,
						Name:               r.UserName,
						Email:              r.UserEmail,
						SecretCiphertext:   r.SecretCiphertext,
						SecretEphemeralPub: r.SecretEphemeralPub,
						SecretNonce:        r.SecretNonce,
						SecretVersion:      r.SecretVersion,
					})
				}
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
		var myRecipientRecord *storage.RecipientWithUserInfo
		for _, r := range fileInfo.Recipients {
			if r.UserID == *session.UserID {
				myRecipientRecord = r
				break
			}
		}
		isRecipient := myRecipientRecord != nil

		if !isOwner && !isRecipient {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		timeLimit := fileInfo.ExpiresAt - fileInfo.CreatedAt
		if timeLimit < 0 {
			timeLimit = 0
		}

		response := fileWithUserInfoResponse{
			ID:          fileInfo.ID,
			Metadata:    fileInfo.Metadata,
			Nonce:       fileInfo.Nonce,
			DlLimit:     fileInfo.DlLimit,
			DlCount:     fileInfo.DlCount,
			Password:    fileInfo.Password,
			CreatedAt:   fileInfo.CreatedAt,
			ExpiresAt:   fileInfo.ExpiresAt,
			TimeLimit:   timeLimit,
			OwnerUserID: fileInfo.OwnerUserID,
			OwnerName:   fileInfo.OwnerName,
			OwnerEmail:  fileInfo.OwnerEmail,
		}

		// Only include owner token if user is owner
		if isOwner {
			response.OwnerToken = fileInfo.OwnerToken
			response.SecretCiphertext = fileInfo.SecretCiphertext
			response.SecretEphemeralPub = fileInfo.SecretEphemeralPub
			response.SecretNonce = fileInfo.SecretNonce
			response.SecretVersion = fileInfo.SecretVersion

			// Include all recipients if user is owner
			if len(fileInfo.Recipients) > 0 {
				response.Recipients = make([]recipientInfoDetailed, 0, len(fileInfo.Recipients))
				for _, r := range fileInfo.Recipients {
					response.Recipients = append(response.Recipients, recipientInfoDetailed{
						UserID:             r.UserID,
						Name:               r.UserName,
						Email:              r.UserEmail,
						SecretCiphertext:   r.SecretCiphertext,
						SecretEphemeralPub: r.SecretEphemeralPub,
						SecretNonce:        r.SecretNonce,
						SecretVersion:      r.SecretVersion,
					})
				}
			}
		} else if myRecipientRecord != nil {
			// User is recipient, include their secret
			response.SecretCiphertext = myRecipientRecord.SecretCiphertext
			response.SecretEphemeralPub = myRecipientRecord.SecretEphemeralPub
			response.SecretNonce = myRecipientRecord.SecretNonce
			response.SecretVersion = myRecipientRecord.SecretVersion
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("FileInfo: failed to encode response", "error", err)
		}
	}
}
