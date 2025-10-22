package utils

import (
	"crypto/rand"
	"encoding/base64"
)

// GenerateNonce generates a random base64-encoded string for CSP nonces.
func GenerateNonce() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}
