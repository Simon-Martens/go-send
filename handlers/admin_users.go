package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

type adminUserItem struct {
	ID                  int64  `json:"id"`
	Name                string `json:"name"`
	Email               string `json:"email"`
	Role                string `json:"role"`
	Active              bool   `json:"active"`
	PublicKey           string `json:"public_key"`
	EncryptionPublicKey string `json:"encryption_public_key"`
	ActiveSessions      int    `json:"active_sessions"`
	IsCurrentUser       bool   `json:"is_current_user"`
	Created             int64  `json:"created"`
	Updated             int64  `json:"updated"`
}

type adminUsersListResponse struct {
	Users []adminUserItem `json:"users"`
}

func NewAdminUsersHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures admin authentication
		session, _ := app.GetAuthenticatedSession(r)

		users, err := app.DB.ListUsers(nil)
		if err != nil {
			app.Logger.Error("Admin users: failed to list users", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		response := adminUsersListResponse{
			Users: make([]adminUserItem, 0, len(users)),
		}

		for _, user := range users {
			count, err := app.DB.CountActiveSessionsByUser(user.ID)
			if err != nil {
				app.Logger.Warn("Admin users: failed to count sessions", "error", err, "user_id", user.ID)
				count = 0
			}

			item := adminUserItem{
				ID:                  user.ID,
				Name:                user.Name,
				Email:               user.Email,
				Role:                user.Role.String(),
				Active:              user.Active,
				PublicKey:           user.PublicKey,
				EncryptionPublicKey: user.EncryptionPublicKey,
				ActiveSessions:      count,
				IsCurrentUser:       session.UserID != nil && *session.UserID == user.ID,
				Created:             user.Created,
				Updated:             user.Updated,
			}

			response.Users = append(response.Users, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Admin users: failed to encode response", "error", err)
		}
	}
}

func NewAdminUserHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Middleware ensures admin authentication
		session, _ := app.GetAuthenticatedSession(r)

		path := strings.TrimPrefix(r.URL.Path, "/api/admin/users/")
		if path == "" {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		parts := strings.Split(path, "/")
		idStr := parts[0]

		userID, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil || userID <= 0 {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		if len(parts) == 1 {
			if r.Method != http.MethodDelete {
				http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
				return
			}
			handleAdminDeleteUser(app, w, r, userID, session)
			return
		}

		if len(parts) == 2 {
			switch parts[1] {
			case "clear-sessions":
				if r.Method != http.MethodPost {
					http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
					return
				}
				handleAdminClearSessions(app, w, r, userID)
				return
			case "deactivate":
				if r.Method != http.MethodPost {
					http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
					return
				}
				handleAdminDeactivateUser(app, w, r, userID, session)
				return
			case "activate":
				if r.Method != http.MethodPost {
					http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
					return
				}
				handleAdminActivateUser(app, w, r, userID)
				return
			}
		}

		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

func handleAdminDeleteUser(app *core.App, w http.ResponseWriter, r *http.Request, targetUserID int64, session *storage.Session) {
	if session.UserID != nil && *session.UserID == targetUserID {
		http.Error(w, "Cannot delete your own account", http.StatusBadRequest)
		return
	}

	exists, err := app.DB.UserExists(targetUserID)
	if err != nil {
		app.Logger.Error("Admin users: failed to verify user", "error", err, "user_id", targetUserID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := app.DB.DeleteSessionsByUser(targetUserID); err != nil {
		app.Logger.Error("Admin users: failed to delete sessions", "error", err, "user_id", targetUserID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := app.DB.DeleteFilesByUser(targetUserID); err != nil {
		app.Logger.Error("Admin users: failed to delete user files", "error", err, "user_id", targetUserID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := app.DB.DeleteUser(targetUserID); err != nil {
		app.Logger.Error("Admin users: failed to delete user", "error", err, "user_id", targetUserID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	app.DBLogger.LogRequest(r, http.StatusNoContent, nil, "", "action", "delete_user", "target_user_id", targetUserID)
	w.WriteHeader(http.StatusNoContent)
}

func handleAdminClearSessions(app *core.App, w http.ResponseWriter, r *http.Request, userID int64) {
	exists, err := app.DB.UserExists(userID)
	if err != nil {
		app.Logger.Error("Admin users: failed to verify user for session clear", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := app.DB.DeleteSessionsByUser(userID); err != nil {
		app.Logger.Error("Admin users: failed to clear sessions", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	app.DBLogger.LogRequest(r, http.StatusNoContent, nil, "",
		"action", "admin_clear_user_sessions",
		"target_user_id", userID)

	w.WriteHeader(http.StatusNoContent)
}

func handleAdminDeactivateUser(app *core.App, w http.ResponseWriter, r *http.Request, userID int64, session *storage.Session) {
	if session.UserID != nil && *session.UserID == userID {
		http.Error(w, "Cannot deactivate your own account", http.StatusBadRequest)
		return
	}

	exists, err := app.DB.UserExists(userID)
	if err != nil {
		app.Logger.Error("Admin users: failed to verify user for deactivate", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := app.DB.DeactivateUser(userID); err != nil {
		app.Logger.Error("Admin users: failed to deactivate user", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := app.DB.DeleteSessionsByUser(userID); err != nil {
		app.Logger.Error("Admin users: failed to clear sessions after deactivate", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	app.DBLogger.LogRequest(r, http.StatusNoContent, session.UserID, "",
		"action", "admin_deactivate_user",
		"target_user_id", userID)

	w.WriteHeader(http.StatusNoContent)
}

func handleAdminActivateUser(app *core.App, w http.ResponseWriter, r *http.Request, userID int64) {
	exists, err := app.DB.UserExists(userID)
	if err != nil {
		app.Logger.Error("Admin users: failed to verify user for activate", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := app.DB.ActivateUser(userID); err != nil {
		app.Logger.Error("Admin users: failed to activate user", "error", err, "user_id", userID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	app.DBLogger.LogRequest(r, http.StatusNoContent, nil, "",
		"action", "admin_activate_user",
		"target_user_id", userID)

	w.WriteHeader(http.StatusNoContent)
}
