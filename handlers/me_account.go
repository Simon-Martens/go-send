package handlers

import (
	"encoding/json"
	"net/http"
	"net/mail"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	sqlite3 "github.com/mattn/go-sqlite3"
)

type accountProfileRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type accountProfileResponse struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func NewAccountProfileHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		user, session, ok := resolveAuthenticatedUser(app, w, r)
		if !ok {
			return
		}

		if !user.Active {
			writeAccountError(w, http.StatusBadRequest, "not_active")
			return
		}

		var req accountProfileRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeAccountError(w, http.StatusBadRequest, "invalid_json")
			return
		}

		name := strings.TrimSpace(req.Name)
		email := strings.TrimSpace(req.Email)

		if name == "" {
			writeAccountError(w, http.StatusBadRequest, "name_required")
			return
		}
		if email == "" {
			writeAccountError(w, http.StatusBadRequest, "email_required")
			return
		}
		if _, err := mail.ParseAddress(email); err != nil {
			writeAccountError(w, http.StatusBadRequest, "invalid_email")
			return
		}

		if err := app.DB.UpdateUserProfile(user.ID, name, email); err != nil {
			if sqliteErr, ok := err.(sqlite3.Error); ok && sqliteErr.Code == sqlite3.ErrConstraint {
				writeAccountError(w, http.StatusConflict, "email_in_use")
				return
			}
			app.Logger.Error("Account: failed to update profile", "error", err, "user_id", user.ID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		app.DBLogger.LogRequest(r, http.StatusOK, nil, "account profile updated", "user_id", user.ID)

		response := accountProfileResponse{
			Name:  name,
			Email: email,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Account: failed to encode profile response", "error", err)
		}

		// Touch the session as part of the successful update
		app.TouchSession(session, r)
	}
}

func NewAccountClearSessionsHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		user, _, ok := resolveAuthenticatedUser(app, w, r)
		if !ok {
			return
		}

		if !user.Active {
			writeAccountError(w, http.StatusBadRequest, "not_active")
			return
		}

		if err := app.DB.DeleteSessionsByUser(user.ID); err != nil {
			app.Logger.Error("Account: failed to clear user sessions", "error", err, "user_id", user.ID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		app.DBLogger.LogRequest(r, http.StatusNoContent, nil, "account sessions cleared", "user_id", user.ID)
		w.WriteHeader(http.StatusNoContent)
	}
}

func NewAccountDeactivateHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		user, _, ok := resolveAuthenticatedUser(app, w, r)
		if !ok {
			return
		}

		if !user.Active {
			writeAccountError(w, http.StatusBadRequest, "not_active")
			return
		}

		if err := app.DB.DeactivateUser(user.ID); err != nil {
			app.Logger.Error("Account: failed to deactivate user", "error", err, "user_id", user.ID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if err := app.DB.DeleteSessionsByUser(user.ID); err != nil {
			app.Logger.Warn("Account: failed to delete sessions after deactivation", "error", err, "user_id", user.ID)
		}

		app.DBLogger.LogRequest(r, http.StatusNoContent, nil, "account deactivated", "user_id", user.ID)
		w.WriteHeader(http.StatusNoContent)
	}
}

func resolveAuthenticatedUser(app *core.App, w http.ResponseWriter, r *http.Request) (*storage.User, *storage.Session, bool) {
	session, err := app.GetAuthenticatedSession(r)
	if err != nil {
		app.Logger.Warn("Account: failed to resolve session", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return nil, nil, false
	}

	if session == nil || session.UserID == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return nil, nil, false
	}

	user, err := app.DB.GetUser(*session.UserID)
	if err != nil {
		app.Logger.Error("Account: failed to fetch user", "error", err, "user_id", *session.UserID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return nil, nil, false
	}

	return user, session, true
}

func writeAccountError(w http.ResponseWriter, status int, code string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"error": code,
	})
}
