package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/locale"
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

func IndexHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nonce, err := generateNonce()
		if err != nil {
			app.Logger.Error("Failed to generate nonce", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, app.Config)

		var translate func(string, map[string]interface{}) string
		if app.Translator != nil {
			translate = app.Translator.Func(detectedLocale)
		}

		// Check if this is a download page request
		isDownloadPage := strings.HasPrefix(r.URL.Path, "/download/")
		var downloadMetadata string = "{}"

		if isDownloadPage {
			id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/download/"), "/")
			app.Logger.Debug("Download page request", "path", r.URL.Path, "file_id", id)

			// Try to get file metadata
			meta, err := app.DB.GetFile(id)

			if err != nil {
				// File not found - render 404 state
				app.Logger.Debug("File not found for download page", "file_id", id, "error", err)
				downloadMetadata = `{"status": 404}`
			} else {
				app.Logger.Debug("File found for download page", "file_id", id, "nonce", meta.Nonce)
				// File found - provide nonce and password flag
				metaJSON, _ := json.Marshal(map[string]interface{}{
					"nonce": meta.Nonce,
					"pwd":   meta.Password,
				})
				downloadMetadata = string(metaJSON)
				// Set WWW-Authenticate header with nonce
				w.Header().Set("WWW-Authenticate", "send-v1 "+meta.Nonce)
			}
		}

		data := getTemplateData(app.Manifest, downloadMetadata, app.Config, detectedLocale, nonce, translate)
		data.IsDownloadPage = isDownloadPage

		csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		if err := app.Template.ExecuteTemplate(w, "index.gohtml", data); err != nil {
			app.Logger.Error("Failed to execute template", "error", err)
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
