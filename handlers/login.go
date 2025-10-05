package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/i18n"
	"github.com/Simon-Martens/go-send/storage"
)

const (
	adminSessionLifetime = 24 * time.Hour * 365 * 10 // roughly ten years
)

func NewLoginHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if _, err := auth.GetSessionFromRequest(db, r); err == nil {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		} else if errors.Is(err, storage.ErrSessionExpired) {
			auth.ClearSessionCookie(w, r.TLS != nil)
		}

		switch r.Method {
		case http.MethodGet:
			renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, nil, "")
		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				logger.Warn("Failed to parse login form", "error", err)
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Invalid request", Kind: "error"}, "")
				return
			}

			username := r.FormValue("username")
			password := r.FormValue("password")
			if username == "" || password == "" {
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Username and password are required", Kind: "error"}, username)
				return
			}

			admin, err := db.GetAdminByUsername(username)
			if err != nil {
				if errors.Is(err, storage.ErrAdminNotFound) {
					renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Unknown administrator", Kind: "error"}, username)
					return
				}
				logger.Error("Failed to load admin user", "error", err)
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Internal server error", Kind: "error"}, username)
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)) != nil {
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Invalid password", Kind: "error"}, username)
				return
			}

			token, err := auth.GenerateToken(32)
			if err != nil {
				logger.Error("Failed to generate session token", "error", err)
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Internal server error", Kind: "error"}, username)
				return
			}

			hash := auth.HashToken(token)

			session := &storage.Session{
				TokenHash: hash,
				UserType:  "admin",
				AdminID: sql.NullInt64{
					Int64: admin.ID,
					Valid: true,
				},
				LinkID:    sql.NullInt64{},
				ExpiresAt: 0,
				CreatedAt: time.Now().Unix(),
			}

			if _, err = db.CreateSession(session); err != nil {
				logger.Error("Failed to create admin session", "error", err)
				renderLoginTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, &FlashMessage{Message: "Internal server error", Kind: "error"}, username)
				return
			}

			secure := r.TLS != nil
			auth.SetSessionCookie(w, token, secure, int(adminSessionLifetime.Seconds()))

			http.Redirect(w, r, "/", http.StatusSeeOther)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func renderLoginTemplate(w http.ResponseWriter, r *http.Request, tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger, flash *FlashMessage, username string) {
	nonce, err := generateNonce()
	if err != nil {
		logger.Error("Failed to generate nonce", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	detectedLocale := detectLocale(r, cfg)
	var translate func(string, map[string]interface{}) string
	if translator != nil {
		translate = translator.Func(detectedLocale)
	}
	data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce, translate)
	data.Auth = resolveAuthContext(db, r, logger)
	data.Flash = flash
	data.LoginForm.Username = username

	if admins, err := db.ListAdmins(); err != nil {
		logger.Error("Failed to list admins", "error", err)
	} else {
		loginAdmins := make([]LoginAdmin, 0, len(admins))
		for _, a := range admins {
			loginAdmins = append(loginAdmins, LoginAdmin{ID: a.ID, Username: a.Username})
		}
		data.Admins = loginAdmins
		if data.LoginForm.Username == "" && len(loginAdmins) > 0 {
			data.LoginForm.Username = loginAdmins[0].Username
		}
	}

	csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
	w.Header().Set("Content-Security-Policy", csp)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	if err := tmpl.ExecuteTemplate(w, "login.gohtml", data); err != nil {
		logger.Error("Failed to execute login template", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
