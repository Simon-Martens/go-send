package core

import (
	"embed"
	"encoding/json"
	"log/slog"

	"github.com/Simon-Martens/go-send/config"
)

type Manifest map[string]string

func (m Manifest) Value(key string) string {
	return m[key]
}

// LoadManifest loads the webpack manifest.json from embedded filesystem
func LoadManifest(distFS embed.FS, logger *slog.Logger) Manifest {
	manifestData, err := distFS.ReadFile("views/dist/manifest.json")
	if err != nil {
		logger.Warn("manifest.json not found, using defaults")
		return map[string]string{
			config.DEFAULT_MANIFEST_JS:  config.DEFAULT_MANIFEST_JS,
			config.DEFAULT_MANIFEST_CSS: config.DEFAULT_MANIFEST_CSS,
		}
	}

	var manifest map[string]string
	if err := json.Unmarshal(manifestData, &manifest); err != nil {
		logger.Warn("Failed to parse manifest.json, using defaults", "error", err)
		return map[string]string{
			config.DEFAULT_MANIFEST_JS:  config.DEFAULT_MANIFEST_JS,
			config.DEFAULT_MANIFEST_CSS: config.DEFAULT_MANIFEST_CSS,
		}
	}

	logger.Debug("Loaded manifest.json", "entries", len(manifest))
	return manifest
}
