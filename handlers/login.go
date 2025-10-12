package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

const (
	adminSessionLifetime = 24 * time.Hour * 365 * 10 // roughly ten years
)

func NewLoginHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if _, err := auth.GetSessionFromRequest(app.DB, r); err == nil {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		} else if errors.Is(err, storage.ErrSessionExpired) {
			auth.ClearSessionCookie(w, r.TLS != nil)
		}

		errorFunc := renderError(app, w, r)

		switch r.Method {
		case http.MethodGet:
			renderLoginTemplate(w, r, app, nil, "")
		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				app.Logger.Warn("Failed to parse login form", "error", err)
				renderLoginTemplate(w, r, app, &FlashMessage{Message: "Invalid request", Kind: "error"}, "")
				return
			}

			username := r.FormValue("username")
			password := r.FormValue("password")
			if username == "" || password == "" {
				errorFunc("Username and password are required")
				return
			}

			admin, err := app.DB.GetAdminByUsername(username)
			if err != nil {
				if errors.Is(err, storage.ErrAdminNotFound) {
					errorFunc("Unknown administrator")
					return
				}
				app.Logger.Error("Failed to load admin user", "error", err)
				errorFunc("Internal server error")
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)) != nil {
				errorFunc("Invalid password")
				return
			}

			token, err := auth.GenerateToken(32)
			if err != nil {
				app.Logger.Error("Failed to generate session token", "error", err)
				errorFunc("Internal server error")
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

			if _, err = app.DB.CreateSession(session); err != nil {
				app.Logger.Error("Failed to create admin session", "error", err)
				errorFunc("Internal server error")
				return
			}

			auth.SetSessionCookie(w, token, int(adminSessionLifetime.Seconds()))
			http.Redirect(w, r, "/", http.StatusSeeOther)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func renderError(app *core.App, w http.ResponseWriter, r *http.Request) func(msg string) {
	return func(msg string) {
		renderLoginTemplate(w, r, app, &FlashMessage{Message: msg, Kind: "error"}, "")
	}
}

func renderLoginTemplate(w http.ResponseWriter, r *http.Request, app *core.App, flash *FlashMessage, username string) {
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
	data := getTemplateData(app.Manifest, "{}", app.Config, detectedLocale, nonce, translate)
	data.Auth = resolveAuthContext(app.DB, r, app.Logger)
	data.Flash = flash
	data.LoginForm.Username = username

	if admins, err := app.DB.ListAdmins(); err != nil {
		app.Logger.Error("Failed to list admins", "error", err)
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

	if err := app.Template.ExecuteTemplate(w, "login.gohtml", data); err != nil {
		app.Logger.Error("Failed to execute login template", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
