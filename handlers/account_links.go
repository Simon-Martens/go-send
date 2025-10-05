package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"log/slog"
	"math"
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

		if !cfg.AllowAccessLinks {
			http.NotFound(w, r)
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
			form := baseForm
			var flashMessage *FlashMessage
			if payload := popAccountLinksFlash(w, r); payload != nil {
				if payload.GeneratedLink != "" {
					form.GeneratedLink = payload.GeneratedLink
				}
				if payload.Message != "" {
					kind := payload.Kind
					if kind == "" {
						kind = "info"
					}
					flashMessage = &FlashMessage{Message: payload.Message, Kind: kind}
				}
			}
			render(flashMessage, form)
			return
		case http.MethodPost:
			if err := r.ParseForm(); err != nil {
				logger.Warn("Failed to parse auth link form", "error", err)
				render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, baseForm)
				return
			}

			action := strings.TrimSpace(r.FormValue("action"))
			switch action {
			case "activate":
				linkIDStr := strings.TrimSpace(r.FormValue("linkID"))
				linkID, err := strconv.ParseInt(linkIDStr, 10, 64)
				if err != nil {
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusBadRequest)
						json.NewEncoder(w).Encode(map[string]string{"error": "Invalid link ID"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.update_error"), Kind: "error"}, baseForm)
					return
				}

				// Label is required
				label := strings.TrimSpace(r.FormValue("label"))
				if label == "" {
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusBadRequest)
						json.NewEncoder(w).Encode(map[string]string{"error": "Label is required"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.error_label_required"), Kind: "error"}, baseForm)
					return
				}

				// Activate the link
				if err := db.ActivateAuthLink(linkID); err != nil {
					logger.Error("Failed to activate auth link", "error", err, "link_id", linkID)
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusInternalServerError)
						json.NewEncoder(w).Encode(map[string]string{"error": "Failed to activate"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.update_error"), Kind: "error"}, baseForm)
					return
				}

				// Save label
				labelValue := sql.NullString{String: label, Valid: true}
				if err := db.UpdateAuthLinkSettings(linkID, labelValue, sql.NullInt64{}); err != nil {
					logger.Warn("Failed to update label after activation", "error", err, "link_id", linkID)
				}

				if isAjaxRequest(r) {
					w.Header().Set("Content-Type", "application/json")
					json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
					return
				}

				setAccountLinksFlash(w, r, accountLinksFlashPayload{
					Message: translateMessage(translate, "account.links.update_success"),
					Kind:    "success",
				})
				http.Redirect(w, r, "/account/links", http.StatusSeeOther)
				return
			case "delete":
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

				setAccountLinksFlash(w, r, accountLinksFlashPayload{
					Message: translateMessage(translate, "account.links.delete_success"),
					Kind:    "success",
				})
				http.Redirect(w, r, "/account/links", http.StatusSeeOther)
				return
			case "update":
				linkIDStr := strings.TrimSpace(r.FormValue("linkID"))
				linkID, err := strconv.ParseInt(linkIDStr, 10, 64)
				if err != nil {
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusBadRequest)
						json.NewEncoder(w).Encode(map[string]string{"error": "Invalid link ID"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.update_error"), Kind: "error"}, baseForm)
					return
				}

				label := strings.TrimSpace(r.FormValue("label"))
				expiresInput := strings.TrimSpace(r.FormValue("expiresHours"))

				var expiresAt sql.NullInt64
				if expiresInput != "" {
					hours, err := strconv.Atoi(expiresInput)
					if err != nil || hours < 1 || hours > 24*30 {
						if isAjaxRequest(r) {
							w.Header().Set("Content-Type", "application/json")
							w.WriteHeader(http.StatusBadRequest)
							json.NewEncoder(w).Encode(map[string]string{"error": "Invalid hours"})
							return
						}
						render(&FlashMessage{Message: translateMessage(translate, "account.links.error_invalid_hours"), Kind: "error"}, baseForm)
						return
					}
					expiresAt = sql.NullInt64{Int64: time.Now().Add(time.Duration(hours) * time.Hour).Unix(), Valid: true}
				}

				var labelValue sql.NullString
				if label != "" {
					labelValue = sql.NullString{String: label, Valid: true}
				}

				if err := db.UpdateAuthLinkSettings(linkID, labelValue, expiresAt); err != nil {
					logger.Error("Failed to update auth link", "error", err, "link_id", linkID)
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusInternalServerError)
						json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.update_error"), Kind: "error"}, baseForm)
					return
				}

				if isAjaxRequest(r) {
					w.Header().Set("Content-Type", "application/json")
					json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
					return
				}

				setAccountLinksFlash(w, r, accountLinksFlashPayload{
					Message: translateMessage(translate, "account.links.update_success"),
					Kind:    "success",
				})
				http.Redirect(w, r, "/account/links", http.StatusSeeOther)
				return
			default:
				token, err := auth.GenerateToken(24)
				if err != nil {
					logger.Error("Failed to generate auth link token", "error", err)
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusInternalServerError)
						json.NewEncoder(w).Encode(map[string]string{"error": "Failed to generate token"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, baseForm)
					return
				}

				previewLength := 8
				if len(token) < previewLength {
					previewLength = len(token)
				}
				link := &storage.AuthLink{
					TokenHash:    auth.HashToken(token),
					TokenPreview: sql.NullString{String: token[:previewLength], Valid: previewLength > 0},
					Active:       false, // Link is inactive until user clicks OK in modal
					CreatedAt:    time.Now().Unix(),
					CreatedBy: sql.NullInt64{
						Int64: session.AdminID.Int64,
						Valid: true,
					},
				}

				linkID, err := db.CreateAuthLink(link)
				if err != nil {
					logger.Error("Failed to persist auth link", "error", err)
					if isAjaxRequest(r) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusInternalServerError)
						json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create link"})
						return
					}
					render(&FlashMessage{Message: translateMessage(translate, "account.links.error_generic"), Kind: "error"}, baseForm)
					return
				}

				generatedURL := buildAuthLinkURL(cfg, r, token)

				// Return JSON for AJAX requests
				if isAjaxRequest(r) {
					w.Header().Set("Content-Type", "application/json")
					json.NewEncoder(w).Encode(map[string]interface{}{
						"url": generatedURL,
						"id":  linkID,
					})
					return
				}

				setAccountLinksFlash(w, r, accountLinksFlashPayload{
					Message:       translateMessage(translate, "account.links.success"),
					Kind:          "success",
					GeneratedLink: generatedURL,
				})
				http.Redirect(w, r, "/account/links", http.StatusSeeOther)
				return
			}
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
	data.Assets.JS = ""

	links, err := db.ListAuthLinks(100)
	if err != nil {
		logger.Error("Failed to list auth links", "error", err)
	}

	views := make([]AccountLinkView, 0, len(links))
	now := time.Now()
	for _, link := range links {
		label := strings.TrimSpace(link.Username.String)
		created := time.Unix(link.CreatedAt, 0).Format(time.RFC3339)

		var (
			expiresDisplay string
			expiresInput   string
		)
		tokenPreview := strings.TrimSpace(link.TokenPreview.String)
		if tokenPreview == "" {
			if hash := strings.TrimSpace(link.TokenHash); hash != "" {
				runeCount := 8
				if len(hash) < runeCount {
					runeCount = len(hash)
				}
				tokenPreview = hash[:runeCount]
			}
		}
		if tokenPreview != "" {
			tokenPreview = tokenPreview + "..."
		}

		if !link.ExpiresAt.Valid || link.ExpiresAt.Int64 == 0 {
			expiresDisplay = translateMessage(translate, "account.links.never")
		} else {
			expTime := time.Unix(link.ExpiresAt.Int64, 0)
			if expTime.Before(now) {
				expiresDisplay = fmt.Sprintf("%s %s", translateMessage(translate, "account.links.expired"), expTime.Format(time.RFC3339))
			} else {
				expiresDisplay = expTime.Format(time.RFC3339)
				hoursRemaining := time.Until(expTime).Hours()
				if hoursRemaining > 0 {
					expiresInput = strconv.Itoa(int(math.Ceil(hoursRemaining)))
				}
			}
		}

		views = append(views, AccountLinkView{
			ID:             link.ID,
			Label:          label,
			Created:        created,
			ExpiresDisplay: expiresDisplay,
			ExpiresInHours: expiresInput,
			TokenPreview:   tokenPreview,
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

const accountLinksFlashCookieName = "account_links_flash"

type accountLinksFlashPayload struct {
	Message       string `json:"message"`
	Kind          string `json:"kind"`
	GeneratedLink string `json:"generated_link,omitempty"`
}

func setAccountLinksFlash(w http.ResponseWriter, r *http.Request, payload accountLinksFlashPayload) {
	if payload.Message == "" && payload.GeneratedLink == "" {
		return
	}
	data, err := json.Marshal(payload)
	if err != nil {
		return
	}
	cookie := &http.Cookie{
		Name:     accountLinksFlashCookieName,
		Value:    base64.RawURLEncoding.EncodeToString(data),
		Path:     "/account/links",
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	if isRequestSecure(r) {
		cookie.Secure = true
	}
	http.SetCookie(w, cookie)
}

func popAccountLinksFlash(w http.ResponseWriter, r *http.Request) *accountLinksFlashPayload {
	cookie, err := r.Cookie(accountLinksFlashCookieName)
	if err != nil {
		return nil
	}
	clearAccountLinksFlashCookie(w, r)
	if cookie.Value == "" {
		return nil
	}
	data, err := base64.RawURLEncoding.DecodeString(cookie.Value)
	if err != nil {
		return nil
	}
	var payload accountLinksFlashPayload
	if err := json.Unmarshal(data, &payload); err != nil {
		return nil
	}
	return &payload
}

func clearAccountLinksFlashCookie(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     accountLinksFlashCookieName,
		Value:    "",
		Path:     "/account/links",
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	}
	if isRequestSecure(r) {
		cookie.Secure = true
	}
	http.SetCookie(w, cookie)
}

func isRequestSecure(r *http.Request) bool {
	if r.TLS != nil {
		return true
	}
	if proto := r.Header.Get("X-Forwarded-Proto"); strings.EqualFold(proto, "https") {
		return true
	}
	return false
}

func isAjaxRequest(r *http.Request) bool {
	return r.Header.Get("X-Requested-With") == "XMLHttpRequest" ||
		strings.Contains(r.Header.Get("Accept"), "application/json")
}
