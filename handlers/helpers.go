package handlers

import "net/http"

// isSecureRequest returns true if the request is over HTTPS,
// either directly or behind a reverse proxy
func isSecureRequest(r *http.Request) bool {
	return r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https"
}
