package handlers

import (
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/yourusername/send-go/auth"
	"github.com/yourusername/send-go/storage"
)

func NewDownloadHandler(db *storage.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract ID from path
		id := strings.TrimPrefix(r.URL.Path, "/api/download/")
		id = strings.TrimPrefix(id, "blob/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := db.GetFile(id)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		// Verify HMAC auth
		authHeader := r.Header.Get("Authorization")
		if !auth.VerifyHMAC(authHeader, meta.AuthKey, meta.Nonce) {
			// Generate new nonce for retry
			newNonce := auth.GenerateNonce()
			db.UpdateNonce(id, newNonce)
			w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Open file
		file, err := storage.OpenFile(id)
		if err != nil {
			log.Println("Error opening file:", err)
			http.NotFound(w, r)
			return
		}
		defer file.Close()

		// Get file size
		size, err := storage.GetFileSize(id)
		if err != nil {
			log.Println("Error getting file size:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Stream file to client
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Length", strconv.FormatInt(size, 10))
		w.WriteHeader(http.StatusOK)

		if _, err := io.Copy(w, file); err != nil {
			log.Println("Error streaming file:", err)
			return
		}

		// Increment download count
		if err := db.IncrementDownload(id); err != nil {
			log.Println("Error incrementing download:", err)
		}

		// Check if we've reached download limit
		meta, _ = db.GetFile(id)
		if meta != nil && meta.DlCount >= meta.DlLimit {
			// Delete file and metadata
			db.DeleteFile(id)
			storage.DeleteFile(id)
		}
	}
}
