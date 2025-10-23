package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"log/slog"
	"strings"
)

// GenerateNonce generates a random base64-encoded nonce
func GenerateNonce() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil
}

// VerifyHMAC verifies the HMAC signature from the Authorization header
// Format: "send-v1 <signature>"
func VerifyHMAC(authHeader, authKey, nonce string, logger *slog.Logger) bool {
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "send-v1" {
		logger.Warn("HMAC verification failed: invalid header format",
			"auth_header", authHeader)
		return false
	}

	providedSig := parts[1]

	// Decode the auth key (URL-safe base64, no padding) and nonce (standard base64)
	keyBytes, err := base64.RawURLEncoding.DecodeString(authKey)
	if err != nil {
		logger.Warn("HMAC verification failed: invalid authKey base64",
			"auth_key", authKey, "error", err)
		return false
	}

	nonceBytes, err := base64.StdEncoding.DecodeString(nonce)
	if err != nil {
		logger.Warn("HMAC verification failed: invalid nonce base64",
			"nonce", nonce, "error", err)
		return false
	}

	// Decode provided signature (URL-safe base64, no padding)
	providedSigBytes, err := base64.RawURLEncoding.DecodeString(providedSig)
	if err != nil {
		logger.Warn("HMAC verification failed: invalid signature base64",
			"signature", providedSig, "error", err)
		return false
	}

	// Compute expected HMAC
	h := hmac.New(sha256.New, keyBytes)
	h.Write(nonceBytes)
	expectedSigBytes := h.Sum(nil)

	match := hmac.Equal(expectedSigBytes, providedSigBytes)
	if !match {
		logger.Warn("HMAC verification failed: signature mismatch",
			"expected", base64.RawURLEncoding.EncodeToString(expectedSigBytes),
			"provided", providedSig,
			"auth_key", authKey,
			"nonce", nonce)
	}

	return match
}

// ExtractAuthKey extracts the base64 auth key from "send-v1 <key>" format
func ExtractAuthKey(authHeader string) string {
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 {
		return ""
	}
	return parts[1]
}
