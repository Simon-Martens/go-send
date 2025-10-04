package core

import (
	"embed"
	"encoding/json"
	"log/slog"

	"github.com/Simon-Martens/go-send/config"
)

// LoadManifest loads the webpack manifest.json from embedded filesystem
func LoadManifest(distFS embed.FS, logger *slog.Logger) map[string]string {
	manifestData, err := distFS.ReadFile("frontend/dist/manifest.json")
	if err != nil {
		logger.Warn("manifest.json not found, using defaults")
		return map[string]string{
			"app.js":  config.DEFAULT_MANIFEST_JS,
			"app.css": config.DEFAULT_MANIFEST_CSS,
		}
	}

	var manifest map[string]string
	if err := json.Unmarshal(manifestData, &manifest); err != nil {
		logger.Warn("Failed to parse manifest.json, using defaults", "error", err)
		return map[string]string{
			"app.js":  config.DEFAULT_MANIFEST_JS,
			"app.css": config.DEFAULT_MANIFEST_CSS,
		}
	}

	logger.Debug("Loaded manifest.json", "entries", len(manifest))
	return manifest
}
