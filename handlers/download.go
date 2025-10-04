package handlers

import (
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/storage"
)

func NewDownloadHandler(db *storage.DB, cancelCleanup func(string), logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract ID from path
		id := strings.TrimPrefix(r.URL.Path, "/api/download/")
		id = strings.TrimPrefix(id, "blob/")
		id = strings.TrimSuffix(id, "/")

		if id == "" {
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := db.GetFile(id)
		if err != nil {
			logger.Debug("File not found for download", "file_id", id)
			http.NotFound(w, r)
			return
		}

		// Verify HMAC auth
		authHeader := r.Header.Get("Authorization")
		if !auth.VerifyHMAC(authHeader, meta.AuthKey, meta.Nonce, logger) {
			// Generate new nonce for retry
			newNonce := auth.GenerateNonce()
			db.UpdateNonce(id, newNonce)
			w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)
			logger.Warn("Download auth failed", "file_id", id)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Rotate nonce after successful auth
		newNonce := auth.GenerateNonce()
		db.UpdateNonce(id, newNonce)
		w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)

		// Open file
		file, err := storage.OpenFile(id)
		if err != nil {
			logger.Error("Error opening file for download", "file_id", id, "error", err)
			http.NotFound(w, r)
			return
		}
		defer file.Close()

		// Get file size
		size, err := storage.GetFileSize(id)
		if err != nil {
			logger.Error("Error getting file size", "file_id", id, "error", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Stream file to client
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Length", strconv.FormatInt(size, 10))
		w.WriteHeader(http.StatusOK)

		if _, err := io.Copy(w, file); err != nil {
			logger.Error("Error streaming file", "file_id", id, "error", err)
			return
		}

		logger.Info("File downloaded", "file_id", id, "size_bytes", size)

		// Increment download count
		if err := db.IncrementDownload(id); err != nil {
			logger.Error("Error incrementing download count", "file_id", id, "error", err)
		}

		// Check if we've reached download limit
		meta, _ = db.GetFile(id)
		if meta != nil && meta.DlCount >= meta.DlLimit {
			// Cancel any scheduled cleanup goroutine
			cancelCleanup(id)

			// Delete file and metadata
			db.DeleteFile(id)
			storage.DeleteFile(id)
			logger.Info("File deleted after reaching download limit", "file_id", id, "downloads", meta.DlCount)
		}
	}
}
