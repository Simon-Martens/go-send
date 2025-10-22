package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

// LogEntry represents a single log entry in the frontend format
type LogEntry struct {
	Type          string `json:"type"`           // "upload" or "download"
	Timestamp     string `json:"timestamp"`      // ISO 8601 timestamp
	Duration      int64  `json:"duration"`       // milliseconds
	FileID        string `json:"fileId"`         // file ID
	OwnerName     string `json:"ownerName"`      // owner name or "Guest"
	OwnerType     string `json:"ownerType"`      // "owner" or "guest"
	IP            string `json:"ip"`             // IP address
	UserAgent     string `json:"userAgent"`      // user agent
	Origin        string `json:"origin"`         // origin header
	SessionUser   string `json:"sessionUser"`    // who accessed (for downloads)
}

// LogsResponse represents the response structure for the logs endpoint
type LogsResponse struct {
	Logs        []LogEntry `json:"logs"`
	CurrentPage int        `json:"currentPage"`
	TotalCount  int        `json:"totalCount"`
}

// RequestDataBlob represents the JSON structure stored in request_data
type RequestDataBlob struct {
	IP        string `json:"ip"`
	UserAgent string `json:"user_agent"`
	Origin    string `json:"origin"`
}

// NewLogsHandler creates a handler for fetching transfer logs
// GET /api/logs?page=1
// Admins see all logs, regular users see logs for files they own or are recipients of
func NewLogsHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Require user account (forbids guest sessions)
		session, user, ok := requireUserAccount(app, w, r)
		if !ok {
			return
		}

		// Parse page parameter
		pageStr := r.URL.Query().Get("page")
		page := 1
		if pageStr != "" {
			parsedPage, err := strconv.Atoi(pageStr)
			if err == nil && parsedPage > 0 {
				page = parsedPage
			}
		}

		// Calculate pagination
		const logsPerPage = 50
		offset := (page - 1) * logsPerPage

		// Determine if user is admin
		isAdmin := user.Role == storage.RoleAdmin

		// Fetch logs
		logs, err := app.DBLogger.ListFileTransferLogsForUser(*session.UserID, isAdmin, logsPerPage, offset)
		if err != nil {
			app.Logger.Error("Logs: failed to list logs", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Get total count
		totalCount, err := app.DBLogger.CountFileTransferLogsForUser(*session.UserID, isAdmin)
		if err != nil {
			app.Logger.Error("Logs: failed to count logs", "error", err, "user_id", *session.UserID)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Transform logs to frontend format
		logEntries := make([]LogEntry, 0, len(logs))
		for _, log := range logs {
			// Parse request data
			var requestData RequestDataBlob
			if len(log.RequestData) > 0 {
				// Ignore errors, use empty values if parsing fails
				_ = json.Unmarshal(log.RequestData, &requestData)
			}

			// Get file ID (default to empty string if null)
			fileID := ""
			if log.FileID != nil {
				fileID = *log.FileID
			}

			// Use pre-stored owner name (resolved at log-time, no database lookups needed)
			ownerName := log.Owner
			ownerType := "guest"
			if ownerName != "" && ownerName != "Guest" {
				ownerType = "owner"
			}

			// Format timestamp to ISO 8601
			timestamp := time.Unix(log.Timestamp, 0).Format(time.RFC3339)

			// Get duration (default to 0 if null)
			duration := int64(0)
			if log.DurationMS != nil {
				duration = *log.DurationMS
			}

			// Use pre-stored session owner name (resolved at log-time, no database lookups needed)
			sessionUser := log.SessionOwner
			if sessionUser == "" && log.EventType == "download" {
				sessionUser = "Anonymous"
			}

			entry := LogEntry{
				Type:        log.EventType,
				Timestamp:   timestamp,
				Duration:    duration,
				FileID:      fileID,
				OwnerName:   ownerName,
				OwnerType:   ownerType,
				IP:          requestData.IP,
				UserAgent:   requestData.UserAgent,
				Origin:      requestData.Origin,
				SessionUser: sessionUser,
			}

			logEntries = append(logEntries, entry)
		}

		// Build response
		response := LogsResponse{
			Logs:        logEntries,
			CurrentPage: page,
			TotalCount:  totalCount,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			app.Logger.Warn("Logs: failed to encode response", "error", err)
		}
	}
}
