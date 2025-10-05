package core

import (
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"log/slog"
	"os"
	"path/filepath"
	"strings"

	"github.com/Simon-Martens/go-send/config"
)

func templateFuncMap(logger *slog.Logger) template.FuncMap {
	return template.FuncMap{
		"toJSON": func(v interface{}) template.JS {
			data, err := json.Marshal(v)
			if err != nil {
				if logger != nil {
					logger.Error("Failed to marshal template data", "error", err)
				}
				return template.JS("null")
			}
			return template.JS(string(data))
		},
		"rawJSON": func(v interface{}) template.JS {
			switch value := v.(type) {
			case json.RawMessage:
				if len(value) == 0 {
					return template.JS("null")
				}
				return template.JS(string(value))
			case []byte:
				if len(value) == 0 {
					return template.JS("null")
				}
				return template.JS(string(value))
			case string:
				if strings.TrimSpace(value) == "" {
					return template.JS("null")
				}
				return template.JS(value)
			default:
				data, err := json.Marshal(value)
				if err != nil {
					if logger != nil {
						logger.Error("Failed to marshal template data", "error", err)
					}
					return template.JS("null")
				}
				return template.JS(string(data))
			}
		},
		"assetURL": assetURL,
		"dict": func(values ...interface{}) map[string]interface{} {
			if len(values)%2 != 0 {
				if logger != nil {
					logger.Warn("dict called with odd number of arguments", "count", len(values))
				}
				return map[string]interface{}{}
			}
			m := make(map[string]interface{}, len(values)/2)
			for i := 0; i < len(values); i += 2 {
				key, ok := values[i].(string)
				if !ok {
					if logger != nil {
						logger.Warn("dict key is not a string", "index", i, "type", fmt.Sprintf("%T", values[i]))
					}
					return map[string]interface{}{}
				}
				m[key] = values[i+1]
			}
			return m
		},
	}
}

func assetURL(path string) string {
	trimmed := strings.TrimSpace(path)
	if trimmed == "" {
		return ""
	}
	lowered := strings.ToLower(trimmed)
	if strings.HasPrefix(lowered, "http://") || strings.HasPrefix(lowered, "https://") || strings.HasPrefix(lowered, "data:") {
		return trimmed
	}
	if strings.HasPrefix(trimmed, "/") {
		return trimmed
	}
	return "/" + trimmed
}

// LoadTemplates loads templates from user directory first, falling back to embedded templates
func LoadTemplates(templatesFS embed.FS, userFrontendDir string, logger *slog.Logger) (*template.Template, error) {
	logger.Info("Loading embedded templates", "pattern", config.EMBEDDED_TEMPLATES_PATH)

	tmpl := template.New("send").Funcs(templateFuncMap(logger))
	tmpl, err := tmpl.ParseFS(templatesFS, config.EMBEDDED_TEMPLATES_PATH)
	if err != nil {
		logger.Error("Failed to parse embedded templates", "error", err)
		return nil, err
	}

	// Log loaded templates for debugging
	logger.Debug("Embedded templates loaded", "count", len(tmpl.Templates()))
	for _, t := range tmpl.Templates() {
		logger.Debug("Template loaded", "name", t.Name())
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
