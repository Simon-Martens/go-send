package handlers

import (
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/core"
)

// isSecureRequest returns true if the request is over HTTPS,
// either directly or behind a reverse proxy
func isSecureRequest(r *http.Request) bool {
	return r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https"
}

// resolveBaseURL returns the base URL for the application,
// using the configured BASE_URL or auto-detecting from the request
func resolveBaseURL(app *core.App, r *http.Request) string {
	base := app.Config.BaseURL
	if base == "" && app.Config.DetectBaseURL {
		scheme := "http"
		if isSecureRequest(r) {
			scheme = "https"
		}
		base = scheme + "://" + r.Host
	} else if base == "" {
		base = "http://localhost:" + app.Config.Port
	}
	return strings.TrimRight(base, "/")
}
