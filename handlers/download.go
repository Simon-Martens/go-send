package handlers

import (
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

func NewDownloadHandler(app *core.App) http.HandlerFunc {
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
		meta, err := app.DB.GetFile(id)
		if err != nil {
			app.Logger.Debug("File not found for download", "file_id", id)
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
			app.Logger.Warn("Download auth failed", "file_id", id)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Rotate nonce after successful auth
		newNonce := auth.GenerateNonce()
		app.DB.UpdateNonce(id, newNonce)
		w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)

		// Open file
		file, err := storage.OpenFile(app.DB.FileDir(), id)
		if err != nil {
			app.Logger.Error("Error opening file for download", "file_id", id, "error", err)
			http.NotFound(w, r)
			return
		}
		defer file.Close()

		// Get file size
		size, err := storage.GetFileSize(app.DB.FileDir(), id)
		if err != nil {
			app.Logger.Error("Error getting file size", "file_id", id, "error", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Stream file to client
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Length", strconv.FormatInt(size, 10))
		w.WriteHeader(http.StatusOK)

		if _, err := io.Copy(w, file); err != nil {
			app.Logger.Error("Error streaming file", "file_id", id, "error", err)
			return
		}

		app.Logger.Info("File downloaded", "file_id", id, "size_bytes", size)

		// Increment download count
		if err := app.DB.IncrementDownload(id); err != nil {
			app.Logger.Error("Error incrementing download count", "file_id", id, "error", err)
		}

		// Check if we've reached download limit
		meta, _ = app.DB.GetFile(id)
		if meta != nil && meta.DlCount >= meta.DlLimit {
			// Cancel any scheduled cleanup goroutine
			app.CancelCleanup(id)

			// Delete file and metadata
			app.DB.DeleteFile(id)
			storage.DeleteFile(app.DB.FileDir(), id)
			app.Logger.Info("File deleted after reaching download limit", "file_id", id, "downloads", meta.DlCount)
		}
	}
}
