package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

// PublicUserInfo represents the public information about a user (for recipient selection)
type PublicUserInfo struct {
	ID                  int64  `json:"id"`
	Name                string `json:"name"`
	Email               string `json:"email"`
	EncryptionPublicKey string `json:"encryption_public_key"`
}

// UsersListResponse represents the response for the users list endpoint
type UsersListResponse struct {
	Users []PublicUserInfo `json:"users"`
}

// NewUsersListHandler creates a handler for listing all active users
// GET /api/users - returns list of users with public info only
// Accessible to: logged-in users OR guests with valid tokens
func NewUsersListHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures authentication, retrieve guest token if present
		guestToken := core.GuestTokenFromContext(r)

		// Also check session for guest token
		if guestToken == nil {
			session, err := app.GetAuthenticatedSession(r)
			if err != nil {
				app.Logger.Error("Users list: failed to check session", "error", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			if session != nil && session.AuthTokenID != nil {
				guestToken, err = app.GetSessionAuthToken(session)
				if err != nil {
					app.Logger.Error("Users list: failed to get session auth token", "error", err)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}
			}
		}

		// Get all active users
		users, err := app.DB.ListUsers(nil)
		if err != nil {
			app.Logger.Error("Users list: failed to list users", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Filter to active users only and map to public info
		response := UsersListResponse{
			Users: make([]PublicUserInfo, 0),
		}

		// For user-specific guest upload links (type 3), only return the creator user
		if guestToken != nil && guestToken.Type == storage.TokenTypeSpecificGuestUpload {
			for _, user := range users {
				if user.Active && user.ID == guestToken.CreatedBy {
					response.Users = append(response.Users, PublicUserInfo{
						ID:                  user.ID,
						Name:                user.Name,
						Email:               user.Email,
						EncryptionPublicKey: user.EncryptionPublicKey,
					})
					break
				}
			}
		} else {
			// For logged-in users or general guest tokens (type 2), return all users
			for _, user := range users {
				if user.Active {
					response.Users = append(response.Users, PublicUserInfo{
						ID:                  user.ID,
						Name:                user.Name,
						Email:               user.Email,
						EncryptionPublicKey: user.EncryptionPublicKey,
					})
				}
			}
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Users list: failed to encode response", "error", err)
		}
	}
}

// NewUserDetailsHandler creates a handler for getting specific user details
// GET /api/users/:id - returns public info for a specific user
// Accessible to: logged-in users OR guests with valid tokens
func NewUserDetailsHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures authentication (user or guest)

		// Extract user ID from URL
		path := strings.TrimPrefix(r.URL.Path, "/api/users/")
		path = strings.TrimSuffix(path, "/")

		if path == "" {
			http.Error(w, "Missing user ID", http.StatusBadRequest)
			return
		}

		userID, err := strconv.ParseInt(path, 10, 64)
		if err != nil || userID <= 0 {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		// Get user from database
		user, err := app.DB.GetUser(userID)
		if err != nil {
			app.Logger.Error("User details: failed to get user", "error", err, "user_id", userID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if user == nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		// Only return info for active users
		if !user.Active {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		// Return public info only
		response := PublicUserInfo{
			ID:                  user.ID,
			Name:                user.Name,
			Email:               user.Email,
			EncryptionPublicKey: user.EncryptionPublicKey,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("User details: failed to encode response", "error", err)
		}
	}
}
