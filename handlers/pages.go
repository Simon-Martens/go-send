package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/locale"
	"github.com/Simon-Martens/go-send/storage"
)

// generateNonce generates a random string for CSP nonces.
func generateNonce() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func IndexHandler(tmpl *template.Template, manifest map[string]string, cfg *config.Config, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nonce, err := generateNonce()
		if err != nil {
			logger.Error("Failed to generate nonce", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, cfg)
		data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce)

		csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		if err := tmpl.ExecuteTemplate(w, "index.gohtml", data); err != nil {
			logger.Error("Failed to execute index template", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}
}

func DownloadPageHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/download/"), "/")
		logger.Debug("Download page request", "path", r.URL.Path, "file_id", id)

		nonce, err := generateNonce()
		if err != nil {
			logger.Error("Failed to generate nonce", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, cfg)

		// Try to get file metadata
		meta, err := db.GetFile(id)
		var downloadMetadata string

		if err != nil {
			// File not found - render 404 state
			logger.Debug("File not found for download page", "file_id", id, "error", err)
			downloadMetadata = `{"status": 404}`
		} else {
			logger.Debug("File found for download page", "file_id", id, "nonce", meta.Nonce)
			// File found - provide nonce and password flag
			metaJSON, _ := json.Marshal(map[string]interface{}{
				"nonce": meta.Nonce,
				"pwd":   meta.Password,
			})
			downloadMetadata = string(metaJSON)
			// Set WWW-Authenticate header with nonce
			w.Header().Set("WWW-Authenticate", "send-v1 "+meta.Nonce)
		}

		data := getTemplateData(manifest, downloadMetadata, cfg, detectedLocale, nonce)

		csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		if err := tmpl.ExecuteTemplate(w, "index.gohtml", data); err != nil {
			logger.Error("Failed to execute download page template", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}
}

func detectLocale(r *http.Request, cfg *config.Config) string {
	// If custom locale is set, use it
	if cfg.CustomLocale != "" {
		return cfg.CustomLocale
	}

	// Otherwise negotiate from Accept-Language header
	acceptLanguage := r.Header.Get("Accept-Language")
	return locale.NegotiateLocale(acceptLanguage)
}
