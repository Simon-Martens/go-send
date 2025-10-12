package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

func NewAccountPasswordHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := auth.GetSessionFromRequest(app.DB, r)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		if session.UserType != "admin" || !session.AdminID.Valid {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		detectedLocale := detectLocale(r, app.Config)
		var translate func(string, map[string]interface{}) string
		if app.Translator != nil {
			// WARNING: is this safe? We need to get a default locale and fallback
			// Translator...
			translate = app.Translator.Func(detectedLocale)
		}

		renderError := func(flash string) {
			message := translateMessage(translate, flash)
			renderAccountPasswordTemplate(w, r, session, translate, &FlashMessage{Message: message, Kind: "error"}, app)
		}

		switch r.Method {
		case http.MethodGet:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return

		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				app.Logger.Warn("Failed to parse password change form", "error", err)
				renderError("account.password.error_generic")
				return
			}

			current := r.FormValue("currentPassword")
			next := r.FormValue("newPassword")
			confirm := r.FormValue("confirmPassword")

			if next == "" || confirm == "" || (next != confirm) {
				renderError("account.password.error_mismatch")
				return
			}

			admin, err := app.DB.GetAdminByID(session.AdminID.Int64)
			if err != nil {
				if errors.Is(err, storage.ErrAdminNotFound) {
					http.Error(w, "Forbidden", http.StatusForbidden)
					return
				}
				app.Logger.Error("Failed to look up admin for password change", "error", err)
				renderError("account.password.error_generic")
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(current)) != nil {
				renderError("account.password.error_current")
				return
			}

			newHash, err := bcrypt.GenerateFromPassword([]byte(next), bcrypt.DefaultCost)
			if err != nil {
				app.Logger.Error("Failed to hash new password", "error", err)
				renderError("account.password.error_generic")
				return
			}

			if err := app.DB.UpdateAdminPassword(admin.ID, string(newHash)); err != nil {
				app.Logger.Error("Failed to update admin password", "error", err)
				renderError("account.password.error_generic")
				return
			}

			message := translateMessage(translate, "account.password.success")
			renderAccountPasswordTemplate(w, r, session, translate, &FlashMessage{Message: message, Kind: "success"}, app)
			return

		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func renderAccountPasswordTemplate(w http.ResponseWriter, r *http.Request, session *storage.Session, translate func(string, map[string]interface{}) string, flash *FlashMessage, app *core.App) {
	nonce, err := generateNonce()
	if err != nil {
		app.Logger.Error("Failed to generate nonce", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	detectedLocale := detectLocale(r, app.Config)
	if translate == nil && app.Translator != nil {
		translate = app.Translator.Func(detectedLocale)
	}

	data := getTemplateData(app.Manifest, "{}", app.Config, detectedLocale, nonce, translate)
	data.Auth = authInfoFromSession(app.DB, session, app.Logger)
	data.Flash = flash

	// keep username in form
	if session != nil && session.UserType == "admin" && session.AdminID.Valid {
		if admin, err := app.DB.GetAdminByID(session.AdminID.Int64); err == nil {
			data.ChangePasswordForm.Username = admin.Username
		}
	}

	csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
	w.Header().Set("Content-Security-Policy", csp)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	if err := app.Template.ExecuteTemplate(w, "account_password.gohtml", data); err != nil {
		app.Logger.Error("Failed to execute change password template", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func translateMessage(translate func(string, map[string]interface{}) string, key string) string {
	if translate == nil {
		return key
	}
	return translate(key, nil)
}
