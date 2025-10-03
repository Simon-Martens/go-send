package handlers

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/yourusername/send-go/auth"
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

func NewUploadHandler(db *storage.DB) http.HandlerFunc {
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
			req.TimeLimit = 86400 // 1 day
		}
		if req.Dlimit == 0 {
			req.Dlimit = 1
		}

		// Validate limits
		if req.TimeLimit > 604800 { // 7 days
			req.TimeLimit = 604800
		}
		if req.Dlimit > 100 {
			req.Dlimit = 100
		}

		// Send response with file info
		resp := UploadResponse{
			URL:        "http://localhost:8080/download/" + id,
			OwnerToken: ownerToken,
			ID:         id,
		}

		if err := conn.WriteJSON(resp); err != nil {
			log.Println("Write error:", err)
			return
		}

		// Receive file data
		var fileData bytes.Buffer
		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				log.Println("Read error:", err)
				return
			}

			// Check for EOF marker (single byte 0x00)
			if len(data) == 1 && data[0] == 0 {
				break
			}

			fileData.Write(data)
		}

		// Save file to disk
		if err := storage.SaveFile(id, &fileData); err != nil {
			log.Println("Save file error:", err)
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
