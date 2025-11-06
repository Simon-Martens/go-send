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
	Type                 string `json:"type"`                 // "upload", "download", or "deletion"
	Timestamp            string `json:"timestamp"`            // ISO 8601 timestamp
	Duration             int64  `json:"duration"`             // milliseconds
	FileID               string `json:"fileId"`               // file ID
	OwnerName            string `json:"ownerName"`            // owner name or "Guest"
	OwnerType            string `json:"ownerType"`            // "owner" or "guest"
	IsAuthTokenUpload    bool   `json:"isAuthTokenUpload"`    // whether uploaded via auth token
	IP                   string `json:"ip"`                   // IP address
	UserAgent            string `json:"userAgent"`            // user agent
	Origin               string `json:"origin"`               // origin header
	SessionUser          string `json:"sessionUser"`          // who accessed (for downloads)
	StatusCode           int    `json:"statusCode"`           // HTTP status code
	DeletionType         string `json:"deletionType"`         // deletion type: "user_request", "time_limit", "download_count_exceeded", or empty
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
// GET /api/logs?page=1&fileId=abc123
// Admins see all logs, regular users see logs for files they own or uploaded via auth tokens
// Optional fileId parameter filters logs to a specific file (admin can see any, users only their own)
func NewLogsHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// Middleware ensures user authentication
		session, _ := app.GetAuthenticatedSession(r)
		user, _ := app.DB.GetUser(*session.UserID)

		// Parse page parameter
		pageStr := r.URL.Query().Get("page")
		page := 1
		if pageStr != "" {
			parsedPage, err := strconv.Atoi(pageStr)
			if err == nil && parsedPage > 0 {
				page = parsedPage
			}
		}

		// Parse optional fileId parameter
		fileID := r.URL.Query().Get("fileId")

		// Calculate pagination
		const logsPerPage = 50
		offset := (page - 1) * logsPerPage

		// Determine if user is admin
		isAdmin := user.Role == storage.RoleAdmin

		var logs []*storage.FileTransferLog
		var totalCount int
		var err error

		if fileID != "" {
			// User requested logs for a specific file - validate authorization
			if !isAdmin {
				// Regular user must have access to this file
				accessibleIDs, err := app.DB.GetAccessibleFileIDsForUser(*session.UserID)
				if err != nil {
					app.Logger.Error("Logs: failed to get accessible file IDs", "error", err, "user_id", *session.UserID)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				// Check if fileID is in the accessible list
				found := false
				for _, id := range accessibleIDs {
					if id == fileID {
						found = true
						break
					}
				}
				if !found {
					http.Error(w, "Forbidden", http.StatusForbidden)
					return
				}
			}

			// Query logs for the specific file
			logs, err = app.DBLogger.ListFileTransferLogsByFileIDs([]string{fileID}, logsPerPage, offset)
			if err != nil {
				app.Logger.Error("Logs: failed to list logs for file", "error", err, "user_id", *session.UserID, "file_id", fileID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			totalCount, err = app.DBLogger.CountFileTransferLogsByFileIDs([]string{fileID})
			if err != nil {
				app.Logger.Error("Logs: failed to count logs for file", "error", err, "user_id", *session.UserID, "file_id", fileID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
		} else if isAdmin {
			// Admins see all logs
			logs, err = app.DBLogger.ListFileTransferLogsForUser(*session.UserID, isAdmin, logsPerPage, offset)
			if err != nil {
				app.Logger.Error("Logs: failed to list logs", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			totalCount, err = app.DBLogger.CountFileTransferLogsForUser(*session.UserID, isAdmin)
			if err != nil {
				app.Logger.Error("Logs: failed to count logs", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
		} else {
			// Regular users see logs for files they own or uploaded via their auth tokens
			fileIDs, err := app.DB.GetAccessibleFileIDsForUser(*session.UserID)
			if err != nil {
				app.Logger.Error("Logs: failed to get accessible file IDs", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			logs, err = app.DBLogger.ListFileTransferLogsByFileIDs(fileIDs, logsPerPage, offset)
			if err != nil {
				app.Logger.Error("Logs: failed to list logs", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			totalCount, err = app.DBLogger.CountFileTransferLogsByFileIDs(fileIDs)
			if err != nil {
				app.Logger.Error("Logs: failed to count logs", "error", err, "user_id", *session.UserID)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
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
			// Owner is now captured before deletion, so it's available for all event types
			ownerName := log.Owner
			ownerType := "guest"
			if ownerName != "" && ownerName != "Guest" {
				ownerType = "owner"
			}

			// Check if file was uploaded via auth token
			isAuthTokenUpload := false
			if fileID != "" {
				file, err := app.DB.GetFile(fileID)
				if err == nil && file != nil && file.OwnerAuthTokenID != nil {
					isAuthTokenUpload = true
				}
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

			// Get status code (default to 0 if null)
			statusCode := 0
			if log.StatusCode != nil {
				statusCode = *log.StatusCode
			}

			// Parse deletion type from data blob (for deletion events)
			deletionType := ""
			if log.EventType == "deletion" && len(log.Data) > 0 {
				var dataBlob map[string]interface{}
				if err := json.Unmarshal(log.Data, &dataBlob); err == nil {
					if dt, ok := dataBlob["deletion_type"]; ok {
						if dtStr, ok := dt.(string); ok {
							deletionType = dtStr
						}
					}
				}
			}

			entry := LogEntry{
				Type:              log.EventType,
				Timestamp:         timestamp,
				Duration:          duration,
				FileID:            fileID,
				OwnerName:         ownerName,
				OwnerType:         ownerType,
				IsAuthTokenUpload: isAuthTokenUpload,
				IP:                requestData.IP,
				UserAgent:         requestData.UserAgent,
				Origin:            requestData.Origin,
				SessionUser:       sessionUser,
				StatusCode:        statusCode,
				DeletionType:      deletionType,
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
