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
	Type        int    `json:"type"`
	UserName    string `json:"user_name,omitempty"`
	Created     int64  `json:"created"`
	CreatedBy   int64  `json:"created_by"`
}

type uploadLinksListResponse struct {
	Links []uploadLinkItem `json:"links"`
}

type uploadLinkCreateRequest struct {
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
	Type        int    `json:"type"`
}

type uploadLinkCreateResponse struct {
	ID          int64  `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
	Preview     string `json:"preview"`
	Active      bool   `json:"active"`
	Type        int    `json:"type"`
	UserName    string `json:"user_name,omitempty"`
	Created     int64  `json:"created"`
	CreatedBy   int64  `json:"created_by"`
	Link        string `json:"link"`
}

type uploadLinkRevokeResponse struct {
	ID      int64  `json:"id"`
	State   string `json:"state"`
	Message string `json:"message,omitempty"`
}

func NewUploadLinksHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, user, ok := requireNonGuestUser(app, w, r)
		if !ok {
			return
		}

		switch r.Method {
		case http.MethodPost:
			handleUploadLinksCreate(app, w, r, session, user)
		case http.MethodGet:
			handleUploadLinksList(app, w, r, user)
		case http.MethodDelete:
			// Support both old and new paths during migration
			path := strings.TrimPrefix(r.URL.Path, "/api/upload-links/")
			if path == r.URL.Path {
				path = strings.TrimPrefix(r.URL.Path, "/api/admin/upload-links/")
			}
			if path == "" || path == r.URL.Path {
				http.Error(w, "Not Found", http.StatusNotFound)
				return
			}
			id, err := strconv.ParseInt(path, 10, 64)
			if err != nil || id <= 0 {
				http.Error(w, "Invalid link ID", http.StatusBadRequest)
				return
			}
			handleUploadLinkRevoke(app, w, r, id, session, user)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	}
}

func handleUploadLinksList(app *core.App, w http.ResponseWriter, r *http.Request, user *storage.User) {
	// Admins see all upload links, regular users only see their own
	var createdBy *int64
	if user.Role != storage.RoleAdmin {
		createdBy = &user.ID
	}

	links, err := app.DB.ListUploadLinksWithUsers(createdBy)
	if err != nil {
		app.Logger.Error("Upload links: failed to list tokens", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	response := uploadLinksListResponse{
		Links: make([]uploadLinkItem, 0, len(links)),
	}

	for _, link := range links {
		item := uploadLinkItem{
			ID:          link.ID,
			Label:       link.Name,
			Description: link.Description,
			Preview:     link.Preview,
			Active:      link.Active,
			Type:        int(link.Type),
			UserName:    link.UserName,
			Created:     link.Created,
			CreatedBy:   link.CreatedBy,
		}
		response.Links = append(response.Links, item)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		app.Logger.Warn("Upload links: failed to encode list response", "error", err)
	}
}

func handleUploadLinksCreate(app *core.App, w http.ResponseWriter, r *http.Request, session *storage.Session, user *storage.User) {
	app.Logger.Debug("Upload links: create request", "user_id", user.ID, "session_id", session.ID)
	var req uploadLinkCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Label) == "" {
		http.Error(w, "Label is required", http.StatusBadRequest)
		return
	}

	// Validate type: 2 = general, 3 = user-specific
	tokenType := storage.AuthTokenType(req.Type)
	if tokenType != storage.TokenTypeGeneralGuestUpload && tokenType != storage.TokenTypeSpecificGuestUpload {
		http.Error(w, "Invalid type: must be 2 (general) or 3 (user-specific)", http.StatusBadRequest)
		return
	}

	// Only admins can create general (Type 2) upload links
	if tokenType == storage.TokenTypeGeneralGuestUpload && user.Role != storage.RoleAdmin {
		http.Error(w, "Forbidden: only administrators can create general upload links", http.StatusForbidden)
		return
	}

	rawToken, token, err := app.DB.GenerateGuestUploadToken(*session.UserID, tokenType, req.Label, req.Description)
	if err != nil {
		app.Logger.Error("Upload links: failed to create token", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	link := fmt.Sprintf("%s/auth/claim/%s", resolveBaseURL(app, r), rawToken)

	// Get user name for type 3 (user-specific) tokens
	var userName string
	if tokenType == storage.TokenTypeSpecificGuestUpload {
		user, err := app.DB.GetUser(*session.UserID)
		if err != nil {
			app.Logger.Warn("Upload links: failed to get user name", "error", err, "user_id", *session.UserID)
			userName = ""
		} else {
			userName = user.Name
		}
	}

	response := uploadLinkCreateResponse{
		ID:          token.ID,
		Label:       token.Name,
		Description: token.Description,
		Preview:     token.Preview,
		Active:      token.Active,
		Type:        int(token.Type),
		UserName:    userName,
		Created:     token.Created,
		CreatedBy:   token.CreatedBy,
		Link:        link,
	}

	app.DBLogger.LogRequest(r, http.StatusCreated, session.UserID, "upload_link_created", "auth_token_id", token.ID, "token_preview", token.Preview, "token_type", int(tokenType))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		app.Logger.Warn("Upload links: failed to encode create response", "error", err)
	}
}

func handleUploadLinkRevoke(app *core.App, w http.ResponseWriter, r *http.Request, tokenID int64, session *storage.Session, user *storage.User) {
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

	// Allow revoking both general (type 2) and user-specific (type 3) upload links
	if token.Type != storage.TokenTypeGeneralGuestUpload && token.Type != storage.TokenTypeSpecificGuestUpload {
		http.Error(w, "Invalid token type", http.StatusBadRequest)
		return
	}

	// Non-admin users can only revoke their own upload links
	if user.Role != storage.RoleAdmin && token.CreatedBy != user.ID {
		http.Error(w, "Forbidden: you can only revoke upload links you created", http.StatusForbidden)
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

	// Hard delete all sessions associated with this auth token
	if err := app.DB.HardDeleteSessionsByAuthToken(tokenID); err != nil {
		app.Logger.Warn("Upload links: failed to hard delete sessions for token", "error", err, "auth_token_id", tokenID)
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
