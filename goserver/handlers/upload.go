package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/websocket"
	"github.com/yourusername/send-go/auth"
	"github.com/yourusername/send-go/config"
	"github.com/yourusername/send-go/storage"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
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

func NewUploadHandler(db *storage.DB, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Upgrade error:", err)
			return
		}
		defer conn.Close()

		// Read first message with file metadata
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
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

		if err := conn.WriteJSON(resp); err != nil {
			log.Println("Write error:", err)
			return
		}

		// Create temporary file for streaming upload
		tmpDir := filepath.Join(cfg.FileDir, "tmp")
		os.MkdirAll(tmpDir, 0755)

		tmpFile, err := os.CreateTemp(tmpDir, "upload-*")
		if err != nil {
			log.Println("Create temp file error:", err)
			sendError(conn, 500)
			return
		}
		tmpPath := tmpFile.Name()
		defer os.Remove(tmpPath) // Clean up on error

		// Stream file data directly to disk with size limiting
		var totalSize int64
		maxSize := cfg.MaxFileSize

		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				tmpFile.Close()
				log.Println("Read error:", err)
				return
			}

			// Check for EOF marker (single byte 0x00)
			if len(data) == 1 && data[0] == 0 {
				break
			}

			// Check size limit before writing
			if totalSize+int64(len(data)) > maxSize {
				tmpFile.Close()
				log.Printf("File size limit exceeded: %d > %d", totalSize+int64(len(data)), maxSize)
				sendError(conn, 413)
				return
			}

			// Write chunk to disk
			n, err := tmpFile.Write(data)
			if err != nil {
				tmpFile.Close()
				log.Println("Write error:", err)
				sendError(conn, 500)
				return
			}
			totalSize += int64(n)
		}

		// Close and move file to final location
		if err := tmpFile.Close(); err != nil {
			log.Println("Close temp file error:", err)
			sendError(conn, 500)
			return
		}

		finalPath := filepath.Join(cfg.FileDir, id)
		if err := os.Rename(tmpPath, finalPath); err != nil {
			log.Println("Move file error:", err)
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
			log.Println("DB error:", err)
			storage.DeleteFile(id)
			sendError(conn, 500)
			return
		}

		// Send success response
		conn.WriteJSON(UploadResponse{OK: true})
	}
}

func sendError(conn *websocket.Conn, code int) {
	conn.WriteJSON(UploadResponse{Error: code})
}

func generateRandomHex(n int) string {
	bytes := make([]byte, n)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
