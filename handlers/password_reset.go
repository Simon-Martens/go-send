package handlers

import (
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
	"golang.org/x/crypto/curve25519"
	"golang.org/x/crypto/hkdf"
	"golang.org/x/crypto/pbkdf2"
)

const (
	ed25519Info = "go-send-ed25519-seed"
	x25519Info  = "go-send-x25519-seed"
)

type passwordResetFilePayload struct {
	ID           string `json:"id"`
	Ciphertext   string `json:"ciphertext"`
	Nonce        string `json:"nonce"`
	EphemeralPub string `json:"ephemeral_pub"`
	Version      int    `json:"version"`
}

type passwordResetRequest struct {
	CurrentPassword        string                     `json:"current_password"`
	NewSalt                string                     `json:"new_salt"`
	NewPublicKey           string                     `json:"new_public_key"`
	NewEncryptionPublicKey string                     `json:"new_encryption_public_key"`
	KDF                    *storage.UserKDFSettings   `json:"kdf"`
	Files                  []passwordResetFilePayload `json:"files"`
}

func NewPasswordResetHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures user authentication
		session, _ := app.GetAuthenticatedSession(r)

		var req passwordResetRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		if len(req.CurrentPassword) == 0 {
			http.Error(w, "Current password is required", http.StatusBadRequest)
			return
		}
		if req.NewSalt == "" || req.NewPublicKey == "" || req.NewEncryptionPublicKey == "" {
			http.Error(w, "Missing new key parameters", http.StatusBadRequest)
			return
		}

		user, err := app.DB.GetUser(*session.UserID)
		if err != nil {
			app.Logger.Error("Password reset: failed to load user", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		saltBytes, err := base64.RawURLEncoding.DecodeString(user.Salt)
		if err != nil || len(saltBytes) == 0 {
			app.Logger.Error("Password reset: stored salt invalid", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		kdfSettings, err := user.GetKDFSettings()
		if err != nil {
			app.Logger.Error("Password reset: failed to decode kdf settings", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		edSeed, _, err := deriveSeeds(req.CurrentPassword, saltBytes, kdfSettings)
		if err != nil {
			app.Logger.Warn("Password reset: failed to derive current credentials", "error", err)
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		defer zeroBytes(edSeed)

		derivedPriv := ed25519.NewKeyFromSeed(edSeed)
		storedPubBytes, err := base64.RawURLEncoding.DecodeString(user.PublicKey)
		if err != nil {
			app.Logger.Error("Password reset: stored public key invalid", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if !ed25519.PublicKey(storedPubBytes).Equal(derivedPriv.Public().(ed25519.PublicKey)) {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		newSaltBytes, err := base64.RawURLEncoding.DecodeString(req.NewSalt)
		if err != nil || len(newSaltBytes) == 0 {
			http.Error(w, "Invalid new salt", http.StatusBadRequest)
			return
		}

		newPubBytes, err := base64.RawURLEncoding.DecodeString(req.NewPublicKey)
		if err != nil || len(newPubBytes) != ed25519.PublicKeySize {
			http.Error(w, "Invalid new public key", http.StatusBadRequest)
			return
		}

		newEncPubBytes, err := base64.RawURLEncoding.DecodeString(req.NewEncryptionPublicKey)
		if err != nil || len(newEncPubBytes) != curve25519.PointSize {
			http.Error(w, "Invalid new encryption public key", http.StatusBadRequest)
			return
		}

		fileUpdates := make([]storage.FileSecretUpdate, 0, len(req.Files))
		for _, f := range req.Files {
			if f.ID == "" || f.Ciphertext == "" || f.Nonce == "" || f.EphemeralPub == "" {
				http.Error(w, "Invalid file payload", http.StatusBadRequest)
				return
			}
			if _, err := base64.RawURLEncoding.DecodeString(f.Ciphertext); err != nil {
				http.Error(w, "Invalid ciphertext encoding", http.StatusBadRequest)
				return
			}
			if _, err := base64.RawURLEncoding.DecodeString(f.Nonce); err != nil {
				http.Error(w, "Invalid nonce encoding", http.StatusBadRequest)
				return
			}
			if _, err := base64.RawURLEncoding.DecodeString(f.EphemeralPub); err != nil {
				http.Error(w, "Invalid ephemeral public key encoding", http.StatusBadRequest)
				return
			}
			if f.Version == 0 {
				f.Version = 1
			}
			fileUpdates = append(fileUpdates, storage.FileSecretUpdate{
				ID:           f.ID,
				Ciphertext:   f.Ciphertext,
				Nonce:        f.Nonce,
				EphemeralPub: f.EphemeralPub,
				Version:      f.Version,
			})
		}

		if req.KDF != nil && strings.EqualFold(req.KDF.Algorithm, "") {
			req.KDF.Algorithm = "pbkdf2-sha256"
		}

		if err := user.SetKDFSettings(req.KDF); err != nil {
			app.Logger.Error("Password reset: failed to encode kdf settings", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		err = app.DB.UpdateUserCredentialsAndSecrets(
			user.ID,
			req.NewSalt,
			req.NewPublicKey,
			req.NewEncryptionPublicKey,
			user.Settings,
			fileUpdates,
		)
		if err != nil {
			app.Logger.Error("Password reset: database update failed", "error", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

func deriveSeeds(password string, salt []byte, kdf *storage.UserKDFSettings) ([]byte, []byte, error) {
	if len(password) == 0 {
		return nil, nil, errors.New("password required")
	}
	if len(salt) == 0 {
		return nil, nil, errors.New("salt required")
	}

	algorithm := "pbkdf2-sha256"
	iterations := 600000
	outputLength := 32

	if kdf != nil {
		if strings.TrimSpace(kdf.Algorithm) != "" {
			algorithm = strings.ToLower(kdf.Algorithm)
		}
		if kdf.Iterations > 0 {
			iterations = kdf.Iterations
		}
		if kdf.OutputLength > 0 {
			outputLength = kdf.OutputLength
		}
	}

	if algorithm != "pbkdf2-sha256" {
		return nil, nil, fmt.Errorf("unsupported kdf algorithm: %s", algorithm)
	}

	pbkdf := pbkdf2.Key([]byte(password), salt, iterations, outputLength, sha256.New)
	defer zeroBytes(pbkdf)

	edSeed := make([]byte, outputLength)
	edHKDF := hkdf.New(sha256.New, pbkdf, nil, []byte(ed25519Info))
	if _, err := io.ReadFull(edHKDF, edSeed); err != nil {
		return nil, nil, fmt.Errorf("derive ed seed: %w", err)
	}

	xSeed := make([]byte, curve25519.ScalarSize)
	xHKDF := hkdf.New(sha256.New, pbkdf, nil, []byte(x25519Info))
	if _, err := io.ReadFull(xHKDF, xSeed); err != nil {
		return nil, nil, fmt.Errorf("derive x25519 seed: %w", err)
	}

	return edSeed, xSeed, nil
}

func zeroBytes(b []byte) {
	for i := range b {
		b[i] = 0
	}
}
