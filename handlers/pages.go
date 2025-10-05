package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/i18n"
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

func IndexHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nonce, err := generateNonce()
		if err != nil {
			logger.Error("Failed to generate nonce", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, cfg)

		authInfo := resolveAuthContext(db, r, logger)
		var translate func(string, map[string]interface{}) string
		if translator != nil {
			translate = translator.Func(detectedLocale)
		}
		data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce, translate)
		data.Auth = authInfo

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

func DownloadPageHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger) http.HandlerFunc {
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

		authInfo := resolveAuthContext(db, r, logger)
		var translate func(string, map[string]interface{}) string
		if translator != nil {
			translate = translator.Func(detectedLocale)
		}
		data := getTemplateData(manifest, downloadMetadata, cfg, detectedLocale, nonce, translate)
		data.Auth = authInfo

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

func resolveAuthContext(db *storage.DB, r *http.Request, logger *slog.Logger) AuthInfo {
	session, err := auth.GetSessionFromRequest(db, r)
	if err != nil {
		switch {
		case errors.Is(err, auth.ErrNoSessionCookie), errors.Is(err, storage.ErrSessionNotFound), errors.Is(err, storage.ErrSessionExpired):
			return AuthInfo{}
		default:
			logger.Warn("Failed to resolve session", "error", err)
			return AuthInfo{}
		}
	}

	return authInfoFromSession(db, session, logger)
}

func authInfoFromSession(db *storage.DB, session *storage.Session, logger *slog.Logger) AuthInfo {
	if session == nil {
		return AuthInfo{}
	}

	info := AuthInfo{
		Authenticated: true,
		UserType:      session.UserType,
		ExpiresAt:     session.ExpiresAt,
	}

	if session.ExpiresAt > 0 {
		info.ExpiresAtISO = time.Unix(session.ExpiresAt, 0).UTC().Format(time.RFC3339)
	}

	switch session.UserType {
	case "admin":
		if session.AdminID.Valid {
			admin, err := db.GetAdminByID(session.AdminID.Int64)
			if err != nil {
				if !errors.Is(err, storage.ErrAdminNotFound) {
					logger.Warn("Failed to load admin for session", "error", err, "admin_id", session.AdminID.Int64)
				}
			} else {
				info.DisplayName = admin.Username
			}
		}
	case "user":
		if session.LinkID.Valid {
			link, err := db.GetAuthLinkByID(session.LinkID.Int64)
			if err != nil {
				if !errors.Is(err, storage.ErrLinkNotFound) {
					logger.Warn("Failed to load auth link for session", "error", err, "link_id", session.LinkID.Int64)
				}
			} else if link.Username.Valid {
				info.DisplayName = link.Username.String
			}
		}
	}

	return info
}
