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
			newNonce := auth.GenerateNonce()
			app.DB.UpdateNonce(id, newNonce)
			w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)
			app.Logger.Warn("Metadata auth failed", "file_id", id)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Rotate nonce after successful auth
		newNonce := auth.GenerateNonce()
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

		// Include recipient encryption fields if present (allows recipient to decrypt master key)
		if meta.RecipientUserID != nil && meta.RecipientSecretCiphertext != "" {
			response["recipientUserId"] = *meta.RecipientUserID
			response["recipientSecretCiphertext"] = meta.RecipientSecretCiphertext
			response["recipientSecretEphemeralPub"] = meta.RecipientSecretEphemeralPub
			response["recipientSecretNonce"] = meta.RecipientSecretNonce
			response["recipientSecretVersion"] = meta.RecipientSecretVersion
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
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/delete/"), "/")

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
