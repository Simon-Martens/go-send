package handlers

import (
	"net/http"
	"strings"
)

// getLocaleFromRequest detects the user's preferred locale from the Accept-Language
// header, falling back to a configured default, then "en" as last resort.
func getLocaleFromRequest(r *http.Request, fallback string) string {
	// Try Accept-Language header first
	acceptLang := r.Header.Get("Accept-Language")
	if acceptLang != "" {
		// Parse "en-US,en;q=0.9,fr;q=0.8" format
		// Extract first language code (before dash or comma)
		parts := strings.Split(acceptLang, ",")
		if len(parts) > 0 {
			lang := strings.Split(parts[0], "-")[0]
			lang = strings.TrimSpace(lang)
			if lang != "" {
				return lang
			}
		}
	}

	// Fall back to configured locale
	if fallback != "" {
		return fallback
	}

	// Final fallback to English
	return "en"
}
