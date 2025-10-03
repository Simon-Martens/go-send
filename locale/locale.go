package locale

import (
	"sort"
	"strings"
)

// Common locales that are bundled by webpack
var availableLocales = []string{
	"en-US", "en-GB", "de", "es", "fr", "it", "ja", "ko",
	"pt-BR", "ru", "zh-CN", "zh-TW", "ar", "nl", "pl",
	"cs", "da", "fi", "no", "sv", "tr", "el", "he",
}

// ParseAcceptLanguage parses the Accept-Language header
// Example: "en-US,en;q=0.9,de;q=0.8" -> [{locale: "en-US", q: 1.0}, ...]
func ParseAcceptLanguage(header string) []languageQuality {
	if header == "" {
		return []languageQuality{{locale: "en-US", quality: 1.0}}
	}

	// Limit header length for security
	if len(header) > 255 {
		return []languageQuality{{locale: "en-US", quality: 1.0}}
	}

	parts := strings.Split(header, ",")
	var langs []languageQuality

	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}

		locale := part
		quality := 1.0

		// Parse quality value (e.g., "en;q=0.9")
		if idx := strings.Index(part, ";q="); idx != -1 {
			locale = strings.TrimSpace(part[:idx])
			qStr := strings.TrimSpace(part[idx+3:])
			if q, err := parseFloat(qStr); err == nil && q >= 0 && q <= 1 {
				quality = q
			}
		}

		if locale != "" && locale != "*" {
			langs = append(langs, languageQuality{locale: locale, quality: quality})
		}
	}

	// Sort by quality (descending)
	sort.Slice(langs, func(i, j int) bool {
		return langs[i].quality > langs[j].quality
	})

	return langs
}

type languageQuality struct {
	locale  string
	quality float64
}

// parseFloat is a simple parser for quality values (0.0 to 1.0)
func parseFloat(s string) (float64, error) {
	var result float64
	var decimal bool
	var divisor float64 = 10.0

	for _, c := range s {
		if c == '.' {
			if decimal {
				return 0, nil // Multiple decimals
			}
			decimal = true
			continue
		}
		if c >= '0' && c <= '9' {
			digit := float64(c - '0')
			if decimal {
				result += digit / divisor
				divisor *= 10
			} else {
				result = result*10 + digit
			}
		} else {
			return 0, nil // Invalid character
		}
	}

	return result, nil
}

// NegotiateLocale finds the best matching locale from available locales
func NegotiateLocale(acceptLanguage string) string {
	parsed := ParseAcceptLanguage(acceptLanguage)

	// Try exact matches first
	for _, lang := range parsed {
		for _, available := range availableLocales {
			if strings.EqualFold(lang.locale, available) {
				return available
			}
		}
	}

	// Try language prefix matches (e.g., "en" matches "en-US")
	for _, lang := range parsed {
		prefix := strings.Split(lang.locale, "-")[0]
		for _, available := range availableLocales {
			availablePrefix := strings.Split(available, "-")[0]
			if strings.EqualFold(prefix, availablePrefix) {
				return available
			}
		}
	}

	// Default to en-US
	return "en-US"
}
