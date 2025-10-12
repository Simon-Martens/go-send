package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/Simon-Martens/go-send/storage"
)

var ErrNoSessionCookie = errors.New("no session cookie present")

func GetSessionFromRequest(db *storage.DB, r *http.Request) (*storage.Session, error) {
	cookie, err := r.Cookie(SessionCookieName)
	if err != nil {
		return nil, ErrNoSessionCookie
	}

	hash := HashToken(cookie.Value)
	session, err := db.GetSessionByHash(hash)
	if err != nil {
		if errors.Is(err, storage.ErrSessionExpired) && session != nil {
			_ = db.DeleteSessionByID(session.ID)
		}
		return nil, err
	}

	return session, nil
}

func SetSessionCookie(w http.ResponseWriter, token string, maxAge int) {
	cookie := &http.Cookie{
		Name:     SessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	if maxAge > 0 {
		cookie.MaxAge = maxAge
		cookie.Expires = time.Now().Add(time.Duration(maxAge) * time.Second)
	}
	http.SetCookie(w, cookie)
}

func ClearSessionCookie(w http.ResponseWriter, secure bool) {
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   secure,
	})
}
