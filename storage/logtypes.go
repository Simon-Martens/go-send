package storage

import (
	"encoding/json"
	"net"
	"net/http"
	"strings"
)

// RequestData represents HTTP request information for logging
// This structure is serialized to JSON and stored in the request_data field
// of all log tables (file_transfer_logs, auth_event_logs, request_logs)
type RequestData struct {
	Method    string            `json:"method"`
	Path      string            `json:"path"`
	IP        string            `json:"ip"`
	UserAgent string            `json:"user_agent,omitempty"`
	Headers   map[string]string `json:"headers,omitempty"`
}

// NewRequestData creates a RequestData from an http.Request
// It extracts the real IP address considering X-Forwarded-For and X-Real-IP headers
func NewRequestData(r *http.Request) *RequestData {
	return &RequestData{
		Method:    r.Method,
		Path:      r.URL.Path,
		IP:        extractIP(r),
		UserAgent: r.UserAgent(),
		Headers:   extractHeaders(r),
	}
}

// NewRequestDataWithPath creates a RequestData with a custom path
// Useful when the logged path differs from r.URL.Path (e.g., after routing)
func NewRequestDataWithPath(r *http.Request, path string) *RequestData {
	rd := NewRequestData(r)
	rd.Path = path
	return rd
}

// ToJSON serializes RequestData to json.RawMessage for database storage
func (rd *RequestData) ToJSON() json.RawMessage {
	data, err := json.Marshal(rd)
	if err != nil {
		// Fallback to empty object if serialization fails
		return json.RawMessage("{}")
	}
	return json.RawMessage(data)
}

// extractIP gets the real client IP address from the request
// It checks X-Forwarded-For and X-Real-IP headers first (for reverse proxies)
// Falls back to RemoteAddr if headers are not present
func extractIP(r *http.Request) string {
	// Check X-Forwarded-For header (can contain multiple IPs)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// Take the first IP (client IP)
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr // Return as-is if parsing fails
	}
	return ip
}

// extractHeaders extracts important headers for logging
// We don't log all headers for privacy/security reasons
// Only log headers that are useful for debugging and analytics
// NEVER logs Authorization or Cookie headers for security
func extractHeaders(r *http.Request) map[string]string {
	headers := make(map[string]string)

	// Important headers to log (excludes Authorization and Cookie)
	headersToLog := []string{
		"Content-Type",
		"Accept",
		"Accept-Language",
		"Referer",
		"Origin",
	}

	for _, key := range headersToLog {
		if value := r.Header.Get(key); value != "" {
			headers[key] = value
		}
	}

	// Only return headers map if it's not empty
	if len(headers) == 0 {
		return nil
	}

	return headers
}
