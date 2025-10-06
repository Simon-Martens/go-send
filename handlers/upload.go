package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
	ReadBufferSize:  64 * 1024, // 64KB read buffer
	WriteBufferSize: 64 * 1024, // 64KB write buffer
	EnableCompression: false,    // Disable compression (files are already encrypted/compressed)
}

type UploadRequest struct {
	FileMetadata  string `json:"fileMetadata"`
	Authorization string `json:"authorization"`
	TimeLimit     int    `json:"timeLimit"`
	Dlimit        int    `json:"dlimit"`
}

type UploadResponse struct {
	URL        string `json:"url,omitempty"`
	OwnerToken string `json:"ownerToken,omitempty"`
	ID         string `json:"id,omitempty"`
	OK         bool   `json:"ok,omitempty"`
	Error      int    `json:"error,omitempty"`
}

func NewUploadHandler(db *storage.DB, cfg *config.Config, scheduleCleanup func(fileID string, expiresAt int64) bool, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if cfg.UploadGuard {
			if _, err := auth.GetSessionFromRequest(db, r); err != nil {
				if errors.Is(err, storage.ErrSessionExpired) {
					auth.ClearSessionCookie(w, r.TLS != nil)
				}
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logger.Error("WebSocket upgrade error", "error", err)
			return
		}
		defer conn.Close()

		// Configure connection parameters
		// Pong handler: reset read deadline when pong is received
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		// Start ping ticker to keep connection alive
		pingTicker := time.NewTicker(30 * time.Second)
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
				logger.Error("WebSocket unexpected close error", "error", err, "remote_addr", r.RemoteAddr)
			} else {
				logger.Error("WebSocket read error", "error", err, "remote_addr", r.RemoteAddr)
			}
			return
		}

		var req UploadRequest
		if err := json.Unmarshal(message, &req); err != nil {
			sendError(conn, 400)
			return
		}

		// Validate request
		if req.FileMetadata == "" || req.Authorization == "" {
			sendError(conn, 400)
			return
		}

		// Generate ID and tokens
		id := generateRandomHex(8)
		ownerToken := generateRandomHex(10)
		nonce := auth.GenerateNonce()
		authKey := auth.ExtractAuthKey(req.Authorization)

		// Set defaults
		if req.TimeLimit == 0 {
			req.TimeLimit = cfg.DefaultExpireSeconds
		}
		if req.Dlimit == 0 {
			req.Dlimit = cfg.DefaultDownloads
		}

		// Validate limits
		if req.TimeLimit > cfg.MaxExpireSeconds {
			req.TimeLimit = cfg.MaxExpireSeconds
		}
		if req.Dlimit > cfg.MaxDownloads {
			req.Dlimit = cfg.MaxDownloads
		}

		// Build URL
		baseURL := cfg.BaseURL
		if baseURL == "" && cfg.DetectBaseURL {
			// Auto-detect from request
			scheme := "http"
			if r.TLS != nil {
				scheme = "https"
			}
			baseURL = scheme + "://" + r.Host
		} else if baseURL == "" {
			baseURL = "http://localhost:" + cfg.Port
		}

		// Send response with file info
		resp := UploadResponse{
			URL:        baseURL + "/download/" + id,
			OwnerToken: ownerToken,
			ID:         id,
		}

		conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		if err := conn.WriteJSON(resp); err != nil {
			logger.Error("Error writing upload response", "error", err, "file_id", id)
			return
		}

		// Create temporary file for streaming upload
		tmpDir := filepath.Join(cfg.FileDir, "tmp")
		os.MkdirAll(tmpDir, 0755)

		tmpFile, err := os.CreateTemp(tmpDir, "upload-*")
		if err != nil {
			logger.Error("Failed to create temp file for upload", "error", err)
			sendError(conn, 500)
			return
		}
		tmpPath := tmpFile.Name()
		defer os.Remove(tmpPath) // Clean up on error

		// Stream file data directly to disk with size limiting
		var totalSize int64
		maxSize := cfg.MaxFileSize

		for {
			// Reset read deadline for each chunk
			conn.SetReadDeadline(time.Now().Add(60 * time.Second))

			_, data, err := conn.ReadMessage()
			if err != nil {
				tmpFile.Close()
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					logger.Error("Upload interrupted - unexpected close",
						"error", err,
						"file_id", id,
						"bytes_received", totalSize,
						"remote_addr", r.RemoteAddr)
				} else {
					logger.Error("Error reading upload data",
						"error", err,
						"file_id", id,
						"bytes_received", totalSize,
						"remote_addr", r.RemoteAddr)
				}
				return
			}

			// Check for EOF marker (single byte 0x00)
			if len(data) == 1 && data[0] == 0 {
				break
			}

			// Check size limit before writing
			if totalSize+int64(len(data)) > maxSize {
				tmpFile.Close()
				logger.Warn("File size limit exceeded",
					"attempted_size", totalSize+int64(len(data)),
					"max_size", maxSize,
					"file_id", id)
				sendError(conn, 413)
				return
			}

			// Write chunk to disk
			n, err := tmpFile.Write(data)
			if err != nil {
				tmpFile.Close()
				logger.Error("Error writing upload data", "error", err, "file_id", id)
				sendError(conn, 500)
				return
			}
			totalSize += int64(n)
		}

		// Close and move file to final location
		if err := tmpFile.Close(); err != nil {
			logger.Error("Error closing temp file", "error", err, "file_id", id)
			sendError(conn, 500)
			return
		}

		finalPath := filepath.Join(cfg.FileDir, id)
		if err := os.Rename(tmpPath, finalPath); err != nil {
			logger.Error("Error moving uploaded file", "error", err, "file_id", id)
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
		}

		if err := db.CreateFile(meta); err != nil {
			logger.Error("Database error creating file metadata", "error", err, "file_id", id)
			storage.DeleteFile(db.FileDir(), id)
			sendError(conn, 500)
			return
		}

		logger.Info("File uploaded successfully",
			"file_id", id,
			"size_bytes", totalSize,
			"dl_limit", req.Dlimit,
			"expires_in_seconds", req.TimeLimit)

		// Schedule cleanup if file expires within 1 hour
		ttl := time.Until(time.Unix(meta.ExpiresAt, 0))
		if ttl <= 1*time.Hour && ttl > 0 {
			scheduleCleanup(id, meta.ExpiresAt)
		}

		// Send success response
		conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		conn.WriteJSON(UploadResponse{OK: true})
	}
}

func sendError(conn *websocket.Conn, code int) {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	conn.WriteJSON(UploadResponse{Error: code})
}

func generateRandomHex(n int) string {
	bytes := make([]byte, n)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
