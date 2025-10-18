package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

// NewClaimHandler creates a handler for claiming auth tokens
// GET /auth/claim/[token] - validates token and redirects to appropriate registration page
func NewClaimHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			app.DBLogger.LogRequest(r, http.StatusMethodNotAllowed, nil, "method not allowed", "method", r.Method)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extract token from URL path
		rawToken := strings.TrimPrefix(r.URL.Path, "/auth/claim/")
		rawToken = strings.TrimSuffix(rawToken, "/")

		if rawToken == "" {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing token")
			http.Error(w, "Missing token", http.StatusBadRequest)
			return
		}

		// Hash the token to look it up in the database
		hashedToken := utils.HashToken(rawToken)

		// Validate the token
		valid, token, err := app.DB.IsTokenValid(hashedToken)
		if err != nil {
			app.Logger.Error("Error validating token", "error", err)
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "validate_token")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if !valid || token == nil {
			app.DBLogger.LogRequest(r, http.StatusForbidden, nil, "invalid or expired token", "token_preview", rawToken[:min(8, len(rawToken))])
			http.Error(w, "Invalid or expired registration token", http.StatusForbidden)
			return
		}

		// Route based on token type
		var redirectURL string
		switch token.Type {
		case storage.TokenTypeAdminSignup:
			redirectURL = fmt.Sprintf("/register/admin/%s", rawToken)
		case storage.TokenTypeUserSignup:
			redirectURL = fmt.Sprintf("/register/user/%s", rawToken)
		default:
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "unsupported token type", "type", token.Type)
			http.Error(w, "Unsupported token type", http.StatusBadRequest)
			return
		}

		app.DBLogger.LogRequest(r, http.StatusFound, nil, "", "token_type", token.Type.String(), "redirect", redirectURL)
		http.Redirect(w, r, redirectURL, http.StatusFound)
	}
}

// NewRegisterPageHandler creates a handler for showing registration pages
// It validates the token before serving the page
func NewRegisterPageHandler(app *core.App, indexHandler http.HandlerFunc, tokenType storage.AuthTokenType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			app.DBLogger.LogRequest(r, http.StatusMethodNotAllowed, nil, "method not allowed", "method", r.Method)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extract token from URL path
		var rawToken string
		switch tokenType {
		case storage.TokenTypeAdminSignup:
			rawToken = strings.TrimPrefix(r.URL.Path, "/register/admin/")
		case storage.TokenTypeUserSignup:
			rawToken = strings.TrimPrefix(r.URL.Path, "/register/user/")
		default:
			rawToken = strings.TrimPrefix(r.URL.Path, "/register/")
		}
		rawToken = strings.TrimSuffix(rawToken, "/")

		if rawToken == "" {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing token in URL")
			http.Error(w, "Missing registration token", http.StatusBadRequest)
			return
		}

		// Hash the token to look it up in the database
		hashedToken := utils.HashToken(rawToken)

		// Validate the token
		valid, token, err := app.DB.IsTokenValid(hashedToken)
		if err != nil {
			app.Logger.Error("Error validating token", "error", err)
			app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "validate_token")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if !valid || token == nil {
			app.DBLogger.LogRequest(r, http.StatusForbidden, nil, "invalid or expired token", "token_preview", rawToken[:min(8, len(rawToken))])
			http.Error(w, "Invalid or expired registration token", http.StatusForbidden)
			return
		}

		// Verify token type matches expected type
		if token.Type != tokenType {
			app.DBLogger.LogRequest(r, http.StatusForbidden, nil, "wrong token type", "expected", tokenType.String(), "got", token.Type.String())
			http.Error(w, "Invalid token type for this registration page", http.StatusForbidden)
			return
		}

		// Token is valid, serve the index page
		app.DBLogger.LogRequest(r, http.StatusOK, nil, "", "token_type", token.Type.String())
		indexHandler(w, r)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
