package core

import (
	"net/http"

	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

const sessionCookieName = "send_session"

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
