package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"strings"

	"github.com/Simon-Martens/go-send/config"
)

type TemplateData struct {
	Locale    string
	NonceAttr template.HTMLAttr
	Theme     ThemeConfig
	Assets    AssetBundle
	Footer    FooterLinks
	State     TemplateState
	Auth      AuthInfo
	Flash     *FlashMessage
	Admins    []LoginAdmin
	LoginForm LoginFormState
	Translate func(string, ...interface{}) string
}

type ThemeConfig struct {
	Primary string
	Accent  string
}

type AssetBundle struct {
	CSS             string
	JS              string
	AppleTouchIcon  string
	Favicon16       string
	Favicon32       string
	SafariPinnedTab string
}

type FooterLinks struct {
	CustomText string
	CustomURL  string
	CLIURL     string
	DMCAURL    string
	SourceURL  string
}

type TemplateState struct {
	Limits           LimitsPayload
	WebUI            WebUIPayload
	Defaults         DefaultsPayload
	DownloadMetadata json.RawMessage
}

type LimitsPayload struct {
	MaxFileSize        int64 `json:"MAX_FILE_SIZE"`
	MaxDownloads       int   `json:"MAX_DOWNLOADS"`
	MaxExpireSeconds   int   `json:"MAX_EXPIRE_SECONDS"`
	MaxFilesPerArchive int   `json:"MAX_FILES_PER_ARCHIVE"`
	MaxArchivesPerUser int   `json:"MAX_ARCHIVES_PER_USER"`
}

type WebUIPayload struct {
	Colors       WebUIColorPayload   `json:"COLORS"`
	CustomAssets CustomAssetsPayload `json:"CUSTOM_ASSETS"`
}

type WebUIColorPayload struct {
	Primary string `json:"PRIMARY"`
	Accent  string `json:"ACCENT"`
}

type CustomAssetsPayload struct {
	AndroidChrome192 string `json:"android_chrome_192px"`
	AndroidChrome512 string `json:"android_chrome_512px"`
	AppleTouchIcon   string `json:"apple_touch_icon"`
	Favicon16        string `json:"favicon_16px"`
	Favicon32        string `json:"favicon_32px"`
	Icon             string `json:"icon"`
	SafariPinnedTab  string `json:"safari_pinned_tab"`
	Facebook         string `json:"facebook"`
	Twitter          string `json:"twitter"`
}

type DefaultsPayload struct {
	Downloads          int   `json:"DOWNLOADS"`
	DownloadCounts     []int `json:"DOWNLOAD_COUNTS"`
	ExpireTimesSeconds []int `json:"EXPIRE_TIMES_SECONDS"`
	ExpireSeconds      int   `json:"EXPIRE_SECONDS"`
}

type AuthInfo struct {
	Authenticated bool
	UserType      string
	DisplayName   string
	ExpiresAt     int64
	ExpiresAtISO  string
}

type FlashMessage struct {
	Message string
	Kind    string
}

type LoginAdmin struct {
	ID       int64
	Username string
}

type LoginFormState struct {
	Username string
}

func getTemplateData(manifest map[string]string, downloadMetadata string, cfg *config.Config, detectedLocale string, nonce string, translate func(string, map[string]interface{}) string) TemplateData {
	assets := AssetBundle{
		CSS:             assetFromManifest(manifest, "app.css", "app.css"),
		JS:              assetFromManifest(manifest, "app.js", "app.js"),
		AppleTouchIcon:  chooseAsset(cfg.CustomAssetsAppleTouchIcon, "apple-touch-icon.png"),
		Favicon16:       chooseAsset(cfg.CustomAssetsFavicon16, "favicon-16x16.png"),
		Favicon32:       chooseAsset(cfg.CustomAssetsFavicon32, "favicon-32x32.png"),
		SafariPinnedTab: chooseAsset(cfg.CustomAssetsSafariPinnedTab, "safari-pinned-tab.svg"),
	}

	state := TemplateState{
		Limits: LimitsPayload{
			MaxFileSize:        cfg.MaxFileSize,
			MaxDownloads:       cfg.MaxDownloads,
			MaxExpireSeconds:   cfg.MaxExpireSeconds,
			MaxFilesPerArchive: cfg.MaxFilesPerArchive,
			MaxArchivesPerUser: 100,
		},
		WebUI: WebUIPayload{
			Colors: WebUIColorPayload{
				Primary: cfg.UIColorPrimary,
				Accent:  cfg.UIColorAccent,
			},
			CustomAssets: CustomAssetsPayload{
				AndroidChrome192: cfg.CustomAssetsAndroidChrome192,
				AndroidChrome512: cfg.CustomAssetsAndroidChrome512,
				AppleTouchIcon:   cfg.CustomAssetsAppleTouchIcon,
				Favicon16:        cfg.CustomAssetsFavicon16,
				Favicon32:        cfg.CustomAssetsFavicon32,
				Icon:             cfg.CustomAssetsIcon,
				SafariPinnedTab:  cfg.CustomAssetsSafariPinnedTab,
				Facebook:         cfg.CustomAssetsFacebook,
				Twitter:          cfg.CustomAssetsTwitter,
			},
		},
		Defaults: DefaultsPayload{
			Downloads:          cfg.DefaultDownloads,
			DownloadCounts:     cfg.DownloadCounts,
			ExpireTimesSeconds: cfg.ExpireTimesSeconds,
			ExpireSeconds:      cfg.DefaultExpireSeconds,
		},
		DownloadMetadata: normalizeRawJSON(downloadMetadata),
	}

	return TemplateData{
		Locale:    detectedLocale,
		NonceAttr: template.HTMLAttr(fmt.Sprintf("nonce=\"%s\"", nonce)),
		Theme: ThemeConfig{
			Primary: cfg.UIColorPrimary,
			Accent:  cfg.UIColorAccent,
		},
		Assets: assets,
		Footer: FooterLinks{
			CustomText: cfg.CustomFooterText,
			CustomURL:  cfg.CustomFooterURL,
			CLIURL:     cfg.FooterCLIURL,
			DMCAURL:    cfg.FooterDMCAURL,
			SourceURL:  cfg.FooterSourceURL,
		},
		State: state,
		Translate: func(id string, args ...interface{}) string {
			var data map[string]interface{}
			if len(args) > 0 {
				if m, ok := args[0].(map[string]interface{}); ok {
					data = m
				}
			}
			if translate == nil {
				return id
			}
			return translate(id, data)
		},
	}
}

func assetFromManifest(manifest map[string]string, key, fallback string) string {
	if value := manifest[key]; value != "" {
		return value
	}
	return fallback
}

func chooseAsset(custom, fallback string) string {
	if strings.TrimSpace(custom) != "" {
		return custom
	}
	return fallback
}

func normalizeRawJSON(value string) json.RawMessage {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return json.RawMessage("null")
	}
	return json.RawMessage(trimmed)
}
