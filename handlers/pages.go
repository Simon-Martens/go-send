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
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "generate_nonce")
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
				app.DBLogger.LogRequest(r, http.StatusNotFound, nil, err.Error(), "file_id", id, "page", "download")
				downloadMetadata = `{"status": 404}`
			} else {
				// Recipient-based authorization for download page
				authorized, userID, err := CheckRecipientAuthorization(app, r, id, meta)
				if err != nil {
					app.Logger.Error("Error checking authorization for page", "file_id", id, "error", err)
					app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "file_id", id, "operation", "check_authorization")
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				if !authorized {
					app.Logger.Warn("Unauthorized download page access", "file_id", id, "user_id", userID)
					app.DBLogger.LogRequest(r, http.StatusForbidden, nil, "not authorized - file has specific recipients",
						"file_id", id, "user_id", userID)
					Render403Page(app, w, r, "/download/"+id)
					return
				}

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
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "template", "index.gohtml")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Log successful request
		app.DBLogger.LogRequest(r, http.StatusOK, nil, "")
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
