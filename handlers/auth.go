package handlers

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

const guestCookieTTL = 365 * 24 * time.Hour

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
		baseURL := resolveBaseURL(app, r)
		switch token.Type {
		case storage.TokenTypeAdminSignup:
			redirectURL := fmt.Sprintf("%s/register/admin/%s", baseURL, rawToken)
			app.DBLogger.LogRequest(r, http.StatusFound, nil, "", "token_type", token.Type.String(), "redirect", redirectURL)
			http.Redirect(w, r, redirectURL, http.StatusFound)
		case storage.TokenTypeUserSignup:
			redirectURL := fmt.Sprintf("%s/register/user/%s", baseURL, rawToken)
			app.DBLogger.LogRequest(r, http.StatusFound, nil, "", "token_type", token.Type.String(), "redirect", redirectURL)
			http.Redirect(w, r, redirectURL, http.StatusFound)
		case storage.TokenTypeGeneralGuestUpload:
			handleGuestUploadClaim(app, w, r, token, rawToken)
		case storage.TokenTypeSpecificGuestUpload:
			handleGuestUploadClaim(app, w, r, token, rawToken)
		default:
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "unsupported token type", "type", token.Type)
			http.Error(w, "Unsupported token type", http.StatusBadRequest)
		}
	}
}

func handleGuestUploadClaim(app *core.App, w http.ResponseWriter, r *http.Request, token *storage.AuthToken, rawToken string) {
	baseURL := resolveBaseURL(app, r)

	// Check if user is already logged in with a valid session
	session, err := app.GetAuthenticatedSession(r)
	if err != nil {
		app.Logger.Error("Error checking for authenticated session", "error", err)
		app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "check_session")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// If user has a valid session, redirect to upload page without setting guest cookie
	if session != nil {
		app.DBLogger.LogRequest(
			r,
			http.StatusFound,
			session.UserID,
			"logged_in_user_cannot_claim_guest_token",
			"session_id", session.ID,
			"auth_token_id", token.ID,
		)
		http.Redirect(w, r, baseURL+"/", http.StatusFound)
		return
	}

	// No active session - proceed with guest cookie and session setup
	label := strings.TrimSpace(token.Name)
	if label == "" {
		label = "Guest uploader"
	}

	// Create a proper session for this auth token
	sessionRawToken, sessionHashedToken, err2 := GenerateSessionToken()
	if err2 != nil {
		app.Logger.Error("Failed to generate session token for guest", "error", err2)
		app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err2.Error(), "operation", "generate_session_token")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	tokenID := token.ID
	session = &storage.Session{
		Token:       sessionHashedToken,
		LastIP:      storage.NewRequestData(r).IP,
		ExpiresAt:   time.Now().Add(guestCookieTTL).Unix(),
		Ephemeral:   false,
		AuthTokenID: &tokenID,
	}

	if err := app.DB.CreateSession(session); err != nil {
		app.Logger.Error("Failed to create session for guest", "error", err)
		app.DBLogger.LogRequest(r, http.StatusInternalServerError, nil, err.Error(), "operation", "create_session")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Set the new session cookie (HttpOnly for security)
	http.SetCookie(w, &http.Cookie{
		Name:     "send_session",
		Value:    sessionRawToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   isSecureRequest(r),
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(guestCookieTTL),
		MaxAge:   int(guestCookieTTL.Seconds()),
	})

	// Keep the legacy guest token cookie for backward compatibility (JavaScript-readable)
	http.SetCookie(w, &http.Cookie{
		Name:     core.GuestTokenCookieName,
		Value:    rawToken,
		Path:     "/",
		HttpOnly: false,
		Secure:   isSecureRequest(r),
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(guestCookieTTL),
		MaxAge:   int(guestCookieTTL.Seconds()),
	})
	http.SetCookie(w, &http.Cookie{
		Name:     core.GuestLabelCookieName,
		Value:    url.QueryEscape(label),
		Path:     "/",
		HttpOnly: false,
		Secure:   isSecureRequest(r),
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(guestCookieTTL),
		MaxAge:   int(guestCookieTTL.Seconds()),
	})

	// For user-specific upload links (type 3), set a cookie with the locked recipient ID
	if token.Type == storage.TokenTypeSpecificGuestUpload {
		recipientID := fmt.Sprintf("%d", token.CreatedBy)
		http.SetCookie(w, &http.Cookie{
			Name:     core.GuestRecipientCookieName,
			Value:    recipientID,
			Path:     "/",
			HttpOnly: false,
			Secure:   isSecureRequest(r),
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Now().Add(guestCookieTTL),
			MaxAge:   int(guestCookieTTL.Seconds()),
		})
	}

	app.DBLogger.LogRequest(
		r,
		http.StatusFound,
		nil,
		"guest_upload_claimed",
		"auth_token_id", token.ID,
		"label", label,
	)

	http.Redirect(w, r, baseURL+"/", http.StatusFound)
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
