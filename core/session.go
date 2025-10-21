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
