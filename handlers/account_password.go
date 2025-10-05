package handlers

import (
	"errors"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/i18n"
	"github.com/Simon-Martens/go-send/storage"
)

func NewAccountPasswordHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := auth.GetSessionFromRequest(db, r)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		if session.UserType != "admin" || !session.AdminID.Valid {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		detectedLocale := detectLocale(r, cfg)
		var translate func(string, map[string]interface{}) string
		if translator != nil {
			translate = translator.Func(detectedLocale)
		}

		render := func(flash *FlashMessage) {
			renderAccountPasswordTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, session, translate, flash)
		}

		switch r.Method {
		case http.MethodGet:
			render(nil)
			return

		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				logger.Warn("Failed to parse password change form", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_generic"), Kind: "error"})
				return
			}

			current := r.FormValue("currentPassword")
			next := r.FormValue("newPassword")
			confirm := r.FormValue("confirmPassword")

			if next == "" || confirm == "" {
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_mismatch"), Kind: "error"})
				return
			}

			if next != confirm {
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_mismatch"), Kind: "error"})
				return
			}

			admin, err := db.GetAdminByID(session.AdminID.Int64)
			if err != nil {
				if errors.Is(err, storage.ErrAdminNotFound) {
					http.Error(w, "Forbidden", http.StatusForbidden)
					return
				}
				logger.Error("Failed to look up admin for password change", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_generic"), Kind: "error"})
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(current)) != nil {
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_current"), Kind: "error"})
				return
			}

			newHash, err := bcrypt.GenerateFromPassword([]byte(next), bcrypt.DefaultCost)
			if err != nil {
				logger.Error("Failed to hash new password", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_generic"), Kind: "error"})
				return
			}

			if err := db.UpdateAdminPassword(admin.ID, string(newHash)); err != nil {
				logger.Error("Failed to update admin password", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.password.error_generic"), Kind: "error"})
				return
			}

			render(&FlashMessage{Message: translateMessage(translate, "account.password.success"), Kind: "success"})
			return

		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func renderAccountPasswordTemplate(w http.ResponseWriter, r *http.Request, tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger, session *storage.Session, translate func(string, map[string]interface{}) string, flash *FlashMessage) {
	nonce, err := generateNonce()
	if err != nil {
		logger.Error("Failed to generate nonce", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	detectedLocale := detectLocale(r, cfg)
	if translate == nil && translator != nil {
		translate = translator.Func(detectedLocale)
	}

	data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce, translate)
	data.Auth = authInfoFromSession(db, session, logger)
	data.Flash = flash

	// keep username in form
	if session != nil && session.UserType == "admin" && session.AdminID.Valid {
		if admin, err := db.GetAdminByID(session.AdminID.Int64); err == nil {
			data.ChangePasswordForm.Username = admin.Username
		}
	}

	csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
	w.Header().Set("Content-Security-Policy", csp)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	if err := tmpl.ExecuteTemplate(w, "account_password.gohtml", data); err != nil {
		logger.Error("Failed to execute change password template", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func translateMessage(translate func(string, map[string]interface{}) string, key string) string {
	if translate == nil {
		return key
	}
	return translate(key, nil)
}
