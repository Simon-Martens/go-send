package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

type uploadLinkItem struct {
	ID          int64  `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
	Preview     string `json:"preview"`
	Active      bool   `json:"active"`
	Created     int64  `json:"created"`
	CreatedBy   int64  `json:"created_by"`
}

type uploadLinksListResponse struct {
	Links []uploadLinkItem `json:"links"`
}

type uploadLinkCreateRequest struct {
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
}

type uploadLinkCreateResponse struct {
	ID          int64  `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
	Preview     string `json:"preview"`
	Active      bool   `json:"active"`
	Created     int64  `json:"created"`
	CreatedBy   int64  `json:"created_by"`
	Link        string `json:"link"`
}

type uploadLinkRevokeResponse struct {
	ID      int64  `json:"id"`
	State   string `json:"state"`
	Message string `json:"message,omitempty"`
}

func NewAdminUploadLinksHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, ok := requireAdminUser(app, w, r)
		if !ok {
			return
		}

		switch r.Method {
		case http.MethodGet:
			handleUploadLinksList(app, w, r)
		case http.MethodPost:
			handleUploadLinksCreate(app, w, r, session)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func NewAdminUploadLinkHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		session, ok := requireAdminUser(app, w, r)
		if !ok {
			return
		}

		path := strings.TrimPrefix(r.URL.Path, "/api/admin/upload-links/")
		if path == "" {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		id, err := strconv.ParseInt(path, 10, 64)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid link ID", http.StatusBadRequest)
			return
		}

		handleUploadLinkRevoke(app, w, r, id, session)
	}
}

func handleUploadLinksList(app *core.App, w http.ResponseWriter, r *http.Request) {
	tokenType := storage.TokenTypeGeneralGuestUpload
	tokens, err := app.DB.ListAuthTokens(&tokenType, nil, nil)
	if err != nil {
		app.Logger.Error("Upload links: failed to list tokens", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	response := uploadLinksListResponse{
		Links: make([]uploadLinkItem, 0, len(tokens)),
	}

	for _, token := range tokens {
		item := uploadLinkItem{
			ID:          token.ID,
			Label:       token.Name,
			Description: token.Description,
			Preview:     token.Preview,
			Active:      token.Active,
			Created:     token.Created,
			CreatedBy:   token.CreatedBy,
		}
		response.Links = append(response.Links, item)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		app.Logger.Warn("Upload links: failed to encode list response", "error", err)
	}
}

func handleUploadLinksCreate(app *core.App, w http.ResponseWriter, r *http.Request, session *storage.Session) {
	var req uploadLinkCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Label) == "" {
		http.Error(w, "Label is required", http.StatusBadRequest)
		return
	}

	rawToken, token, err := app.DB.GenerateGuestUploadToken(*session.UserID, req.Label, req.Description)
	if err != nil {
		app.Logger.Error("Upload links: failed to create token", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	link := fmt.Sprintf("%s/auth/claim/%s", resolveBaseURL(app, r), rawToken)

	response := uploadLinkCreateResponse{
		ID:          token.ID,
		Label:       token.Name,
		Description: token.Description,
		Preview:     token.Preview,
		Active:      token.Active,
		Created:     token.Created,
		CreatedBy:   token.CreatedBy,
		Link:        link,
	}

	app.DBLogger.LogRequest(r, http.StatusCreated, session.UserID, "upload_link_created", "auth_token_id", token.ID, "token_preview", token.Preview)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		app.Logger.Warn("Upload links: failed to encode create response", "error", err)
	}
}

func handleUploadLinkRevoke(app *core.App, w http.ResponseWriter, r *http.Request, tokenID int64, session *storage.Session) {
	token, err := app.DB.GetAuthTokenByID(tokenID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Upload link not found", http.StatusNotFound)
			return
		}
		app.Logger.Error("Upload links: failed to load token", "error", err, "auth_token_id", tokenID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if token.Type != storage.TokenTypeGeneralGuestUpload {
		http.Error(w, "Invalid token type", http.StatusBadRequest)
		return
	}

	if err := app.DB.DeactivateAuthToken(tokenID); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Upload link not found", http.StatusNotFound)
			return
		}
		app.Logger.Error("Upload links: failed to deactivate token", "error", err, "auth_token_id", tokenID)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := app.DB.DeleteSessionsByAuthToken(tokenID); err != nil {
		app.Logger.Warn("Upload links: failed to delete sessions for token", "error", err, "auth_token_id", tokenID)
	}

	app.DBLogger.LogRequest(r, http.StatusOK, session.UserID, "upload_link_revoked", "auth_token_id", tokenID)

	response := uploadLinkRevokeResponse{
		ID:    tokenID,
		State: "revoked",
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		app.Logger.Warn("Upload links: failed to encode revoke response", "error", err)
	}
}
