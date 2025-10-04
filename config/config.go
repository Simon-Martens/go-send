package config

import (
	"log/slog"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port            string
	BaseURL         string
	DetectBaseURL   bool
	FileDir         string
	UserFrontendDir string
	Environment     string // "development" or "production"

	MaxFileSize          int64
	MaxFilesPerArchive   int
	MaxExpireSeconds     int
	MaxDownloads         int
	DownloadCounts       []int
	ExpireTimesSeconds   []int
	DefaultDownloads     int
	DefaultExpireSeconds int

	UIColorPrimary               string
	UIColorAccent                string
	CustomAssetsAndroidChrome192 string
	CustomAssetsAndroidChrome512 string
	CustomAssetsAppleTouchIcon   string
	CustomAssetsFavicon16        string
	CustomAssetsFavicon32        string
	CustomAssetsIcon             string
	CustomAssetsSafariPinnedTab  string
	CustomAssetsFacebook         string
	CustomAssetsTwitter          string
	CustomAssetsWordmark         string

	CustomFooterText string
	CustomFooterURL  string
	FooterDMCAURL    string
	FooterCLIURL     string
	FooterSourceURL  string

	CustomLocale string
}

func Load() *Config {
	cfg := &Config{
		// Server
		Port:            getEnv("PORT", DEFAULT_PORT),
		BaseURL:         getEnv("BASE_URL", DEFAULT_BASE_URL),
		DetectBaseURL:   getEnvBool("DETECT_BASE_URL", DEFAULT_DETECT_BASE_URL),
		FileDir:         getEnv("FILE_DIR", DEFAULT_FILE_DIR),
		UserFrontendDir: getEnv("USER_FRONTEND_DIR", DEFAULT_USER_FRONTEND_DIR),
		Environment:     getEnv("SEND_ENV", DEFAULT_ENVIRONMENT),

		// Upload/Download Limits
		MaxFileSize:          getEnvInt64("MAX_FILE_SIZE", DEFAULT_MAX_FILE_SIZE), // 2.5GB
		MaxFilesPerArchive:   getEnvInt("MAX_FILES_PER_ARCHIVE", DEFAULT_MAX_FILES_PER_ARCHIVE),
		MaxExpireSeconds:     getEnvInt("MAX_EXPIRE_SECONDS", DEFAULT_MAX_EXPIRE_SECONDS), // 7 days
		MaxDownloads:         getEnvInt("MAX_DOWNLOADS", DEFAULT_MAX_DOWNLOADS),
		DownloadCounts:       getEnvIntArray("DOWNLOAD_COUNTS", DEFAULT_DOWNLOAD_COUNTS),
		ExpireTimesSeconds:   getEnvIntArray("EXPIRE_TIMES_SECONDS", DEFAULT_EXPIRE_TIMES_SECONDS),
		DefaultDownloads:     getEnvInt("DEFAULT_DOWNLOADS", DEFAULT_DEFAULT_DOWNLOADS),
		DefaultExpireSeconds: getEnvInt("DEFAULT_EXPIRE_SECONDS", DEFAULT_DEFAULT_EXPIRE_SECONDS),

		// Branding - Colors
		UIColorPrimary: getEnv("UI_COLOR_PRIMARY", DEFAULT_UI_COLOR_PRIMARY),
		UIColorAccent:  getEnv("UI_COLOR_ACCENT", DEFAULT_UI_COLOR_ACCENT),

		// Branding - Custom Assets
		CustomAssetsAndroidChrome192: getEnv("UI_CUSTOM_ASSETS_ANDROID_CHROME_192PX", DEFAULT_CUSTOM_ASSETS_ANDROID_CHROME_192),
		CustomAssetsAndroidChrome512: getEnv("UI_CUSTOM_ASSETS_ANDROID_CHROME_512PX", DEFAULT_CUSTOM_ASSETS_ANDROID_CHROME_512),
		CustomAssetsAppleTouchIcon:   getEnv("UI_CUSTOM_ASSETS_APPLE_TOUCH_ICON", DEFAULT_CUSTOM_ASSETS_APPLE_TOUCH_ICON),
		CustomAssetsFavicon16:        getEnv("UI_CUSTOM_ASSETS_FAVICON_16PX", DEFAULT_CUSTOM_ASSETS_FAVICON_16),
		CustomAssetsFavicon32:        getEnv("UI_CUSTOM_ASSETS_FAVICON_32PX", DEFAULT_CUSTOM_ASSETS_FAVICON_32),
		CustomAssetsIcon:             getEnv("UI_CUSTOM_ASSETS_ICON", DEFAULT_CUSTOM_ASSETS_ICON),
		CustomAssetsSafariPinnedTab:  getEnv("UI_CUSTOM_ASSETS_SAFARI_PINNED_TAB", DEFAULT_CUSTOM_ASSETS_SAFARI_PINNED_TAB),
		CustomAssetsFacebook:         getEnv("UI_CUSTOM_ASSETS_FACEBOOK", DEFAULT_CUSTOM_ASSETS_FACEBOOK),
		CustomAssetsTwitter:          getEnv("UI_CUSTOM_ASSETS_TWITTER", DEFAULT_CUSTOM_ASSETS_TWITTER),
		CustomAssetsWordmark:         getEnv("UI_CUSTOM_ASSETS_WORDMARK", DEFAULT_CUSTOM_ASSETS_WORDMARK),

		// Footer
		CustomFooterText: getEnv("CUSTOM_FOOTER_TEXT", DEFAULT_CUSTOM_FOOTER_TEXT),
		CustomFooterURL:  getEnv("CUSTOM_FOOTER_URL", DEFAULT_CUSTOM_FOOTER_URL),
		FooterDMCAURL:    getEnv("SEND_FOOTER_DMCA_URL", DEFAULT_FOOTER_DMCA_URL),
		FooterCLIURL:     getEnv("FOOTER_CLI_URL", DEFAULT_FOOTER_CLI_URL),
		FooterSourceURL:  getEnv("FOOTER_SOURCE_URL", DEFAULT_FOOTER_SOURCE_URL),

		// Localization
		CustomLocale: getEnv("CUSTOM_LOCALE", DEFAULT_CUSTOM_LOCALE),
	}

	slog.Info("Initialized configuration", "config", cfg)
	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return defaultValue
}

func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.ParseInt(value, 10, 64); err == nil {
			return i
		}
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if b, err := strconv.ParseBool(value); err == nil {
			return b
		}
	}
	return defaultValue
}

func getEnvIntArray(key string, defaultValue []int) []int {
	if value := os.Getenv(key); value != "" {
		parts := strings.Split(value, ",")
		result := make([]int, 0, len(parts))
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if i, err := strconv.Atoi(p); err == nil {
				result = append(result, i)
			}
		}
		if len(result) > 0 {
			return result
		}
	}
	return defaultValue
}
