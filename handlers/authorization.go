package handlers

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

// CheckRecipientAuthorization checks if a user is authorized to access a file with recipients.
// Returns: authorized (bool), userID (int64), error
// Only performs checks when UploadGuard is enabled and file has recipients.
func CheckRecipientAuthorization(app *core.App, r *http.Request, fileID string, meta *storage.FileMetadata) (authorized bool, userID int64, err error) {
	// Skip check if UploadGuard is disabled
	if !app.Config.UploadGuard {
		return true, 0, nil
	}

	// Check if file has recipients
	hasRecipients, err := app.DB.HasRecipients(fileID)
	if err != nil {
		return false, 0, err
	}

	// If no recipients, file is public
	if !hasRecipients {
		return true, 0, nil
	}

	// File has recipients - check user authorization
	session, err := app.GetAuthenticatedSession(r)
	if err != nil {
		return false, 0, err
	}

	// No session or no user ID - not authorized
	if session == nil || session.UserID == nil {
		return false, 0, nil
	}

	userID = *session.UserID

	// Check if user is the owner
	if meta.OwnerUserID != nil && *meta.OwnerUserID == userID {
		return true, userID, nil
	}

	// Check if user is a recipient
	isRecipient, err := app.DB.IsRecipient(fileID, userID)
	if err != nil {
		return false, userID, err
	}

	return isRecipient, userID, nil
}

// Render403Page renders the 403 Forbidden page with a login redirect
func Render403Page(app *core.App, w http.ResponseWriter, r *http.Request, downloadPath string) {
	redirectURL := url.QueryEscape(downloadPath)

	locale := getLocaleFromRequest(r, app.Config.CustomLocale)

	// Generate nonce for CSP
	nonce, err := utils.GenerateNonce()
	if err != nil {
		app.Logger.Error("Failed to generate nonce for 403 page", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Build template data using the standard structure
	data := getTemplateData(app.Manifest, "{}", app.Config, locale, nonce)

	// Add 403-specific data
	data403 := struct {
		TemplateData
		RedirectURL string
	}{
		TemplateData: data,
		RedirectURL:  redirectURL,
	}

	// Set CSP header with nonce
	csp := fmt.Sprintf(
		"default-src 'none'; "+
			"connect-src 'self'; "+
			"img-src 'self' data:; "+
			"script-src 'nonce-%s'; "+
			"style-src 'self' 'nonce-%s'; "+
			"font-src 'self'; "+
			"worker-src 'self'; "+
			"form-action 'self'; "+
			"frame-ancestors 'none'; "+
			"object-src 'none'; "+
			"base-uri 'self';",
		nonce, nonce,
	)
	w.Header().Set("Content-Security-Policy", csp)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	w.WriteHeader(http.StatusForbidden)
	if err := app.Template.ExecuteTemplate(w, "403.gohtml", data403); err != nil {
		app.Logger.Error("Error rendering 403 template", "error", err)
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

// checkUploadRecipientAccess validates upload recipient for Type 3 tokens.
// Returns true if upload is allowed, false otherwise.
func checkUploadRecipientAccess(app *core.App, session *storage.Session, recipientUserID *int64) (bool, error) {
	if session == nil || session.AuthTokenID == nil {
		// Not a guest session, no restrictions
		return true, nil
	}

	// Get the auth token
	token, err := app.GetSessionAuthToken(session)
	if err != nil {
		return false, err
	}

	if token == nil {
		// No token found, shouldn't happen but be defensive
		return false, nil
	}

	// Type 3: Can only upload to token creator
	if token.Type == storage.TokenTypeSpecificGuestUpload {
		if recipientUserID == nil || *recipientUserID != token.CreatedBy {
			return false, nil
		}
	}

	// Type 2 or other types: no restrictions
	return true, nil
}
