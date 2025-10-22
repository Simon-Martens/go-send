package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

type signupLinkSummary struct {
	ActiveCount int `json:"active_count"`
}

type signupLinksOverviewResponse struct {
	Admin signupLinkSummary `json:"admin"`
	User  signupLinkSummary `json:"user"`
}

type signupLinkIssueRequest struct {
	Type string `json:"type"`
}

type signupLinkIssueResponse struct {
	Type             string `json:"type"`
	Link             string `json:"link"`
	ExpiresAt        int64  `json:"expires_at"`
	ExpiresInSeconds int64  `json:"expires_in_seconds"`
	ActiveCount      int    `json:"active_count"`
}

type signupLinkRevokeResponse struct {
	Type        string `json:"type"`
	Revoked     int64  `json:"revoked"`
	ActiveCount int    `json:"active_count"`
}

const signupLinkLifetime = 7 * 24 * time.Hour
const signupLinkMaxUses = 1

func NewSignupLinksHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Middleware ensures admin authentication
		switch r.Method {
		case http.MethodGet:
			handleSignupLinksGet(app, w, r)
		case http.MethodPost:
			handleSignupLinksPost(app, w, r)
		case http.MethodDelete:
			handleSignupLinksDelete(app, w, r)
		default:
			w.Header().Set("Allow", "GET, POST, DELETE")
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func handleSignupLinksGet(app *core.App, w http.ResponseWriter, r *http.Request) {
	adminCount, err := countActiveTokens(app.DB, storage.TokenTypeAdminSignup)
	if err != nil {
		app.Logger.Error("Signup links: count admin tokens failed", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	userCount, err := countActiveTokens(app.DB, storage.TokenTypeUserSignup)
	if err != nil {
		app.Logger.Error("Signup links: count user tokens failed", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	resp := signupLinksOverviewResponse{
		Admin: signupLinkSummary{ActiveCount: adminCount},
		User:  signupLinkSummary{ActiveCount: userCount},
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		app.Logger.Warn("Signup links: failed to encode overview response", "error", err)
	}
}

func handleSignupLinksPost(app *core.App, w http.ResponseWriter, r *http.Request) {
	// Get user ID from session
	session, _ := app.GetAuthenticatedSession(r)
	userID := *session.UserID
	var req signupLinkIssueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	tokenType, err := parseSignupLinkType(req.Type)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rawToken, token, err := app.DB.GenerateSignupToken(userID, tokenType, signupLinkLifetime, signupLinkMaxUses)
	if err != nil {
		app.Logger.Error("Signup links: token generation failed", "error", err, "type", tokenType)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	link := fmt.Sprintf("%s/auth/claim/%s", resolveBaseURL(app, r), rawToken)

	activeCount, err := countActiveTokens(app.DB, tokenType)
	if err != nil {
		app.Logger.Warn("Signup links: counting tokens after creation failed", "error", err, "type", tokenType)
		activeCount = 0
	}

	expiresAt := int64(0)
	if token.ExpiresAt != nil {
		expiresAt = *token.ExpiresAt
	}

	resp := signupLinkIssueResponse{
		Type:             req.Type,
		Link:             link,
		ExpiresAt:        expiresAt,
		ExpiresInSeconds: int64(signupLinkLifetime.Seconds()),
		ActiveCount:      activeCount,
	}

	app.DBLogger.LogRequest(r, http.StatusOK, &userID, "",
		"action", "signup_link_created",
		"token_type", tokenType.String(),
		"token_id", token.ID)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		app.Logger.Warn("Signup links: failed to encode issue response", "error", err)
	}
}

func handleSignupLinksDelete(app *core.App, w http.ResponseWriter, r *http.Request) {
	linkType := r.URL.Query().Get("type")
	if linkType == "" {
		var req signupLinkIssueRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			linkType = req.Type
		}
	}

	tokenType, err := parseSignupLinkType(linkType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	revoked, err := app.DB.DeleteTokensByType(tokenType)
	if err != nil {
		app.Logger.Error("Signup links: failed to revoke tokens", "error", err, "type", tokenType)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	activeCount, err := countActiveTokens(app.DB, tokenType)
	if err != nil {
		app.Logger.Warn("Signup links: counting tokens after revoke failed", "error", err, "type", tokenType)
		activeCount = 0
	}

	resp := signupLinkRevokeResponse{
		Type:        linkType,
		Revoked:     revoked,
		ActiveCount: activeCount,
	}

	app.DBLogger.LogRequest(r, http.StatusOK, nil, "",
		"action", "signup_links_revoked",
		"token_type", tokenType.String(),
		"count", revoked)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		app.Logger.Warn("Signup links: failed to encode revoke response", "error", err)
	}
}

func parseSignupLinkType(value string) (storage.AuthTokenType, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "admin":
		return storage.TokenTypeAdminSignup, nil
	case "user":
		return storage.TokenTypeUserSignup, nil
	default:
		return 0, fmt.Errorf("unknown signup link type: %s", value)
	}
}

func countActiveTokens(db *storage.DB, tokenType storage.AuthTokenType) (int, error) {
	active := true
	tokens, err := db.ListAuthTokens(&tokenType, &active, nil)
	if err != nil {
		return 0, err
	}

	now := time.Now().Unix()
	count := 0
	for _, token := range tokens {
		if token.Expires && token.ExpiresAt != nil && *token.ExpiresAt < now {
			continue
		}
		if token.ExpiresIn != nil && *token.ExpiresIn <= 0 {
			continue
		}
		count++
	}
	return count, nil
}

func resolveBaseURL(app *core.App, r *http.Request) string {
	base := app.Config.BaseURL
	if base == "" && app.Config.DetectBaseURL {
		scheme := "http"
		if r.TLS != nil {
			scheme = "https"
		}
		base = scheme + "://" + r.Host
	} else if base == "" {
		base = "http://localhost:" + app.Config.Port
	}
	return strings.TrimRight(base, "/")
}
