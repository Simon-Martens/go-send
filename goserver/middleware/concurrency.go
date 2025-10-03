package middleware

import (
	"net/http"
	"sync"
)

// ConcurrencyLimiter limits concurrent requests per IP
type ConcurrencyLimiter struct {
	ipCount map[string]int
	mu      *sync.Mutex
	max     int
}

// NewConcurrencyLimiter creates a new concurrency limiter
func NewConcurrencyLimiter(maxConcurrent int) *ConcurrencyLimiter {
	return &ConcurrencyLimiter{
		ipCount: make(map[string]int),
		mu:      &sync.Mutex{},
		max:     maxConcurrent,
	}
}

// Acquire tries to acquire a slot for the given IP
func (c *ConcurrencyLimiter) Acquire(ip string) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.ipCount[ip] >= c.max {
		return false
	}

	c.ipCount[ip]++
	return true
}

// Release releases a slot for the given IP
func (c *ConcurrencyLimiter) Release(ip string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.ipCount[ip] > 0 {
		c.ipCount[ip]--
		if c.ipCount[ip] == 0 {
			delete(c.ipCount, ip)
		}
	}
}

// LimitConcurrency creates a middleware that limits concurrent requests per IP
func LimitConcurrency(maxConcurrent int) func(http.Handler) http.Handler {
	limiter := NewConcurrencyLimiter(maxConcurrent)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := GetIP(r)

			if !limiter.Acquire(ip) {
				http.Error(w, "Too many concurrent requests", http.StatusTooManyRequests)
				return
			}

			defer limiter.Release(ip)

			next.ServeHTTP(w, r)
		})
	}
}
