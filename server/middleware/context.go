package middleware

import "context"

type contextKey string

const (
	nonceKey contextKey = "cspNonce"
)

// WithNonce adds CSP nonce to context
func WithNonce(ctx context.Context, nonce string) context.Context {
	return context.WithValue(ctx, nonceKey, nonce)
}

// GetNonce retrieves CSP nonce from context
func GetNonce(ctx context.Context) string {
	if nonce, ok := ctx.Value(nonceKey).(string); ok {
		return nonce
	}
	return ""
}
