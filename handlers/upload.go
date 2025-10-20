package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (files are encrypted client-side, CSRF not applicable)
	},
	ReadBufferSize:    64 * 1024, // 64KB read buffer
	WriteBufferSize:   64 * 1024, // 64KB write buffer
	EnableCompression: false,     // Disable compression (files are already encrypted/compressed)
	HandshakeTimeout:  10 * time.Second,
}

const ownerSecretVersion = 1

type UploadRequest struct {
	FileMetadata            string `json:"fileMetadata"`
	Authorization           string `json:"authorization"`
	TimeLimit               int    `json:"timeLimit"`
	Dlimit                  int    `json:"dlimit"`
	OwnerSecretCiphertext   string `json:"ownerSecretCiphertext,omitempty"`
	OwnerSecretNonce        string `json:"ownerSecretNonce,omitempty"`
	OwnerSecretEphemeralPub string `json:"ownerSecretEphemeralPub,omitempty"`
	OwnerSecretVersion      int    `json:"ownerSecretVersion,omitempty"`
}

type UploadResponse struct {
	URL        string `json:"url,omitempty"`
	OwnerToken string `json:"ownerToken,omitempty"`
	ID         string `json:"id,omitempty"`
	OK         bool   `json:"ok,omitempty"`
	Error      int    `json:"error,omitempty"`
}

func NewUploadHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Upgrade HTTP to WebSocket with proper response headers
		responseHeader := http.Header{}
		responseHeader.Set("Sec-WebSocket-Protocol", r.Header.Get("Sec-WebSocket-Protocol"))

		conn, err := upgrader.Upgrade(w, r, responseHeader)
		if err != nil {
			app.Logger.Error("WebSocket upgrade error",
				"error", err,
				"remote_addr", r.RemoteAddr,
				"user_agent", r.Header.Get("User-Agent"),
				"origin", r.Header.Get("Origin"),
				"upgrade", r.Header.Get("Upgrade"),
				"connection", r.Header.Get("Connection"))
			app.DBLogger.LogFileOp(r, "upload", "", http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "websocket_upgrade")
			return
		}
		defer conn.Close()

		var uploaderUserID *int64
		session, err := app.GetAuthenticatedSession(r)
		if err != nil {
			app.Logger.Warn("Upload session validation failed", "error", err)
		} else if session != nil && session.UserID != nil {
			uploaderUserID = session.UserID
			app.TouchSession(session, r)
		}

		guestToken := core.GuestTokenFromContext(r)
		if session == nil {
			if guestToken == nil {
				guestToken, err = app.GetGuestAuthToken(r)
				if err != nil {
					app.Logger.Error("Upload guest token lookup failed", "error", err)
					app.DBLogger.LogFileOp(r, "upload", "", http.StatusInternalServerError,
						time.Since(startTime).Milliseconds(), err.Error(), "operation", "guest_token_lookup")
					sendError(conn, 500)
					return
				}
			}
			if guestToken == nil {
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusUnauthorized,
					time.Since(startTime).Milliseconds(), "guest upload token missing", "operation", "authorize")
				sendError(conn, 401)
				return
			}
		}

		// Configure connection parameters for better stability
		// Longer timeouts for large file uploads, aggressive keepalive for proxy compatibility
		conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(120 * time.Second))
			return nil
		})

		// More aggressive ping to keep connection alive through reverse proxies (15s instead of 30s)
		pingTicker := time.NewTicker(15 * time.Second)
		defer pingTicker.Stop()

		// Channel to signal upload completion
		done := make(chan struct{})
		defer close(done)

		// Ping goroutine
		go func() {
			for {
				select {
				case <-pingTicker.C:
					if err := conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(10*time.Second)); err != nil {
						return
					}
				case <-done:
					return
				}
			}
		}()

		// Read first message with file metadata
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				app.Logger.Error("WebSocket unexpected close error", "error", err, "remote_addr", r.RemoteAddr)
			} else {
				app.Logger.Error("WebSocket read error", "error", err, "remote_addr", r.RemoteAddr)
			}
			app.DBLogger.LogFileOp(r, "upload", "", http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "websocket_read_metadata")
			return
		}

		var req UploadRequest
		if err := json.Unmarshal(message, &req); err != nil {
			app.Logger.Warn("Invalid upload request JSON", "error", err, "remote_addr", r.RemoteAddr)
			app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "parse_json")
			sendError(conn, 400)
			return
		}

		// Validate request
		if req.FileMetadata == "" || req.Authorization == "" {
			app.Logger.Warn("Missing required fields in upload request",
				"has_metadata", req.FileMetadata != "",
				"has_auth", req.Authorization != "",
				"remote_addr", r.RemoteAddr)
			app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
				time.Since(startTime).Milliseconds(), "Missing required fields", "operation", "validate_request")
			sendError(conn, 400)
			return
		}

		hasOwnerSecret := false
		ownerWrapVersion := 0
		if req.OwnerSecretCiphertext != "" || req.OwnerSecretNonce != "" || req.OwnerSecretEphemeralPub != "" || req.OwnerSecretVersion != 0 {
			hasOwnerSecret = true
			if uploaderUserID == nil {
				app.Logger.Warn("Upload provided owner secret without authenticated session", "remote_addr", r.RemoteAddr)
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusUnauthorized,
					time.Since(startTime).Milliseconds(), "Owner secret provided without session", "operation", "validate_owner_secret")
				sendError(conn, 401)
				return
			}

			if req.OwnerSecretCiphertext == "" || req.OwnerSecretNonce == "" || req.OwnerSecretEphemeralPub == "" {
				app.Logger.Warn("Incomplete owner secret payload", "remote_addr", r.RemoteAddr)
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
					time.Since(startTime).Milliseconds(), "Incomplete owner secret payload", "operation", "validate_owner_secret")
				sendError(conn, 400)
				return
			}

			cipherBytes, err := base64.RawURLEncoding.DecodeString(req.OwnerSecretCiphertext)
			if err != nil || len(cipherBytes) == 0 {
				app.Logger.Warn("Invalid owner secret ciphertext", "error", err)
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
					time.Since(startTime).Milliseconds(), "Invalid owner secret ciphertext", "operation", "validate_owner_secret")
				sendError(conn, 400)
				return
			}

			nonceBytes, err := base64.RawURLEncoding.DecodeString(req.OwnerSecretNonce)
			if err != nil || len(nonceBytes) != 12 {
				app.Logger.Warn("Invalid owner secret nonce", "error", err, "length", len(nonceBytes))
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
					time.Since(startTime).Milliseconds(), "Invalid owner secret nonce", "operation", "validate_owner_secret")
				sendError(conn, 400)
				return
			}

			ephemeralBytes, err := base64.RawURLEncoding.DecodeString(req.OwnerSecretEphemeralPub)
			if err != nil || len(ephemeralBytes) != 32 {
				app.Logger.Warn("Invalid owner secret ephemeral pub", "error", err, "length", len(ephemeralBytes))
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
					time.Since(startTime).Milliseconds(), "Invalid owner secret ephemeral pub", "operation", "validate_owner_secret")
				sendError(conn, 400)
				return
			}

			version := req.OwnerSecretVersion
			if version == 0 {
				version = ownerSecretVersion
			}
			if version != ownerSecretVersion {
				app.Logger.Warn("Unsupported owner secret version", "version", version)
				app.DBLogger.LogFileOp(r, "upload", "", http.StatusBadRequest,
					time.Since(startTime).Milliseconds(), "Unsupported owner secret version", "operation", "validate_owner_secret")
				sendError(conn, 400)
				return
			}

			ownerWrapVersion = version
		}

		// Generate ID and tokens
		id := generateRandomHex(8)
		ownerToken := generateRandomHex(10)
		nonce := auth.GenerateNonce()
		authKey := auth.ExtractAuthKey(req.Authorization)

		// Set defaults
		if req.TimeLimit == 0 {
			req.TimeLimit = app.Config.DefaultExpireSeconds
		}
		if req.Dlimit == 0 {
			req.Dlimit = app.Config.DefaultDownloads
		}

		// Validate limits
		if req.TimeLimit > app.Config.MaxExpireSeconds {
			req.TimeLimit = app.Config.MaxExpireSeconds
		}
		if req.Dlimit > app.Config.MaxDownloads {
			req.Dlimit = app.Config.MaxDownloads
		}

		// Build URL
		baseURL := app.Config.BaseURL
		if baseURL == "" && app.Config.DetectBaseURL {
			// Auto-detect from request
			scheme := "http"
			if r.TLS != nil {
				scheme = "https"
			}
			baseURL = scheme + "://" + r.Host
		} else if baseURL == "" {
			baseURL = "http://localhost:" + app.Config.Port
		}

		// Send response with file info
		resp := UploadResponse{
			URL:        baseURL + "/download/" + id,
			OwnerToken: ownerToken,
			ID:         id,
		}

		conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		if err := conn.WriteJSON(resp); err != nil {
			app.Logger.Error("Error writing upload response", "error", err, "file_id", id)
			return
		}

		// Create temporary file for streaming upload
		tmpDir := filepath.Join(app.Config.FileDir, "tmp")
		os.MkdirAll(tmpDir, 0755)

		tmpFile, err := os.CreateTemp(tmpDir, "upload-*")
		if err != nil {
			app.Logger.Error("Failed to create temp file for upload", "error", err)
			app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "create_temp_file")
			sendError(conn, 500)
			return
		}
		tmpPath := tmpFile.Name()
		defer os.Remove(tmpPath) // Clean up on error

		// Stream file data directly to disk with size limiting
		var totalSize int64
		maxSize := app.Config.MaxFileSize

		for {
			// Reset read deadline for each chunk (longer timeout for large chunks)
			conn.SetReadDeadline(time.Now().Add(120 * time.Second))

			_, data, err := conn.ReadMessage()
			if err != nil {
				tmpFile.Close()
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					app.Logger.Error("Upload interrupted - unexpected close",
						"error", err,
						"file_id", id,
						"bytes_received", totalSize,
						"remote_addr", r.RemoteAddr)
				} else {
					app.Logger.Error("Error reading upload data",
						"error", err,
						"file_id", id,
						"bytes_received", totalSize,
						"remote_addr", r.RemoteAddr)
				}
				app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
					time.Since(startTime).Milliseconds(), err.Error(), "operation", "read_upload_data", "bytes_received", totalSize)
				return
			}

			// Check for EOF marker (single byte 0x00)
			if len(data) == 1 && data[0] == 0 {
				break
			}

			// Check size limit before writing
			if totalSize+int64(len(data)) > maxSize {
				tmpFile.Close()
				app.Logger.Warn("File size limit exceeded",
					"attempted_size", totalSize+int64(len(data)),
					"max_size", maxSize,
					"file_id", id)
				app.DBLogger.LogFileOp(r, "upload", id, http.StatusRequestEntityTooLarge,
					time.Since(startTime).Milliseconds(), "File size limit exceeded",
					"attempted_size", totalSize+int64(len(data)), "max_size", maxSize)
				sendError(conn, 413)
				return
			}

			// Write chunk to disk
			n, err := tmpFile.Write(data)
			if err != nil {
				tmpFile.Close()
				app.Logger.Error("Error writing upload data", "error", err, "file_id", id)
				app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
					time.Since(startTime).Milliseconds(), err.Error(), "operation", "write_chunk", "bytes_written", totalSize)
				sendError(conn, 500)
				return
			}
			totalSize += int64(n)
		}

		// Close and move file to final location
		if err := tmpFile.Close(); err != nil {
			app.Logger.Error("Error closing temp file", "error", err, "file_id", id)
			app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "close_temp_file")
			sendError(conn, 500)
			return
		}

		finalPath := filepath.Join(app.Config.FileDir, id)
		if err := os.Rename(tmpPath, finalPath); err != nil {
			app.Logger.Error("Error moving uploaded file", "error", err, "file_id", id)
			app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "move_file")
			sendError(conn, 500)
			return
		}

		// Save metadata to database
		now := time.Now().Unix()
		meta := &storage.FileMetadata{
			ID:         id,
			OwnerToken: ownerToken,
			Metadata:   req.FileMetadata,
			AuthKey:    authKey,
			Nonce:      nonce,
			DlLimit:    req.Dlimit,
			DlCount:    0,
			Password:   false,
			CreatedAt:  now,
			ExpiresAt:  now + int64(req.TimeLimit),
			UserID:     uploaderUserID,
		}

		if hasOwnerSecret {
			meta.SecretCiphertext = req.OwnerSecretCiphertext
			meta.SecretEphemeralPub = req.OwnerSecretEphemeralPub
			meta.SecretNonce = req.OwnerSecretNonce
			meta.SecretVersion = ownerWrapVersion
		}

		if err := app.DB.CreateFile(meta); err != nil {
			app.Logger.Error("Database error creating file metadata", "error", err, "file_id", id)
			app.DBLogger.LogFileOp(r, "upload", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "save_metadata")
			storage.DeleteFile(app.DB.FileDir(), id)
			sendError(conn, 500)
			return
		}

		app.Logger.Info("File uploaded successfully",
			"file_id", id,
			"size_bytes", totalSize,
			"dl_limit", req.Dlimit,
			"expires_in_seconds", req.TimeLimit)

		// Log successful upload
		logFields := []interface{}{
			"size_bytes", totalSize,
			"dl_limit", req.Dlimit,
			"expire_seconds", req.TimeLimit,
		}
		if guestToken != nil {
			logFields = append(logFields, "auth_token_id", guestToken.ID)
		}
		app.DBLogger.LogFileOp(r, "upload", id, http.StatusOK,
			time.Since(startTime).Milliseconds(), "", logFields...)

		// Schedule cleanup if file expires within 1 hour
		ttl := time.Until(time.Unix(meta.ExpiresAt, 0))
		if ttl <= 1*time.Hour && ttl > 0 {
			app.ScheduleCleanup(id, meta.ExpiresAt)
		}

		// Send success response
		conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		conn.WriteJSON(UploadResponse{OK: true})
	}
}

func sendError(conn *websocket.Conn, code int) {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	if err := conn.WriteJSON(UploadResponse{Error: code}); err != nil {
		// If we can't write the error, just close
		return
	}
	// Give the client time to receive the error before connection closes
	time.Sleep(100 * time.Millisecond)
}

func generateRandomHex(n int) string {
	bytes := make([]byte, n)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
