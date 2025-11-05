package handlers

import (
	"crypto/subtle"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

func NewMetadataHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/metadata/"), "/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := app.DB.GetFile(id)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Verify HMAC auth
		authHeader := r.Header.Get("Authorization")
		if !auth.VerifyHMAC(authHeader, meta.AuthKey, meta.Nonce, app.Logger) {
			// Generate new nonce for retry
			newNonce, err := auth.GenerateNonce()
			if err != nil {
				app.Logger.Error("Failed to generate nonce", "error", err)
				http.Error(w, "Internal server error", http.StatusInternalServerError)
				return
			}
			app.DB.UpdateNonce(id, newNonce)
			w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)
			app.Logger.Warn("Metadata auth failed", "file_id", id)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Rotate nonce after successful auth
		newNonce, err := auth.GenerateNonce()
		if err != nil {
			app.Logger.Error("Failed to generate nonce", "error", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		app.DB.UpdateNonce(id, newNonce)
		w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)

		// Calculate TTL
		now := time.Now().Unix()
		ttl := (meta.ExpiresAt - now) * 1000 // Convert to milliseconds

		response := map[string]interface{}{
			"metadata":      meta.Metadata,
			"finalDownload": meta.DlCount+1 == meta.DlLimit,
			"ttl":           ttl,
		}

		// Include owner encryption fields if present (allows owner to decrypt master key)
		if meta.SecretCiphertext != "" {
			response["ownerSecretCiphertext"] = meta.SecretCiphertext
			response["ownerSecretEphemeralPub"] = meta.SecretEphemeralPub
			response["ownerSecretNonce"] = meta.SecretNonce
			response["ownerSecretVersion"] = meta.SecretVersion
		}

		// Include recipient encryption fields if present (allows recipients to decrypt master key)
		recipients, err := app.DB.GetRecipientsWithUserInfoByFileID(id)
		if err == nil && len(recipients) > 0 {
			recipientList := make([]map[string]interface{}, 0, len(recipients))
			for _, r := range recipients {
				recipientList = append(recipientList, map[string]interface{}{
					"userId":             r.UserID,
					"secretCiphertext":   r.SecretCiphertext,
					"secretEphemeralPub": r.SecretEphemeralPub,
					"secretNonce":        r.SecretNonce,
					"secretVersion":      r.SecretVersion,
				})
			}
			response["recipients"] = recipientList
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func NewExistsHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/exists/"), "/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		exists, err := app.DB.Exists(id)
		if err != nil || !exists {
			http.NotFound(w, r)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func NewDeleteHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Extract session info for logging
		var sessionID, userID *int64
		session, _ := app.GetAuthenticatedSession(r)
		if session != nil {
			sessionID = &session.ID
			userID = session.UserID
		}

		if r.Method != http.MethodPost {
			app.DBLogger.LogFileOp(r, "deletion", "", http.StatusMethodNotAllowed,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "Method not allowed")
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/delete/"), "/")

		if id == "" {
			app.DBLogger.LogFileOp(r, "deletion", "", http.StatusBadRequest,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "Missing file ID")
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Parse request body
		var req struct {
			OwnerToken string `json:"owner_token"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			app.DBLogger.LogFileOp(r, "deletion", id, http.StatusBadRequest,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "Invalid request body")
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := app.DB.GetFile(id)
		if err != nil {
			app.DBLogger.LogFileOp(r, "deletion", id, http.StatusNotFound,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "File not found")
			http.NotFound(w, r)
			return
		}

		// Verify owner token using constant-time comparison
		if len(meta.OwnerToken) == 0 || len(req.OwnerToken) == 0 {
			app.DBLogger.LogFileOp(r, "deletion", id, http.StatusUnauthorized,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "Missing owner token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		if subtle.ConstantTimeCompare([]byte(meta.OwnerToken), []byte(req.OwnerToken)) != 1 {
			app.DBLogger.LogFileOp(r, "deletion", id, http.StatusUnauthorized,
				time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "Invalid owner token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Log successful deletion BEFORE deleting (so owner info can be resolved)
		app.DBLogger.LogFileOp(r, "deletion", id, http.StatusOK,
			time.Since(startTime).Milliseconds(), sessionID, userID, app.DB, "", "deletion_type", "user_request")

		// Cancel any scheduled cleanup goroutine
		app.CancelCleanup(id)

		// Delete file and metadata
		app.DB.DeleteFileRecord(id)
		storage.DeleteFile(app.DB.FileDir(), id)

		w.WriteHeader(http.StatusOK)
	}
}

func NewPasswordHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/password/"), "/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Parse request body
		var req struct {
			OwnerToken string `json:"owner_token"`
			Auth       string `json:"auth"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := app.DB.GetFile(id)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Verify owner token using constant-time comparison
		if len(meta.OwnerToken) == 0 || len(req.OwnerToken) == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		if subtle.ConstantTimeCompare([]byte(meta.OwnerToken), []byte(req.OwnerToken)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Set password (update auth key)
		if err := app.DB.SetPassword(id, req.Auth); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func NewInfoHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/info/"), "/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Parse request body
		var req struct {
			OwnerToken string `json:"owner_token"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := app.DB.GetFile(id)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Verify owner token using constant-time comparison
		if len(meta.OwnerToken) == 0 || len(req.OwnerToken) == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		if subtle.ConstantTimeCompare([]byte(meta.OwnerToken), []byte(req.OwnerToken)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Calculate TTL
		now := time.Now().Unix()
		ttl := (meta.ExpiresAt - now) * 1000 // Convert to milliseconds

		response := map[string]interface{}{
			"dtotal": meta.DlCount,
			"dlimit": meta.DlLimit,
			"ttl":    ttl,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
