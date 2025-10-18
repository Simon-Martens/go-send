package context

// contextKey is a type for context keys to avoid collisions
type contextKey string

const (
	// RequestContextKey is the key for storing HTTP request in context
	RequestContextKey contextKey = "request"
	// StatusCodeContextKey is the key for storing HTTP status code in context
	StatusCodeContextKey contextKey = "status_code"
)
