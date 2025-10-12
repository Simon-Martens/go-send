package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Simon-Martens/go-send/core"
)

func NewConfigHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := map[string]interface{}{
			"DOWNLOAD_COUNTS":      app.Config.DownloadCounts,
			"EXPIRE_TIMES_SECONDS": app.Config.ExpireTimesSeconds,
			"MAX_FILE_SIZE":        app.Config.MaxFileSize,
			"MAX_DOWNLOADS":        app.Config.MaxDownloads,
			"MAX_EXPIRE_SECONDS":   app.Config.MaxExpireSeconds,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
