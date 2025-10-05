package i18n

import (
    "embed"
    "encoding/json"
    "fmt"

    goi18n "github.com/nicksnyder/go-i18n/v2/i18n"
    "golang.org/x/text/language"
)

//go:embed locales/*.json
var localeFS embed.FS

// Translator loads ICU message catalogs and provides localization helpers.
type Translator struct {
    bundle *goi18n.Bundle
}

// New creates a translator with embedded locale catalogs.
func New() (*Translator, error) {
    bundle := goi18n.NewBundle(language.English)
    bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

    entries, err := localeFS.ReadDir("locales")
    if err != nil {
        return nil, fmt.Errorf("read locales: %w", err)
    }

    for _, entry := range entries {
        if entry.IsDir() {
            continue
        }

        name := entry.Name()
        data, err := localeFS.ReadFile("locales/" + name)
        if err != nil {
            return nil, fmt.Errorf("load locale %s: %w", name, err)
        }

        if _, err := bundle.ParseMessageFileBytes(data, name); err != nil {
            return nil, fmt.Errorf("parse locale %s: %w", name, err)
        }
    }

    return &Translator{bundle: bundle}, nil
}

// Func returns a function suitable for templates, localizing strings for the given locale.
func (t *Translator) Func(locale string) func(string, map[string]interface{}) string {
    return func(id string, data map[string]interface{}) string {
        return t.Localize(locale, id, data)
    }
}

// Localize resolves a message for the provided locale.
func (t *Translator) Localize(locale, id string, data map[string]interface{}) string {
    if t == nil {
        return id
    }

    localizer := goi18n.NewLocalizer(t.bundle, locale, language.English.String())
    message, err := localizer.Localize(&goi18n.LocalizeConfig{MessageID: id, TemplateData: data})
    if err != nil {
        return id
    }
    return message
}
