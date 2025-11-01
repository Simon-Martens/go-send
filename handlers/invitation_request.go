package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/email"
	"github.com/Simon-Martens/go-send/storage"
)

type invitationRequestBody struct {
	Email string `json:"email"`
}

type invitationRequestResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Simple email validation regex
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// NewInvitationRequestHandler creates a handler for self-service invitation requests
// This endpoint allows users to request an invitation by providing their email address
// If the email domain is in the allowed list, a signup token is generated and emailed
func NewInvitationRequestHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Only accept POST requests
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", "POST")
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Check if the feature is enabled
		if !app.Config.IsInvitationRequestEnabled() {
			app.Logger.Warn("Invitation request received but feature is disabled")
			http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
			return
		}

		// Parse request body
		var req invitationRequestBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			app.Logger.Debug("Invitation request: invalid JSON", "error", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Normalize email
		email := strings.TrimSpace(strings.ToLower(req.Email))

		// Validate email format
		if !emailRegex.MatchString(email) {
			app.Logger.Debug("Invitation request: invalid email format", "email", email)
			// Still return success to avoid leaking information
			sendSuccessResponse(w, app)
			return
		}

		// Check if domain is allowed
		if !app.Config.IsEmailDomainAllowed(email) {
			app.Logger.Info("Invitation request: domain not allowed",
				"email", email,
				"ip", r.RemoteAddr,
			)
			// Return success to avoid leaking allowed domains
			sendSuccessResponse(w, app)
			return
		}

		// Generate signup token
		// Creator ID = 0 (system-generated)
		// Token type = user signup
		// TTL = 7 days
		// Max uses = 1 (single-use token)
		const tokenLifetime = 7 * 24 * time.Hour
		const maxUses = 1

		rawToken, token, err := app.DB.GenerateSignupToken(0, storage.TokenTypeUserSignup, tokenLifetime, maxUses)
		if err != nil {
			app.Logger.Error("Invitation request: failed to generate token",
				"error", err,
				"email", email,
			)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Build claim URL
		baseURL := resolveBaseURL(app, r)
		claimURL := fmt.Sprintf("%s/auth/claim/%s", baseURL, rawToken)

		// Render email template
		subject, body, err := email.RenderUserSignupInvitation(email, claimURL)
		if err != nil {
			app.Logger.Error("Invitation request: failed to render email",
				"error", err,
				"email", email,
			)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Send email asynchronously
		app.SendEmailAsync(email, subject, body)

		// Log the successful invitation request
		app.Logger.Info("Invitation request: token generated and email queued",
			"email", email,
			"token_id", token.ID,
			"expires_at", *token.ExpiresAt,
			"ip", r.RemoteAddr,
		)

		// Log to database
		app.DBLogger.LogRequest(r, http.StatusOK, nil, "",
			"action", "invitation_request",
			"email", email,
			"token_id", token.ID,
		)

		// Return success response
		sendSuccessResponse(w, app)
	}
}

// sendSuccessResponse sends a generic success response
// This is used for both successful and denied requests to avoid information leakage
func sendSuccessResponse(w http.ResponseWriter, app *core.App) {
	resp := invitationRequestResponse{
		Success: true,
		Message: "If your email domain is authorized, you will receive an invitation shortly.",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		app.Logger.Warn("Invitation request: failed to encode response", "error", err)
	}
}
