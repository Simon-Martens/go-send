package handlers

import (
	"crypto/ed25519"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/Simon-Martens/go-send/utils"
)

const (
	challengeTTL   = 5 * time.Minute
	sessionTTL     = 24 * time.Hour
	sessionCookie  = "send_session"
	signatureBytes = 64
)

type loginChallengeRequest struct {
	Email string `json:"email"`
}

type loginChallengeResponse struct {
	ChallengeID int64                    `json:"challenge_id"`
	Nonce       string                   `json:"nonce"`
	Salt        string                   `json:"salt"`
	KDF         *storage.UserKDFSettings `json:"kdf,omitempty"`
}

type loginRequest struct {
	Email       string `json:"email"`
	ChallengeID int64  `json:"challenge_id"`
	Signature   string `json:"signature"`
}

type loginResponse struct {
	OK bool `json:"ok"`
}

func NewLoginChallengeHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			app.DBLogger.LogRequest(r, http.StatusMethodNotAllowed, nil, "method not allowed", "method", r.Method)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		var req loginChallengeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid JSON", "error", err.Error())
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if req.Email == "" {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing email")
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		user, err := app.DB.GetUserByEmail(req.Email)
		if err != nil {
			app.DBLogger.LogAuthEvent(r, "challenge_failed", req.Email, false, err.Error())
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		if !user.Active {
			app.DBLogger.LogAuthEvent(r, "challenge_failed", req.Email, false, "inactive user")
			http.Error(w, "Account disabled", http.StatusForbidden)
			return
		}

		nonce, err := generateChallengeNonce()
		if err != nil {
			app.Logger.Error("Failed to generate login nonce", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		challenge, err := app.DB.CreateLoginChallenge(user.ID, nonce, challengeTTL)
		if err != nil {
			app.Logger.Error("Failed to persist login challenge", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		kdfSettings, err := user.GetKDFSettings()
		if err != nil {
			app.Logger.Error("Failed to decode KDF settings", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		resp := loginChallengeResponse{
			ChallengeID: challenge.ID,
			Nonce:       nonce,
			Salt:        user.Salt,
			KDF:         kdfSettings,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)

		app.DBLogger.LogAuthEvent(r, "challenge_issued", req.Email, true, "")
	}
}

func NewLoginHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			app.DBLogger.LogRequest(r, http.StatusMethodNotAllowed, nil, "method not allowed", "method", r.Method)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "invalid JSON", "error", err.Error())
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if req.Email == "" || req.Signature == "" || req.ChallengeID == 0 {
			app.DBLogger.LogRequest(r, http.StatusBadRequest, nil, "missing required fields")
			http.Error(w, "Missing required fields", http.StatusBadRequest)
			return
		}

		user, err := app.DB.GetUserByEmail(req.Email)
		if err != nil {
			app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, err.Error())
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		challenge, err := app.DB.GetLoginChallenge(req.ChallengeID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, "challenge not found")
				http.Error(w, "Invalid challenge", http.StatusUnauthorized)
				return
			}
			app.Logger.Error("Failed to fetch login challenge", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if challenge.UserID != user.ID {
			app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, "challenge mismatch")
			http.Error(w, "Invalid challenge", http.StatusUnauthorized)
			return
		}

		if challenge.Used || time.Now().Unix() > challenge.Expires {
			app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, "challenge expired")
			http.Error(w, "Challenge expired", http.StatusUnauthorized)
			return
		}

		pubKey, err := base64.RawURLEncoding.DecodeString(user.PublicKey)
		if err != nil {
			app.Logger.Error("Stored public key invalid", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if len(pubKey) != ed25519.PublicKeySize {
			app.Logger.Error("Stored public key incorrect length", "length", len(pubKey))
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		nonceBytes, err := base64.RawURLEncoding.DecodeString(challenge.Nonce)
		if err != nil {
			app.Logger.Error("Stored nonce invalid", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		sig, err := base64.RawURLEncoding.DecodeString(req.Signature)
		if err != nil || len(sig) != signatureBytes {
			app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, "invalid signature encoding")
			http.Error(w, "Invalid signature", http.StatusUnauthorized)
			return
		}

		if !ed25519.Verify(pubKey, nonceBytes, sig) {
			app.DBLogger.LogAuthEvent(r, "login_failed", req.Email, false, "signature verification failed")
			http.Error(w, "Invalid signature", http.StatusUnauthorized)
			return
		}

		rawToken, hashedToken, err := generateSessionToken()
		if err != nil {
			app.Logger.Error("Failed to generate session token", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		userID := user.ID
		session := &storage.Session{
			Token:     hashedToken,
			LastIP:    storage.NewRequestData(r).IP,
			ExpiresAt: time.Now().Add(sessionTTL).Unix(),
			UserID:    &userID,
		}

		if err := app.DB.CreateSession(session); err != nil {
			app.Logger.Error("Failed to persist session", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if err := app.DB.MarkLoginChallengeUsed(challenge.ID); err != nil {
			app.Logger.Warn("Failed to mark challenge used", "error", err, "challenge_id", challenge.ID)
		}

		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookie,
			Value:    rawToken,
			Path:     "/",
			HttpOnly: true,
			Secure:   r.TLS != nil,
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Unix(session.ExpiresAt, 0),
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(loginResponse{OK: true})

		app.DBLogger.LogAuthEvent(r, "login_success", req.Email, true, "")
	}
}

func generateChallengeNonce() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func generateSessionToken() (string, string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", "", err
	}
	raw := base64.RawURLEncoding.EncodeToString(b)
	return raw, utils.HashToken(raw), nil
}
