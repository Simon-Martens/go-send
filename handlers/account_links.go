package handlers

import (
	"database/sql"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/auth"
	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/i18n"
	"github.com/Simon-Martens/go-send/storage"
)

func NewAccountLinksHandler(tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := auth.GetSessionFromRequest(db, r)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		if session.UserType != "admin" || !session.AdminID.Valid {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		detectedLocale := detectLocale(r, cfg)
		var translate func(string, map[string]interface{}) string
		if translator != nil {
			translate = translator.Func(detectedLocale)
		}

		baseForm := AccountLinkFormState{}

		render := func(flash *FlashMessage, form AccountLinkFormState) {
			renderAccountLinksTemplate(w, r, tmpl, manifest, db, cfg, translator, logger, session, translate, flash, form)
		}

		switch r.Method {
		case http.MethodGet:
			render(nil, baseForm)
			return
		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				logger.Warn("Failed to parse auth link form", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, baseForm)
				return
			}

			action := strings.TrimSpace(r.FormValue("action"))
			if action == "delete" {
				linkIDStr := strings.TrimSpace(r.FormValue("linkID"))
				linkID, err := strconv.ParseInt(linkIDStr, 10, 64)
				if err != nil {
					render(&FlashMessage{Message: translateMessage(translate, "account.links.delete_error"), Kind: "error"}, baseForm)
					return
				}

				if err := db.DeleteAuthLinkByID(linkID); err != nil {
					logger.Error("Failed to delete auth link", "error", err, "link_id", linkID)
					render(&FlashMessage{Message: translateMessage(translate, "account.links.delete_error"), Kind: "error"}, baseForm)
					return
				}

				render(&FlashMessage{Message: translateMessage(translate, "account.links.delete_success"), Kind: "success"}, baseForm)
				return
			}

			username := strings.TrimSpace(r.FormValue("username"))
			expiresInput := strings.TrimSpace(r.FormValue("expiresHours"))

			form := AccountLinkFormState{
				Username:       username,
				ExpiresInHours: expiresInput,
			}

			var expiresAt sql.NullInt64
			if expiresInput != "" {
				hours, err := strconv.Atoi(expiresInput)
				if err != nil || hours < 1 || hours > 24*30 {
					render(&FlashMessage{Message: translateMessage(translate, "account.links.error_invalid_hours"), Kind: "error"}, form)
					return
				}
				expiresAt = sql.NullInt64{Int64: time.Now().Add(time.Duration(hours) * time.Hour).Unix(), Valid: true}
			}

			token, err := auth.GenerateToken(24)
			if err != nil {
				logger.Error("Failed to generate auth link token", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, form)
				return
			}

			link := &storage.AuthLink{
				TokenHash: auth.HashToken(token),
				ExpiresAt: expiresAt,
				CreatedAt: time.Now().Unix(),
				CreatedBy: sql.NullInt64{
					Int64: session.AdminID.Int64,
					Valid: true,
				},
			}
			if username != "" {
				link.Username = sql.NullString{String: username, Valid: true}
			}

			if _, err := db.CreateAuthLink(link); err != nil {
				logger.Error("Failed to persist auth link", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, form)
				return
			}

			generatedURL := buildAuthLinkURL(cfg, r, token)
			form.GeneratedLink = generatedURL

			render(&FlashMessage{Message: translateMessage(translate, "account.links.success"), Kind: "success"}, form)
			return
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func renderAccountLinksTemplate(w http.ResponseWriter, r *http.Request, tmpl *template.Template, manifest map[string]string, db *storage.DB, cfg *config.Config, translator *i18n.Translator, logger *slog.Logger, session *storage.Session, translate func(string, map[string]interface{}) string, flash *FlashMessage, form AccountLinkFormState) {
	nonce, err := generateNonce()
	if err != nil {
		logger.Error("Failed to generate nonce", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	detectedLocale := detectLocale(r, cfg)
	if translate == nil && translator != nil {
		translate = translator.Func(detectedLocale)
	}

	data := getTemplateData(manifest, "{}", cfg, detectedLocale, nonce, translate)
	data.Auth = authInfoFromSession(db, session, logger)
	data.Flash = flash
	data.AccountLinks.Form = form

	links, err := db.ListAuthLinks(100)
	if err != nil {
		logger.Error("Failed to list auth links", "error", err)
	}

	views := make([]AccountLinkView, 0, len(links))
	now := time.Now()
	for _, link := range links {
		username := strings.TrimSpace(link.Username.String)
		if username == "" {
			username = "\u2014"
		}
		created := time.Unix(link.CreatedAt, 0).Format(time.RFC3339)

		var expires string
		if !link.ExpiresAt.Valid || link.ExpiresAt.Int64 == 0 {
			expires = translateMessage(translate, "account.links.never")
		} else {
			expTime := time.Unix(link.ExpiresAt.Int64, 0)
			if expTime.Before(now) {
				expires = fmt.Sprintf("%s %s", translateMessage(translate, "account.links.expired"), expTime.Format(time.RFC3339))
			} else {
				expires = expTime.Format(time.RFC3339)
			}
		}

		views = append(views, AccountLinkView{
			ID:       link.ID,
			Username: username,
			Created:  created,
			Expires:  expires,
		})
	}

	data.AccountLinks.Links = views

	csp := fmt.Sprintf("script-src 'self' 'nonce-%s'; style-src 'self' 'nonce-%s'", nonce, nonce)
	w.Header().Set("Content-Security-Policy", csp)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	if err := tmpl.ExecuteTemplate(w, "account_links.gohtml", data); err != nil {
		logger.Error("Failed to execute account links template", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
