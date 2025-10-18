package utils

import (
	"crypto/sha256"
	"encoding/base64"
)

// HashToken hashes a token using SHA-256 and returns a base64url-encoded string
// This is used for storing tokens securely in the database
func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(hash[:])
}
