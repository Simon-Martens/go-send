package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/yourusername/send-go/config"
)

func NewConfigHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := map[string]interface{}{
			"DOWNLOAD_COUNTS":      cfg.DownloadCounts,
			"EXPIRE_TIMES_SECONDS": cfg.ExpireTimesSeconds,
			"MAX_FILE_SIZE":        cfg.MaxFileSize,
			"MAX_DOWNLOADS":        cfg.MaxDownloads,
			"MAX_EXPIRE_SECONDS":   cfg.MaxExpireSeconds,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
