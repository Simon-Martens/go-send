package config

import "time"

// Database constants
const (
	DB_PATH = "./send.db"
)

// Template and frontend paths
const (
	EMBEDDED_TEMPLATES_PATH   = "frontend/templates/*.gohtml"
	EMBEDDED_TEMPLATES_PREFIX = "frontend/templates/"
	EMBEDDED_DIST_PATH        = "frontend/dist"
	USER_TEMPLATES_SUBDIR     = "templates"
	USER_PUBLIC_SUBDIR        = "public"
	TEMPLATE_FILE_EXTENSION   = ".gohtml"
)

// Default manifest files
const (
	DEFAULT_MANIFEST_JS  = "app.js"
	DEFAULT_MANIFEST_CSS = "app.css"
)

// Concurrency and rate limiting
const (
	MAX_CONCURRENT_UPLOADS_PER_IP = 3
	RATE_LIMIT_REQUESTS_PER_SECOND = 100.0
	RATE_LIMIT_BURST_SIZE          = 200
)

// Request size limits
const (
	MAX_REQUEST_BODY_SIZE = 10 * 1024 * 1024 // 10 MB
	MAX_HEADER_BYTES      = 1 << 20          // 1 MB
)

// Server timeouts
const (
	SERVER_READ_TIMEOUT        = 10 * time.Minute
	SERVER_WRITE_TIMEOUT       = 10 * time.Minute
	SERVER_IDLE_TIMEOUT        = 120 * time.Second
	SERVER_READ_HEADER_TIMEOUT = 10 * time.Second
)

// Cleanup intervals
const (
	CLEANUP_CHECK_INTERVAL = 1 * time.Hour
	CLEANUP_TICKER_INTERVAL = 1 * time.Hour
)
