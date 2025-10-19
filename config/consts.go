package config

import "time"

const (
	DB_PATH     = "./data/send.db"
	LOG_DB_PATH = "./data/logs.db"
)

const (
	// APP_VERSION tracks the application version
	// Increment this when making breaking changes that require clearing localStorage
	// or forcing re-authentication (e.g., security updates, data structure changes)
	APP_VERSION = "1.0.0"
)

const (
	DEFAULT_ENVIRONMENT = "development"
)

const (
	DEFAULT_PORT              = "8080"
	DEFAULT_BASE_URL          = ""
	DEFAULT_DETECT_BASE_URL   = true
	DEFAULT_FILE_DIR          = "./data/uploads"
	DEFAULT_USER_FRONTEND_DIR = "./userfrontend"
	DEFAULT_USE_UPLOAD_GUARD  = true
	DEFAULT_USE_USER_MGMT     = true
	DEFAULT_USE_ACCESS_LINKS  = true

	DEFAULT_MAX_FILE_SIZE          int64 = 2684354560 // 2.5GB
	DEFAULT_MAX_FILES_PER_ARCHIVE        = 64
	DEFAULT_MAX_EXPIRE_SECONDS           = 3600 * 24 * 30
	DEFAULT_MAX_DOWNLOADS                = 1000
	DEFAULT_DEFAULT_DOWNLOADS            = 5
	DEFAULT_DEFAULT_EXPIRE_SECONDS       = 3600 * 24 * 3

	DEFAULT_UI_COLOR_PRIMARY = "#0A84FF"
	DEFAULT_UI_COLOR_ACCENT  = "#003EAA"

	DEFAULT_CUSTOM_ASSETS_ANDROID_CHROME_192 = ""
	DEFAULT_CUSTOM_ASSETS_ANDROID_CHROME_512 = ""
	DEFAULT_CUSTOM_ASSETS_APPLE_TOUCH_ICON   = ""
	DEFAULT_CUSTOM_ASSETS_FAVICON_16         = ""
	DEFAULT_CUSTOM_ASSETS_FAVICON_32         = ""
	DEFAULT_CUSTOM_ASSETS_ICON               = ""
	DEFAULT_CUSTOM_ASSETS_SAFARI_PINNED_TAB  = ""
	DEFAULT_CUSTOM_ASSETS_FACEBOOK           = ""
	DEFAULT_CUSTOM_ASSETS_TWITTER            = ""
	DEFAULT_CUSTOM_ASSETS_WORDMARK           = ""

	DEFAULT_CUSTOM_FOOTER_TEXT = ""
	DEFAULT_CUSTOM_FOOTER_URL  = ""
	DEFAULT_FOOTER_DMCA_URL    = ""
	DEFAULT_FOOTER_CLI_URL     = "https://github.com/timvisee/ffsend"
	DEFAULT_FOOTER_SOURCE_URL  = "https://github.com/Simon-Martens/go-send"

	DEFAULT_CUSTOM_LOCALE = ""
)

var (
	DEFAULT_DOWNLOAD_COUNTS      = []int{1, 2, 3, 4, 5, 10, 20, 50, 100, 500, 1000}
	DEFAULT_EXPIRE_TIMES_SECONDS = []int{900, 3600 * 2, 3600 * 8, 3600 * 24, 24 * 3600 * 3, 24 * 3600 * 7, 24 * 3600 * 14, 24 * 3600 * 30}
)

const (
	EMBEDDED_TEMPLATES_PATH   = "views/templates/*.gohtml"
	EMBEDDED_TEMPLATES_PREFIX = "views/templates/"
	EMBEDDED_DIST_PATH        = "views/dist"
	USER_TEMPLATES_SUBDIR     = "templates"
	USER_DIST_SUBDIR          = "dist"
	TEMPLATE_FILE_EXTENSION   = ".gohtml"
)

const (
	DEFAULT_MANIFEST_JS  = "main.js"
	DEFAULT_MANIFEST_CSS = "main.css"
)

const (
	MAX_CONCURRENT_UPLOADS_PER_IP  = 3
	RATE_LIMIT_REQUESTS_PER_SECOND = 100.0
	RATE_LIMIT_BURST_SIZE          = 200
	MAX_REQUEST_BODY_SIZE          = 10 * 1024 * 1024 // 10 MB
	MAX_HEADER_BYTES               = 1 << 20          // 1 MB
	SERVER_READ_TIMEOUT            = 10 * time.Minute
	SERVER_WRITE_TIMEOUT           = 10 * time.Minute
	SERVER_IDLE_TIMEOUT            = 120 * time.Second
	SERVER_READ_HEADER_TIMEOUT     = 10 * time.Second
)

const (
	CLEANUP_CHECK_INTERVAL  = 1 * time.Hour
	CLEANUP_TICKER_INTERVAL = 1 * time.Hour
)
