package handlers

import (
	"encoding/base64"
	"encoding/json"
	"net/http"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

// RegisterAdminRequest represents the expected JSON payload for admin registration
type RegisterAdminRequest struct {
	Token               string                   `json:"token"`
	Name                string                   `json:"name"`
	Email               string                   `json:"email"`
	Salt                string                   `json:"salt"`
	PublicKey           string                   `json:"public_key"`
	EncryptionPublicKey string                   `json:"encryption_public_key"`
	KDF                 *storage.UserKDFSettings `json:"kdf,omitempty"`
}

// RegisterAdminResponse represents the response after successful registration
type RegisterAdminResponse struct {
	ID                  int64                    `json:"id"`
	Name                string                   `json:"name"`
	Email               string                   `json:"email"`
	PublicKey           string                   `json:"public_key"`
	EncryptionPublicKey string                   `json:"encryption_public_key"`
	KDF                 *storage.UserKDFSettings `json:"kdf,omitempty"`
	Role                string                   `json:"role"`
	Active              bool                     `json:"active"`
	Created             int64                    `json:"created"`
}

// NewRegisterAdminHandler creates a handler for admin registration
// POST /register/admin - creates a new admin user using a valid admin signup token
func NewRegisterAdminHandler(app *core.App) http.HandlerFunc {
	return registerHandler(app, storage.TokenTypeAdminSignup, storage.RoleAdmin)
}

// NewRegisterUserHandler creates a handler for regular user registration
// POST /register/user - creates a new regular user using a valid user signup token
func NewRegisterUserHandler(app *core.App) http.HandlerFunc {
	return registerHandler(app, storage.TokenTypeUserSignup, storage.RoleUser)
}

// registerHandler is the shared implementation for both admin and user registration
func registerHandler(app *core.App, expectedTokenType storage.AuthTokenType, userRole storage.UserRole) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			app.DBLogger.LogRequest(r, http.StatusMethodNotAllowed, nil, "method not allowed", "method", r.Method)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse request body
		var req RegisterAdminRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid JSON", "error", err.Error())
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate required fields
		if req.Token == "" || req.Name == "" || req.Email == "" || req.Salt == "" || req.PublicKey == "" || req.EncryptionPublicKey == "" {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing required fields")
			http.Error(w, "Missing registration token", http.StatusBadRequest)
			return
		}

		if req.KDF != nil && req.KDF.Algorithm == "" {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing kdf algorithm")
			http.Error(w, "Missing KDF algorithm", http.StatusBadRequest)
			return
		}

		if _, err := base64.RawURLEncoding.DecodeString(req.Salt); err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid salt encoding", "error", err.Error())
			http.Error(w, "Invalid salt", http.StatusBadRequest)
			return
		}

		pubBytes, err := base64.RawURLEncoding.DecodeString(req.PublicKey)
		if err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid public key encoding", "error", err.Error())
			http.Error(w, "Invalid public key", http.StatusBadRequest)
			return
		}
		if len(pubBytes) != 32 {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid public key length", "length", len(pubBytes))
			http.Error(w, "Invalid public key", http.StatusBadRequest)
			return
		}

		encPubBytes, err := base64.RawURLEncoding.DecodeString(req.EncryptionPublicKey)
		if err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid encryption public key encoding", "error", err.Error())
			http.Error(w, "Invalid encryption public key", http.StatusBadRequest)
			return
		}
		if len(encPubBytes) != 32 {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid encryption public key length", "length", len(encPubBytes))
			http.Error(w, "Invalid encryption public key", http.StatusBadRequest)
			return
		}

		// Hash and validate the token
		hashedToken := utils.HashToken(req.Token)
		valid, token, err := app.DB.IsTokenValid(hashedToken)
		if err != nil {
			app.Logger.Error("Error validating token", "error", err)
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "validate_token")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if !valid || token == nil {
			app.DBLogger.LogRequest(r, http.StatusUnauthorized, nil, "invalid or expired token")
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Verify token type matches expected type
		if token.Type != expectedTokenType {
			app.DBLogger.LogRequest(r, http.StatusUnauthorized, nil, "wrong token type", "expected", expectedTokenType.String(), "got", token.Type.String())
			http.Error(w, "Invalid token type", http.StatusUnauthorized)
			return
		}

		// Check if email already exists
		emailExists, err := app.DB.EmailExists(req.Email)
		if err != nil {
			app.Logger.Error("Error checking email existence", "error", err, "email", req.Email)
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "check_email")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if emailExists {
			app.DBLogger.LogRequest(r, http.StatusConflict, nil, "email already exists", "email", req.Email)
			http.Error(w, "Email already exists", http.StatusConflict)
			return
		}

		user := &storage.User{
			Name:                req.Name,
			Email:               req.Email,
			Salt:                req.Salt,
			PublicKey:           req.PublicKey,
			EncryptionPublicKey: req.EncryptionPublicKey,
			Role:                userRole,
			Active:              true,
		}

		if req.KDF != nil {
			if err := user.SetKDFSettings(req.KDF); err != nil {
				app.Logger.Error("Error persisting kdf settings", "error", err)
				app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid kdf settings", "error", err.Error())
				http.Error(w, "Invalid KDF settings", http.StatusBadRequest)
				return
			}
		}

		if err := app.DB.CreateUser(user); err != nil {
			app.Logger.Error("Error creating user", "error", err, "email", req.Email, "role", userRole.String())
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "create_user")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Consume the token
		hasRemaining, err := app.DB.DecrementTokenUsage(token.ID)
		if err != nil {
			app.Logger.Error("Error decrementing token usage", "error", err, "token_id", token.ID)
			// Don't fail the registration, but log it
		} else if !hasRemaining {
			app.Logger.Info("Token exhausted", "token_id", token.ID, "token_name", token.Name)
		}

		// Prepare response
		response := RegisterAdminResponse{
			ID:                  user.ID,
			Name:                user.Name,
			Email:               user.Email,
			PublicKey:           user.PublicKey,
			EncryptionPublicKey: user.EncryptionPublicKey,
			KDF:                 req.KDF,
			Role:                user.Role.String(),
			Active:              user.Active,
			Created:             user.Created,
		}

		app.DBLogger.LogRequest(r, http.StatusCreated, nil, "", "user_id", user.ID, "email", user.Email, "role", userRole.String())
		app.Logger.Info("User registered", "user_id", user.ID, "email", user.Email, "role", userRole.String())

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(response)
	}
}
