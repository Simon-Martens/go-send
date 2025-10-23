package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
)

// SecurityHeaders adds security-related HTTP headers
func SecurityHeaders(isDev bool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// X-Frame-Options: Prevent clickjacking
			w.Header().Set("X-Frame-Options", "DENY")

			// X-Content-Type-Options: Prevent MIME sniffing
			w.Header().Set("X-Content-Type-Options", "nosniff")

			// X-XSS-Protection: Enable XSS filter
			w.Header().Set("X-XSS-Protection", "1; mode=block")

			// Referrer-Policy: Control referrer information
			w.Header().Set("Referrer-Policy", "no-referrer")

			// Permissions-Policy: Disable unnecessary browser features
			w.Header().Set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=(), serial=(), magnetometer=(), gyroscope=(), accelerometer=(), fullscreen=(self)")

			// Cross-Origin policies: Isolate browsing context and prevent unauthorized embedding
			w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
			w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
			w.Header().Set("Cross-Origin-Resource-Policy", "same-origin")

			// HSTS: Force HTTPS (only in production)
			if !isDev {
				w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
			}

			// Cache Control: Prevent caching of sensitive data
			w.Header().Set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0")
			w.Header().Set("Pragma", "no-cache")

			next.ServeHTTP(w, r)
		})
	}
}

// CSPNonce generates a random nonce for CSP
func CSPNonce() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// CSP adds Content Security Policy headers with nonce support
func CSP(isDev bool, baseURL string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Generate nonce for inline scripts/styles
			nonce, err := CSPNonce()
			if err != nil {
				http.Error(w, "Internal server error", http.StatusInternalServerError)
				return
			}

			// Store nonce in request context for use in templates
			r = r.WithContext(WithNonce(r.Context(), nonce))

			// Apply CSP in both development and production
			// Determine WebSocket URL
			wsScheme := "ws"
			if r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https" {
				wsScheme = "wss"
			}
			wsURL := fmt.Sprintf("%s://%s", wsScheme, r.Host)

			csp := fmt.Sprintf(
				"default-src 'none'; "+
					"connect-src 'self' %s; "+
					"img-src 'self' data:; "+
					"script-src 'nonce-%s'; "+
					"style-src 'self' 'nonce-%s'; "+
					"font-src 'self'; "+
					"worker-src 'self'; "+
					"form-action 'self'; "+
					"frame-ancestors 'none'; "+
					"object-src 'none'; "+
					"base-uri 'self';",
				wsURL, nonce, nonce,
			)

			w.Header().Set("Content-Security-Policy", csp)

			next.ServeHTTP(w, r)
		})
	}
}

// LimitRequestBody limits the size of HTTP request bodies
func LimitRequestBody(maxBytes int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Skip for websocket upgrades (handled separately in upload handler)
			if r.Header.Get("Upgrade") == "websocket" {
				next.ServeHTTP(w, r)
				return
			}

			// Limit request body size for regular HTTP requests
			r.Body = http.MaxBytesReader(w, r.Body, maxBytes)

			next.ServeHTTP(w, r)
		})
	}
}
