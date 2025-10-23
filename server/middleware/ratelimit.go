package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// IPRateLimiter manages rate limiters per IP address
type IPRateLimiter struct {
	ips map[string]*rate.Limiter
	mu  *sync.RWMutex
	r   rate.Limit
	b   int
}

// NewIPRateLimiter creates a new IP-based rate limiter
// r: requests per second
// b: burst size
func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	i := &IPRateLimiter{
		ips: make(map[string]*rate.Limiter),
		mu:  &sync.RWMutex{},
		r:   r,
		b:   b,
	}

	// Clean up old entries every 5 minutes
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			i.CleanupOldEntries()
		}
	}()

	return i
}

// GetLimiter returns the rate limiter for the given IP address
func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	i.mu.Lock()
	defer i.mu.Unlock()

	limiter, exists := i.ips[ip]
	if !exists {
		limiter = rate.NewLimiter(i.r, i.b)
		i.ips[ip] = limiter
	}

	return limiter
}

// CleanupOldEntries removes rate limiters that haven't been used
func (i *IPRateLimiter) CleanupOldEntries() {
	i.mu.Lock()
	defer i.mu.Unlock()

	// Remove all entries (they'll be recreated if still active)
	// This is a simple approach; more sophisticated cleanup could track last access time
	i.ips = make(map[string]*rate.Limiter)
}

// RateLimit creates a rate limiting middleware
// r: requests per second (e.g., 10.0 = 10 req/s)
// b: burst size (e.g., 20 = allow bursts up to 20 requests)
func RateLimit(r rate.Limit, b int) func(http.Handler) http.Handler {
	limiter := NewIPRateLimiter(r, b)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			ip := GetIP(req)
			limiter := limiter.GetLimiter(ip)

			if !limiter.Allow() {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, req)
		})
	}
}

// GetIP extracts the real IP address from the request
// SECURITY: Only trust X-Real-IP, not X-Forwarded-For to prevent IP spoofing
// If deployed behind a reverse proxy, ensure it sets X-Real-IP or configure
// trusted proxy IP ranges for X-Forwarded-For validation
func GetIP(r *http.Request) string {
	// Try X-Real-IP header (single IP, less prone to spoofing)
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" && isValidIP(realIP) {
		return realIP
	}

	// Fall back to RemoteAddr (actual TCP connection source)
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// isValidIP checks if a string is a valid IP address
func isValidIP(ip string) bool {
	return net.ParseIP(ip) != nil
}

func splitIP(s string) []string {
	var ips []string
	for _, ip := range splitComma(s) {
		if ip != "" {
			ips = append(ips, ip)
		}
	}
	return ips
}

func splitComma(s string) []string {
	var result []string
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == ',' {
			result = append(result, trimSpace(s[start:i]))
			start = i + 1
		}
	}
	result = append(result, trimSpace(s[start:]))
	return result
}

func trimSpace(s string) string {
	start := 0
	end := len(s)

	for start < end && (s[start] == ' ' || s[start] == '\t') {
		start++
	}

	for end > start && (s[end-1] == ' ' || s[end-1] == '\t') {
		end--
	}

	return s[start:end]
}
