package handlers

import (
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

func NewDownloadHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Extract ID from path
		id := strings.TrimPrefix(r.URL.Path, "/api/download/")
		id = strings.TrimPrefix(id, "blob/")
		id = strings.TrimSuffix(id, "/")

		if id == "" {
			app.DBLogger.LogFileOp(r, "download", "", http.StatusBadRequest,
				time.Since(startTime).Milliseconds(), "Missing file ID")
			http.Error(w, "Missing file ID", http.StatusBadRequest)
			return
		}

		// Get file metadata
		meta, err := app.DB.GetFile(id)
		if err != nil {
			app.Logger.Debug("File not found for download", "file_id", id)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusNotFound,
				time.Since(startTime).Milliseconds(), err.Error())
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
			app.DBLogger.LogFileOp(r, "download", id, http.StatusUnauthorized,
				time.Since(startTime).Milliseconds(), "HMAC auth failed")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Rotate nonce after successful auth
		newNonce := auth.GenerateNonce()
		app.DB.UpdateNonce(id, newNonce)
		w.Header().Set("WWW-Authenticate", "send-v1 "+newNonce)

		// Recipient-based authorization (only when UploadGuard is enabled)
		authorized, userID, err := CheckRecipientAuthorization(app, r, id, meta)
		if err != nil {
			app.Logger.Error("Error checking authorization", "file_id", id, "error", err)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "check_authorization")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if !authorized {
			app.Logger.Warn("Unauthorized download attempt", "file_id", id, "user_id", userID)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusForbidden,
				time.Since(startTime).Milliseconds(), "not authorized - file has specific recipients",
				"user_id", userID)
			Render403Page(app, w, r, "/download/"+id)
			return
		}

		// Open file
		file, err := storage.OpenFile(app.DB.FileDir(), id)
		if err != nil {
			app.Logger.Error("Error opening file for download", "file_id", id, "error", err)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusNotFound,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "open_file")
			http.NotFound(w, r)
			return
		}
		defer file.Close()

		// Get file size
		size, err := storage.GetFileSize(app.DB.FileDir(), id)
		if err != nil {
			app.Logger.Error("Error getting file size", "file_id", id, "error", err)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "get_file_size")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Stream file to client
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Length", strconv.FormatInt(size, 10))
		w.WriteHeader(http.StatusOK)

		if _, err := io.Copy(w, file); err != nil {
			app.Logger.Error("Error streaming file", "file_id", id, "error", err)
			app.DBLogger.LogFileOp(r, "download", id, http.StatusInternalServerError,
				time.Since(startTime).Milliseconds(), err.Error(), "operation", "stream_file", "size_bytes", size)
			return
		}

		app.Logger.Info("File downloaded", "file_id", id, "size_bytes", size)

		// Log successful download
		app.DBLogger.LogFileOp(r, "download", id, http.StatusOK,
			time.Since(startTime).Milliseconds(), "", "size_bytes", size)

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
			app.DB.DeleteFileRecord(id)
			storage.DeleteFile(app.DB.FileDir(), id)
			app.Logger.Info("File deleted after reaching download limit", "file_id", id, "downloads", meta.DlCount)
		}
	}
}
