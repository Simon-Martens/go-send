package core

import (
	"context"
	"net/http"

	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

const sessionCookieName = "send_session"
const GuestTokenCookieName = "send_guest_token"
const GuestLabelCookieName = "send_guest_label"
const GuestRecipientCookieName = "send_guest_recipient"

type guestTokenContextKey struct{}

var guestCtxKey = guestTokenContextKey{}

// GetAuthenticatedSession returns the session associated with the current request cookie.
func (a *App) GetAuthenticatedSession(r *http.Request) (*storage.Session, error) {
	cookie, err := r.Cookie(sessionCookieName)
	if err != nil || cookie.Value == "" {
		return nil, nil
	}

	hashedToken := utils.HashToken(cookie.Value)
	valid, session, err := a.DB.IsSessionValid(hashedToken)
	if err != nil {
		return nil, err
	}
	if !valid || session == nil {
		return nil, nil
	}
	return session, nil
}

// TouchSession updates session last-seen details for the given request.
func (a *App) TouchSession(session *storage.Session, r *http.Request) {
	if session == nil {
		return
	}

	if err := a.DB.UpdateSessionLastSeen(session.ID, storage.NewRequestData(r).IP); err != nil {
		a.Logger.Warn("Failed to update session last seen", "error", err, "session_id", session.ID)
	}
}

// GetGuestAuthToken returns the guest auth token associated with the current request cookie.
func (a *App) GetGuestAuthToken(r *http.Request) (*storage.AuthToken, error) {
	cookie, err := r.Cookie(GuestTokenCookieName)
	if err != nil || cookie.Value == "" {
		return nil, nil
	}

	hashed := utils.HashToken(cookie.Value)
	valid, token, err := a.DB.IsTokenValid(hashed)
	if err != nil {
		return nil, err
	}
	if !valid || token == nil {
		return nil, nil
	}

	// Accept both general (type 2) and user-specific (type 3) guest upload tokens
	if token.Type != storage.TokenTypeGeneralGuestUpload && token.Type != storage.TokenTypeSpecificGuestUpload {
		return nil, nil
	}

	return token, nil
}

// WithGuestToken attaches the guest auth token to the request context.
func WithGuestToken(r *http.Request, token *storage.AuthToken) *http.Request {
	if token == nil || r == nil {
		return r
	}
	ctx := context.WithValue(r.Context(), guestCtxKey, token)
	return r.WithContext(ctx)
}

// GuestTokenFromContext retrieves the guest auth token from the request context.
func GuestTokenFromContext(r *http.Request) *storage.AuthToken {
	if r == nil {
		return nil
	}
	token, _ := r.Context().Value(guestCtxKey).(*storage.AuthToken)
	return token
}

// GetSessionAuthToken retrieves the auth token associated with a session (if session has auth_token_id).
// Returns nil if session is a user session (has user_id instead of auth_token_id).
func (a *App) GetSessionAuthToken(session *storage.Session) (*storage.AuthToken, error) {
	if session == nil || session.AuthTokenID == nil {
		return nil, nil
	}

	token, err := a.DB.GetAuthTokenByID(*session.AuthTokenID)
	if err != nil {
		return nil, err
	}

	return token, nil
}

// GetEffectiveAuthToken gets auth token from session first, falls back to legacy cookie.
// Returns the auth token, the session (if session-based), and any error.
// This helper enables gradual migration from cookie-based to session-based auth.
func (a *App) GetEffectiveAuthToken(r *http.Request) (*storage.AuthToken, *storage.Session, error) {
	// Try session first (new approach)
	session, err := a.GetAuthenticatedSession(r)
	if err != nil {
		return nil, nil, err
	}

	if session != nil && session.AuthTokenID != nil {
		token, err := a.GetSessionAuthToken(session)
		if err != nil {
			return nil, session, err
		}
		return token, session, nil
	}

	// Fallback to legacy cookie
	token, err := a.GetGuestAuthToken(r)
	if err != nil {
		return nil, session, err
	}

	return token, session, nil
}

// GetSessionUser is a convenience method that retrieves both the session and user.
// Returns (session, user, error). Returns (nil, nil, nil) if no valid session exists.
// Middleware should be used to enforce authentication before calling this.
func (a *App) GetSessionUser(r *http.Request) (*storage.Session, *storage.User, error) {
	session, err := a.GetAuthenticatedSession(r)
	if err != nil {
		return nil, nil, err
	}

	if session == nil || session.UserID == nil {
		return session, nil, nil
	}

	user, err := a.DB.GetUser(*session.UserID)
	if err != nil {
		return session, nil, err
	}

	return session, user, nil
}
