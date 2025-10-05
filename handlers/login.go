package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/storage"
)

const (
	adminSessionDuration = 24 * time.Hour
)

func NewLoginHandler(db *storage.DB, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if session, err := auth.GetSessionFromRequest(db, r); err == nil {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		} else if errors.Is(err, storage.ErrSessionExpired) {
			auth.ClearSessionCookie(w, r.TLS != nil)
		}

		switch r.Method {
		case http.MethodGet:
			renderLoginPage(w, "")
		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				logger.Warn("Failed to parse login form", "error", err)
				http.Error(w, "Invalid request", http.StatusBadRequest)
				return
			}

			password := r.FormValue("password")
			if password == "" {
				renderLoginPageWithError(w, "Password is required")
				return
			}

			admin, err := db.GetPrimaryAdmin()
			if err != nil {
				if err == storage.ErrAdminNotFound {
					logger.Error("No admin user configured")
					http.Error(w, "No admin user configured", http.StatusInternalServerError)
					return
				}
				logger.Error("Failed to load admin user", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)) != nil {
				renderLoginPageWithError(w, "Invalid password")
				return
			}

			token, err := auth.GenerateToken(32)
			if err != nil {
				logger.Error("Failed to generate session token", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
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
				ExpiresAt: time.Now().Add(adminSessionDuration).Unix(),
				CreatedAt: time.Now().Unix(),
			}

			if _, err = db.CreateSession(session); err != nil {
				logger.Error("Failed to create admin session", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			secure := r.TLS != nil
			auth.SetSessionCookie(w, token, secure, int(adminSessionDuration.Seconds()))

			http.Redirect(w, r, "/", http.StatusSeeOther)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func renderLoginPage(w http.ResponseWriter, message string) {
	renderLoginPageInternal(w, message, false)
}

func renderLoginPageWithError(w http.ResponseWriter, message string) {
	renderLoginPageInternal(w, message, true)
}

func renderLoginPageInternal(w http.ResponseWriter, message string, isError bool) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	statusClass := "info"
	if isError {
		statusClass = "error"
	}

	fmt.Fprintf(w, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Send – Login</title>
<style>
body { font-family: system-ui, sans-serif; background: #0b0b0f; color: #f8f8f8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
main { background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: 12px; width: 100%%; max-width: 320px; box-shadow: 0 20px 45px rgba(0,0,0,0.4); }
h1 { margin-top: 0; font-size: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
input[type="password"] { width: 100%%; padding: 0.75rem; border-radius: 8px; border: none; margin-bottom: 1rem; background: rgba(255,255,255,0.12); color: #fff; }
button { width: 100%%; padding: 0.75rem; border: none; border-radius: 8px; background: #0A84FF; color: #fff; font-weight: 600; cursor: pointer; }
button:hover { background: #006fd6; }
.snackbar { margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px; background: rgba(10,132,255,0.12); color: #cde4ff; }
.snackbar.error { background: rgba(255,69,58,0.15); color: #ffd6d2; }
</style>
</head>
<body>
<main>
<h1>Upload Access</h1>
<p>Enter the administrator password to continue.</p>
%s
<form method="POST">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" autofocus required>
<button type="submit">Sign in</button>
</form>
</main>
</body>
</html>`, snackbar(message, statusClass))
}

func snackbar(message, statusClass string) string {
	if message == "" {
		return ""
	}
	return fmt.Sprintf(`<div class="snackbar %s">%s</div>`, statusClass, message)
}
