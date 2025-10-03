package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"log"
	"strings"
)

// GenerateNonce generates a random base64-encoded nonce
func GenerateNonce() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return base64.StdEncoding.EncodeToString(bytes)
}

// VerifyHMAC verifies the HMAC signature from the Authorization header
// Format: "send-v1 <signature>"
func VerifyHMAC(authHeader, authKey, nonce string) bool {
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "send-v1" {
		log.Printf("HMAC verify failed: invalid header format: %s", authHeader)
		return false
	}

	providedSig := parts[1]

	// Decode the auth key (URL-safe base64, no padding) and nonce (standard base64)
	keyBytes, err := base64.RawURLEncoding.DecodeString(authKey)
	if err != nil {
		log.Printf("HMAC verify failed: invalid authKey base64: %s, error: %v", authKey, err)
		return false
	}

	nonceBytes, err := base64.StdEncoding.DecodeString(nonce)
	if err != nil {
		log.Printf("HMAC verify failed: invalid nonce base64: %s, error: %v", nonce, err)
		return false
	}

	// Decode provided signature (URL-safe base64, no padding)
	providedSigBytes, err := base64.RawURLEncoding.DecodeString(providedSig)
	if err != nil {
		log.Printf("HMAC verify failed: invalid signature base64: %s, error: %v", providedSig, err)
		return false
	}

	// Compute expected HMAC
	h := hmac.New(sha256.New, keyBytes)
	h.Write(nonceBytes)
	expectedSigBytes := h.Sum(nil)

	match := hmac.Equal(expectedSigBytes, providedSigBytes)
	if !match {
		log.Printf("HMAC mismatch - expected: %s, provided: %s",
			base64.RawURLEncoding.EncodeToString(expectedSigBytes), providedSig)
		log.Printf("  authKey: %s, nonce: %s", authKey, nonce)
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
