package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/locale"
	"github.com/Simon-Martens/go-send/storage"
)

// generateNonce generates a random string for CSP nonces.
func generateNonce() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func NewIndexHandler(tmpl *template.Template, manifest map[string]string, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nonce, err := generateNonce()
		if err != nil {
			log.Printf("Failed to generate nonce: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, cfg)
		data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce)

		csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		tmpl.Execute(w, data)
	}
}

func NewDownloadPageHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/download/")
		log.Printf("Download page request - Path: %s, ID: %s", r.URL.Path, id)

		nonce, err := generateNonce()
		if err != nil {
			log.Printf("Failed to generate nonce: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		detectedLocale := detectLocale(r, cfg)

		// Try to get file metadata
		meta, err := db.GetFile(id)
		var downloadMetadata string

		if err != nil {
			// File not found - render 404 state
			log.Printf("File not found in DB: %s, error: %v", id, err)
			downloadMetadata = `{"status": 404}`
		} else {
			log.Printf("File found: %s, nonce: %s", id, meta.Nonce)
			// File found - provide nonce and password flag
			metaJSON, _ := json.Marshal(map[string]interface{}{
				"nonce": meta.Nonce,
				"pwd":   meta.Password,
			})
			downloadMetadata = string(metaJSON)
			log.Printf("Setting downloadMetadata: %s", downloadMetadata)
			// Set WWW-Authenticate header with nonce
			w.Header().Set("WWW-Authenticate", "send-v1 "+meta.Nonce)
		}

		data := getTemplateData(manifest, downloadMetadata, cfg, detectedLocale, nonce)
		log.Printf("Template data includes DownloadMetadataJSON: %v", data["DownloadMetadataJSON"])

		csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		if err := tmpl.Execute(w, data); err != nil {
			log.Printf("Template execution error: %v", err)
		}
	}
}

func detectLocale(r *http.Request, cfg *config.Config) string {
	// If custom locale is set, use it
	if cfg.CustomLocale != "" {
		return cfg.CustomLocale
	}

	// Otherwise negotiate from Accept-Language header
	acceptLanguage := r.Header.Get("Accept-Language")
	return locale.NegotiateLocale(acceptLanguage)
}

func getTemplateData(manifest map[string]string, downloadMetadata string, cfg *config.Config, detectedLocale string, nonce string) map[string]interface{} {
	// Build download counts array
	downloadCountsJSON := "["
	for i, count := range cfg.DownloadCounts {
		if i > 0 {
			downloadCountsJSON += ","
		}
		downloadCountsJSON += fmt.Sprintf("%d", count)
	}
	downloadCountsJSON += "]"

	// Build expire times array
	expireTimesJSON := "["
	for i, time := range cfg.ExpireTimesSeconds {
		if i > 0 {
			expireTimesJSON += ","
		}
		expireTimesJSON += fmt.Sprintf("%d", time)
	}
	expireTimesJSON += "]"

	limitsJSON := fmt.Sprintf(`{
		"MAX_FILE_SIZE": %d,
		"MAX_DOWNLOADS": %d,
		"MAX_EXPIRE_SECONDS": %d,
		"MAX_FILES_PER_ARCHIVE": %d,
		"MAX_ARCHIVES_PER_USER": 100
	}`, cfg.MaxFileSize, cfg.MaxDownloads, cfg.MaxExpireSeconds, cfg.MaxFilesPerArchive)

	webUIJSON := fmt.Sprintf(`{
		"FOOTER_DONATE_URL": "",
		"FOOTER_CLI_URL": %q,
		"FOOTER_DMCA_URL": %q,
		"FOOTER_SOURCE_URL": %q,
		"CUSTOM_FOOTER_TEXT": %q,
		"CUSTOM_FOOTER_URL": %q,
		"SHOW_THUNDERBIRD_SPONSOR": %t,
		"COLORS": {
			"PRIMARY": %q,
			"ACCENT": %q
		},
		"CUSTOM_ASSETS": {
			"android_chrome_192px": %q,
			"android_chrome_512px": %q,
			"apple_touch_icon": %q,
			"favicon_16px": %q,
			"favicon_32px": %q,
			"icon": %q,
			"safari_pinned_tab": %q,
			"facebook": %q,
			"twitter": %q,
			"wordmark": %q,
			"custom_css": %q
		}
	}`, cfg.FooterCLIURL, cfg.FooterDMCAURL, cfg.FooterSourceURL,
		cfg.CustomFooterText, cfg.CustomFooterURL, cfg.ShowThunderbirdSponsor,
		cfg.UIColorPrimary, cfg.UIColorAccent,
		cfg.CustomAssetsAndroidChrome192, cfg.CustomAssetsAndroidChrome512,
		cfg.CustomAssetsAppleTouchIcon, cfg.CustomAssetsFavicon16,
		cfg.CustomAssetsFavicon32, cfg.CustomAssetsIcon,
		cfg.CustomAssetsSafariPinnedTab, cfg.CustomAssetsFacebook,
		cfg.CustomAssetsTwitter, cfg.CustomAssetsWordmark, cfg.CustomCSS)

	defaultsJSON := fmt.Sprintf(`{
		"DOWNLOADS": %d,
		"DOWNLOAD_COUNTS": %s,
		"EXPIRE_TIMES_SECONDS": %s,
		"EXPIRE_SECONDS": %d
	}`, cfg.DefaultDownloads, downloadCountsJSON, expireTimesJSON, cfg.DefaultExpireSeconds)

	return map[string]interface{}{
		"CSS":                   manifest["app.css"],
		"JS":                    manifest["app.js"],
		"AppleTouchIcon":        manifest["apple-touch-icon.png"],
		"Favicon16":             manifest["favicon-16x16.png"],
		"Favicon32":             manifest["favicon-32x32.png"],
		"SafariPinnedTab":       manifest["safari-pinned-tab.svg"],
		"ColorPrimary":          cfg.UIColorPrimary,
		"ColorAccent":           cfg.UIColorAccent,
		"CustomCSS":             cfg.CustomCSS,
		"Locale":                detectedLocale,
		"Nonce":                 template.HTMLAttr("nonce=\"" + nonce + "\""),
		"LimitsJSON":            template.JS(limitsJSON),
		"WebUIJSON":             template.JS(webUIJSON),
		"DefaultsJSON":          template.JS(defaultsJSON),
		"DownloadMetadataJSON":  template.JS(downloadMetadata),
	}
}
