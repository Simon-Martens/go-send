package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"strings"

	"github.com/Simon-Martens/go-send/config"
)

type TemplateData struct {
	Locale         string
	NonceAttr      template.HTMLAttr
	Theme          ThemeConfig
	Assets         AssetBundle
	ClientConfig   *config.ClientConfig
	IsDownloadPage bool
	// DownloadMetadata is only set on download pages
	DownloadMetadata json.RawMessage
}

type ThemeConfig struct {
	Primary string
	Accent  string
}

type AssetBundle struct {
	CSS             string
	JS              string
	UploadCSS       string
	UploadJS        string
	DownloadCSS     string
	DownloadJS      string
	AppleTouchIcon  string
	Favicon16       string
	Favicon32       string
	SafariPinnedTab string
}

func getTemplateData(manifest map[string]string, downloadMetadata string, cfg *config.Config, locale string, nonce string) TemplateData {
	assets := AssetBundle{
		CSS:             assetFromManifest(manifest, config.DEFAULT_MANIFEST_CSS, config.DEFAULT_MANIFEST_CSS),
		JS:              assetFromManifest(manifest, config.DEFAULT_MANIFEST_JS, config.DEFAULT_MANIFEST_JS),
		AppleTouchIcon:  chooseAsset(cfg.CustomAssetsAppleTouchIcon, "apple-touch-icon.png"),
		Favicon16:       chooseAsset(cfg.CustomAssetsFavicon16, "favicon-16x16.png"),
		Favicon32:       chooseAsset(cfg.CustomAssetsFavicon32, "favicon-32x32.png"),
		SafariPinnedTab: chooseAsset(cfg.CustomAssetsSafariPinnedTab, "safari-pinned-tab.svg"),
	}

	return TemplateData{
		Locale:    locale,
		NonceAttr: template.HTMLAttr(fmt.Sprintf("nonce=\"%s\"", nonce)),
		Theme: ThemeConfig{
			Primary: cfg.UIColorPrimary,
			Accent:  cfg.UIColorAccent,
		},
		Assets:           assets,
		ClientConfig:     cfg.GetClientConfig(),
		DownloadMetadata: normalizeRawJSON(downloadMetadata),
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
