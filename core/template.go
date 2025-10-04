package core

import (
	"embed"
	"html/template"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/Simon-Martens/go-send/config"
)

// LoadTemplates loads templates from user directory first, falling back to embedded templates
func LoadTemplates(templatesFS embed.FS, userFrontendDir string, logger *slog.Logger) (*template.Template, error) {
	logger.Info("Loading embedded templates")

	tmpl, err := template.ParseFS(templatesFS, config.EMBEDDED_TEMPLATES_PATH)
	if err != nil {
		return nil, err
	}

	userTemplatesDir := filepath.Join(userFrontendDir, config.USER_TEMPLATES_SUBDIR)

	info, err := os.Stat(userTemplatesDir)
	if err != nil {
		if !os.IsNotExist(err) {
			logger.Warn("Failed to stat user templates directory", "directory", userTemplatesDir, "error", err)
		}
		return tmpl, nil
	}

	if !info.IsDir() {
		logger.Warn("User templates path exists but is not a directory; skipping", "path", userTemplatesDir)
		return tmpl, nil
	}

	logger.Info("Loading user template overrides", "directory", userTemplatesDir)

	entries, err := os.ReadDir(userTemplatesDir)
	if err != nil {
		logger.Warn("Failed to read user templates directory", "directory", userTemplatesDir, "error", err)
		return tmpl, nil
	}

	overrides := 0
	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != config.TEMPLATE_FILE_EXTENSION {
			continue
		}

		path := filepath.Join(userTemplatesDir, entry.Name())
		contents, err := os.ReadFile(path)
		if err != nil {
			logger.Warn("Failed to read user template", "path", path, "error", err)
			continue
		}

		templateName := entry.Name()
		if tmpl.Lookup(templateName) == nil {
			embeddedName := config.EMBEDDED_TEMPLATES_PREFIX + templateName
			if tmpl.Lookup(embeddedName) != nil {
				templateName = embeddedName
			}
		}

		if _, err := tmpl.New(templateName).Parse(string(contents)); err != nil {
			logger.Warn("Failed to parse user template", "path", path, "error", err)
			continue
		}

		overrides++
	}

	if overrides > 0 {
		logger.Info("Applied user template overrides", "count", overrides)
	} else {
		logger.Debug("No user template overrides found", "directory", userTemplatesDir)
	}

	return tmpl, nil
}
