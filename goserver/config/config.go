package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	// Server
	Port           string
	BaseURL        string
	DetectBaseURL  bool
	FileDir        string

	// Upload/Download Limits
	MaxFileSize        int64
	MaxFilesPerArchive int
	MaxExpireSeconds   int
	MaxDownloads       int
	DownloadCounts     []int
	ExpireTimesSeconds []int
	DefaultDownloads   int
	DefaultExpireSeconds int

	// Branding - Colors
	UIColorPrimary string
	UIColorAccent  string

	// Branding - Custom Assets
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
	CustomCSS                    string

	// Footer
	CustomFooterText string
	CustomFooterURL  string
	FooterDMCAURL    string
	FooterCLIURL     string
	FooterSourceURL  string
	ShowThunderbirdSponsor bool

	// Localization
	CustomLocale string
}

func Load() *Config {
	return &Config{
		// Server
		Port:          getEnv("PORT", "8080"),
		BaseURL:       getEnv("BASE_URL", ""),
		DetectBaseURL: getEnvBool("DETECT_BASE_URL", false),
		FileDir:       getEnv("FILE_DIR", "./uploads"),

		// Upload/Download Limits
		MaxFileSize:        getEnvInt64("MAX_FILE_SIZE", 2684354560), // 2.5GB
		MaxFilesPerArchive: getEnvInt("MAX_FILES_PER_ARCHIVE", 64),
		MaxExpireSeconds:   getEnvInt("MAX_EXPIRE_SECONDS", 604800), // 7 days
		MaxDownloads:       getEnvInt("MAX_DOWNLOADS", 100),
		DownloadCounts:     getEnvIntArray("DOWNLOAD_COUNTS", []int{1, 2, 3, 4, 5, 20, 50, 100}),
		ExpireTimesSeconds: getEnvIntArray("EXPIRE_TIMES_SECONDS", []int{300, 3600, 86400, 604800}),
		DefaultDownloads:   getEnvInt("DEFAULT_DOWNLOADS", 1),
		DefaultExpireSeconds: getEnvInt("DEFAULT_EXPIRE_SECONDS", 86400),

		// Branding - Colors
		UIColorPrimary: getEnv("UI_COLOR_PRIMARY", "#0A84FF"),
		UIColorAccent:  getEnv("UI_COLOR_ACCENT", "#003EAA"),

		// Branding - Custom Assets
		CustomAssetsAndroidChrome192: getEnv("UI_CUSTOM_ASSETS_ANDROID_CHROME_192PX", ""),
		CustomAssetsAndroidChrome512: getEnv("UI_CUSTOM_ASSETS_ANDROID_CHROME_512PX", ""),
		CustomAssetsAppleTouchIcon:   getEnv("UI_CUSTOM_ASSETS_APPLE_TOUCH_ICON", ""),
		CustomAssetsFavicon16:        getEnv("UI_CUSTOM_ASSETS_FAVICON_16PX", ""),
		CustomAssetsFavicon32:        getEnv("UI_CUSTOM_ASSETS_FAVICON_32PX", ""),
		CustomAssetsIcon:             getEnv("UI_CUSTOM_ASSETS_ICON", ""),
		CustomAssetsSafariPinnedTab:  getEnv("UI_CUSTOM_ASSETS_SAFARI_PINNED_TAB", ""),
		CustomAssetsFacebook:         getEnv("UI_CUSTOM_ASSETS_FACEBOOK", ""),
		CustomAssetsTwitter:          getEnv("UI_CUSTOM_ASSETS_TWITTER", ""),
		CustomAssetsWordmark:         getEnv("UI_CUSTOM_ASSETS_WORDMARK", ""),
		CustomCSS:                    getEnv("UI_CUSTOM_CSS", ""),

		// Footer
		CustomFooterText:       getEnv("CUSTOM_FOOTER_TEXT", ""),
		CustomFooterURL:        getEnv("CUSTOM_FOOTER_URL", ""),
		FooterDMCAURL:          getEnv("SEND_FOOTER_DMCA_URL", ""),
		FooterCLIURL:           getEnv("FOOTER_CLI_URL", "https://github.com/timvisee/ffsend"),
		FooterSourceURL:        getEnv("FOOTER_SOURCE_URL", "https://github.com/timvisee/send"),
		ShowThunderbirdSponsor: getEnvBool("SHOW_THUNDERBIRD_SPONSOR", false),

		// Localization
		CustomLocale: getEnv("CUSTOM_LOCALE", ""),
	}
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
