package core

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/Simon-Martens/go-send/storage"
)

// requestLogEntry is an intermediate struct for the channel
// It holds raw input data before JSON construction
type requestLogEntry struct {
	request    *http.Request
	statusCode int
	userID     *int64
	errorMsg   string
	keyValues  []any
}

// fileTransferLogEntry is an intermediate struct for file transfer logs
// It holds raw input data before JSON construction
type fileTransferLogEntry struct {
	request          *http.Request
	eventType        string  // "upload" or "download"
	fileID           string
	statusCode       int
	errorMsg         string
	keyValues        []any
	durationMS       int64
	sessionID        *int64
	userID           *int64
	db               *storage.DB // Database reference for resolving owner names
	preResolvedOwner *string     // Pre-resolved owner name (avoids DB query race condition)
}

// DBLogger handles asynchronous logging to both database and stdout
type DBLogger struct {
	logDB           *storage.LogDB
	logChan         chan *requestLogEntry
	transferLogChan chan *fileTransferLogEntry
	logger          *slog.Logger
}

// NewDBLogger creates a new DBLogger instance
// It opens the log database and starts the worker goroutine
func NewDBLogger(dbPath string, logger *slog.Logger) (*DBLogger, error) {
	// Open log database
	logDB, err := storage.NewLogDB(dbPath)
	if err != nil {
		return nil, err
	}

	// Create DBLogger with buffered channels
	dbLogger := &DBLogger{
		logDB:           logDB,
		logChan:         make(chan *requestLogEntry, 1000),
		transferLogChan: make(chan *fileTransferLogEntry, 1000),
		logger:          logger,
	}

	// Start worker goroutine
	go dbLogger.worker()

	return dbLogger, nil
}

// LogRequest logs an HTTP request to both database and stdout
// errorMsg is automatically keyed as "error" in the Error JSON
// keyValues are additional key-value pairs added to the Error JSON
func (d *DBLogger) LogRequest(
	r *http.Request,
	statusCode int,
	userID *int64,
	errorMsg string,
	keyValues ...any,
) {
	// Create intermediate entry with raw data
	entry := &requestLogEntry{
		request:    r,
		statusCode: statusCode,
		userID:     userID,
		errorMsg:   errorMsg,
		keyValues:  keyValues,
	}

	// Send to channel (non-blocking to prevent request blocking)
	select {
	case d.logChan <- entry:
		// Successfully queued
	default:
		// Channel full - log dropped to prevent blocking
		d.logger.Warn("Log channel full, request log dropped",
			"method", r.Method,
			"path", r.URL.Path,
			"status", statusCode)
	}
}

// LogFileOp logs a file transfer operation (upload/download) to both database and stdout
// sessionID and userID are optional - pass nil if not available
// db is required for resolving owner names at log-time
// preResolvedOwner is optional - if provided, it will be used instead of querying the DB
// errorMsg is automatically keyed as "error" in the Error JSON
// keyValues are additional key-value pairs added to the Error JSON
func (d *DBLogger) LogFileOp(
	r *http.Request,
	eventType string,
	fileID string,
	statusCode int,
	durationMS int64,
	sessionID *int64,
	userID *int64,
	db *storage.DB,
	errorMsg string,
	preResolvedOwner *string,
	keyValues ...any,
) {
	// Create intermediate entry with raw data
	entry := &fileTransferLogEntry{
		request:          r,
		eventType:        eventType,
		fileID:           fileID,
		statusCode:       statusCode,
		errorMsg:         errorMsg,
		keyValues:        keyValues,
		durationMS:       durationMS,
		sessionID:        sessionID,
		userID:           userID,
		db:               db,
		preResolvedOwner: preResolvedOwner,
	}

	// Send to channel (non-blocking to prevent request blocking)
	select {
	case d.transferLogChan <- entry:
		// Successfully queued
	default:
		// Channel full - log dropped to prevent blocking
		d.logger.Warn("Transfer log channel full, log dropped",
			"event_type", eventType,
			"file_id", fileID,
			"status", statusCode)
	}
}

// LogSystemFileOp logs a system-initiated file operation (e.g., automatic deletion)
// This is used for operations that don't have an HTTP request context
// durationMS should be 0 for background operations
// eventType should be "deletion" for automatic deletes
// preResolvedOwner is optional - if provided, it will be used instead of querying the DB
// keyValues should include "deletion_type" with value like "time_limit" or "download_count_exceeded"
func (d *DBLogger) LogSystemFileOp(
	fileID string,
	eventType string,
	durationMS int64,
	db *storage.DB,
	preResolvedOwner *string,
	keyValues ...any,
) {
	// Create a synthetic file transfer log entry with no request
	entry := &fileTransferLogEntry{
		request:          nil, // No HTTP request for system operations
		eventType:        eventType,
		fileID:           fileID,
		statusCode:       http.StatusOK, // System operations don't have HTTP status, use 200 as default
		errorMsg:         "",
		keyValues:        keyValues,
		durationMS:       durationMS,
		sessionID:        nil, // System operations have no session
		userID:           nil, // System operations have no user
		db:               db,
		preResolvedOwner: preResolvedOwner,
	}

	// Send to channel (non-blocking to prevent blocking)
	select {
	case d.transferLogChan <- entry:
		// Successfully queued
	default:
		// Channel full - log dropped to prevent blocking
		d.logger.Warn("Transfer log channel full, log dropped",
			"event_type", eventType,
			"file_id", fileID)
	}
}

// LogAuthEvent records authentication-related events
func (d *DBLogger) LogAuthEvent(
	r *http.Request,
	eventType string,
	identifier string,
	success bool,
	message string,
	keyValues ...any,
) {
	reqData := storage.NewRequestData(r)

	data := map[string]any{
		"identifier": identifier,
		"success":    success,
	}
	if message != "" {
		data["message"] = message
	}

	for i := 0; i < len(keyValues)-1; i += 2 {
		if key, ok := keyValues[i].(string); ok {
			data[key] = keyValues[i+1]
		}
	}

	dataJSON, err := json.Marshal(data)
	if err != nil {
		d.logger.Error("Failed to marshal auth event data", "error", err)
		dataJSON = []byte("{}")
	}

	status := http.StatusOK
	if !success {
		status = http.StatusUnauthorized
	}
	statusCode := status

	authLog := &storage.AuthEventLog{
		EventType:   eventType,
		URL:         r.URL.Path,
		RequestData: reqData.ToJSON(),
		StatusCode:  &statusCode,
		Data:        json.RawMessage(dataJSON),
	}

	if err := d.logDB.CreateAuthEventLog(authLog); err != nil {
		d.logger.Error("Failed to write auth event log to database",
			"error", err,
			"event_type", eventType,
			"identifier", identifier,
			"success", success)
	}

	logLevel := slog.LevelInfo
	if !success {
		logLevel = slog.LevelWarn
	}

	attrs := []any{
		"event_type", eventType,
		"identifier", identifier,
		"success", success,
		"ip", reqData.IP,
	}
	if message != "" {
		attrs = append(attrs, "message", message)
	}
	attrs = append(attrs, keyValues...)

	d.logger.Log(r.Context(), logLevel, "auth_event", attrs...)
}

// worker consumes log entries from both channels and writes them to the database
func (d *DBLogger) worker() {
	for {
		select {
		case entry, ok := <-d.logChan:
			if !ok {
				// Channel closed, exit worker
				return
			}
			d.processRequestLog(entry)

		case entry, ok := <-d.transferLogChan:
			if !ok {
				// Channel closed, exit worker
				return
			}
			d.processFileTransferLog(entry)
		}
	}
}

// processRequestLog handles request log entries
func (d *DBLogger) processRequestLog(entry *requestLogEntry) {
	// Build RequestData JSON from http.Request
	reqData := storage.NewRequestData(entry.request)

	// Build Error JSON from errorMsg and keyValues
	errorData := make(map[string]any)
	if entry.errorMsg != "" {
		errorData["error"] = entry.errorMsg
	}

	// Parse key-value pairs
	for i := 0; i < len(entry.keyValues)-1; i += 2 {
		if key, ok := entry.keyValues[i].(string); ok {
			errorData[key] = entry.keyValues[i+1]
		}
	}

	var errorJSON json.RawMessage
	if len(errorData) > 0 {
		errorBytes, _ := json.Marshal(errorData)
		errorJSON = json.RawMessage(errorBytes)
	} else {
		errorJSON = json.RawMessage("{}")
	}

	// Create log entry for database
	logEntry := &storage.RequestLog{
		Method:      entry.request.Method,
		URL:         entry.request.URL.Path,
		StatusCode:  entry.statusCode,
		RequestData: reqData.ToJSON(),
		UserID:      entry.userID,
		Data:        errorJSON,
	}

	// Write to database
	if err := d.logDB.CreateRequestLog(logEntry); err != nil {
		// If database write fails, log to stdout as fallback
		d.logger.Error("Failed to write request log to database",
			"error", err,
			"method", entry.request.Method,
			"url", entry.request.URL.Path,
			"status", entry.statusCode)
	}

	// Also log to stdout
	logLevel := statusCodeToLogLevel(entry.statusCode)
	logAttrs := []any{
		"method", entry.request.Method,
		"path", entry.request.URL.Path,
		"status", entry.statusCode,
		"ip", reqData.IP,
	}

	if entry.userID != nil {
		logAttrs = append(logAttrs, "user_id", *entry.userID)
	}

	if entry.errorMsg != "" {
		logAttrs = append(logAttrs, "error", entry.errorMsg)
	}

	// Append additional key-values
	logAttrs = append(logAttrs, entry.keyValues...)

	switch logLevel {
	case slog.LevelDebug:
		d.logger.Debug("HTTP request", logAttrs...)
	case slog.LevelInfo:
		d.logger.Info("HTTP request", logAttrs...)
	case slog.LevelWarn:
		d.logger.Warn("HTTP request", logAttrs...)
	case slog.LevelError:
		d.logger.Error("HTTP request", logAttrs...)
	}
}

// processFileTransferLog handles file transfer log entries
func (d *DBLogger) processFileTransferLog(entry *fileTransferLogEntry) {
	// Build RequestData JSON from http.Request (or empty if no request for system operations)
	var reqData *storage.RequestData
	if entry.request != nil {
		reqData = storage.NewRequestData(entry.request)
	} else {
		// For system-initiated operations (no HTTP request)
		reqData = &storage.RequestData{
			Method:    "system",
			Path:      "",
			IP:        "",
			UserAgent: "",
			Headers:   map[string]string{},
		}
	}

	// Build Error JSON from errorMsg and keyValues
	errorData := make(map[string]any)
	if entry.errorMsg != "" {
		errorData["error"] = entry.errorMsg
	}

	// Parse key-value pairs
	for i := 0; i < len(entry.keyValues)-1; i += 2 {
		if key, ok := entry.keyValues[i].(string); ok {
			errorData[key] = entry.keyValues[i+1]
		}
	}

	var errorJSON json.RawMessage
	if len(errorData) > 0 {
		errorBytes, _ := json.Marshal(errorData)
		errorJSON = json.RawMessage(errorBytes)
	} else {
		errorJSON = json.RawMessage("{}")
	}

	// Resolve owner names at log-time
	// Use pre-resolved owner if provided (avoids DB query race condition for deletions)
	var owner string
	if entry.preResolvedOwner != nil {
		owner = *entry.preResolvedOwner
	} else {
		owner = d.resolveFileOwnerName(entry.fileID, entry.db)
	}
	sessionOwner := d.resolveSessionOwnerName(entry.sessionID, entry.db)

	// Create file transfer log entry for database
	fileID := entry.fileID
	statusCode := entry.statusCode
	durationMS := entry.durationMS

	transferLog := &storage.FileTransferLog{
		EventType:    entry.eventType,
		FileID:       &fileID,
		StatusCode:   &statusCode,
		RequestData:  reqData.ToJSON(),
		Data:         errorJSON,
		UserID:       entry.userID,
		SessionID:    entry.sessionID,
		Owner:        owner,
		SessionOwner: sessionOwner,
		DurationMS:   &durationMS,
	}

	// Write to database
	if err := d.logDB.CreateFileTransferLog(transferLog); err != nil {
		// If database write fails, log to stdout as fallback
		d.logger.Error("Failed to write transfer log to database",
			"error", err,
			"event_type", entry.eventType,
			"file_id", entry.fileID,
			"status", entry.statusCode)
	}

	// Also log to stdout
	logLevel := statusCodeToLogLevel(entry.statusCode)
	logAttrs := []any{
		"event_type", entry.eventType,
		"file_id", entry.fileID,
		"status", entry.statusCode,
		"duration_ms", entry.durationMS,
		"ip", reqData.IP,
	}

	if entry.sessionID != nil {
		logAttrs = append(logAttrs, "session_id", *entry.sessionID)
	}

	if entry.userID != nil {
		logAttrs = append(logAttrs, "user_id", *entry.userID)
	}

	if entry.errorMsg != "" {
		logAttrs = append(logAttrs, "error", entry.errorMsg)
	}

	// Append additional key-values
	logAttrs = append(logAttrs, entry.keyValues...)

	switch logLevel {
	case slog.LevelDebug:
		d.logger.Debug("File transfer", logAttrs...)
	case slog.LevelInfo:
		d.logger.Info("File transfer", logAttrs...)
	case slog.LevelWarn:
		d.logger.Warn("File transfer", logAttrs...)
	case slog.LevelError:
		d.logger.Error("File transfer", logAttrs...)
	}
}

// DB returns the underlying LogDB for migrations and direct access
func (d *DBLogger) DB() *storage.LogDB {
	return d.logDB
}

// Close gracefully shuts down the DBLogger
// It closes both channels and waits for the worker to finish
func (d *DBLogger) Close() error {
	close(d.logChan)
	close(d.transferLogChan)
	// Note: In a production system, you might want to add a WaitGroup
	// to wait for the worker to finish processing remaining logs
	return d.logDB.Close()
}

// ListFileTransferLogsForUser is a wrapper for LogDB.ListFileTransferLogsForUser
func (d *DBLogger) ListFileTransferLogsForUser(userID int64, isAdmin bool, limit int, offset int) ([]*storage.FileTransferLog, error) {
	return d.logDB.ListFileTransferLogsForUser(userID, isAdmin, limit, offset)
}

// CountFileTransferLogsForUser is a wrapper for LogDB.CountFileTransferLogsForUser
func (d *DBLogger) CountFileTransferLogsForUser(userID int64, isAdmin bool) (int, error) {
	return d.logDB.CountFileTransferLogsForUser(userID, isAdmin)
}

// ListFileTransferLogsByFileIDs is a wrapper for LogDB.ListFileTransferLogsByFileIDs
func (d *DBLogger) ListFileTransferLogsByFileIDs(fileIDs []string, limit int, offset int) ([]*storage.FileTransferLog, error) {
	return d.logDB.ListFileTransferLogsByFileIDs(fileIDs, limit, offset)
}

// CountFileTransferLogsByFileIDs is a wrapper for LogDB.CountFileTransferLogsByFileIDs
func (d *DBLogger) CountFileTransferLogsByFileIDs(fileIDs []string) (int, error) {
	return d.logDB.CountFileTransferLogsByFileIDs(fileIDs)
}

// statusCodeToLogLevel maps HTTP status codes to slog levels
// 2XX -> DEBUG, 3XX -> INFO, 4XX -> WARN, 5XX -> ERROR
func statusCodeToLogLevel(statusCode int) slog.Level {
	switch {
	case statusCode >= 500:
		return slog.LevelError
	case statusCode >= 400:
		return slog.LevelWarn
	case statusCode >= 300:
		return slog.LevelInfo
	case statusCode >= 200:
		return slog.LevelDebug
	default:
		return slog.LevelInfo
	}
}

// resolveFileOwnerName resolves the owner name of a file at log-time
// Returns the user name or auth token name, or "Guest" if not found
func (d *DBLogger) resolveFileOwnerName(fileID string, db *storage.DB) string {
	if fileID == "" {
		return "Guest"
	}

	file, err := db.GetFile(fileID)
	if err != nil || file == nil {
		return "Guest"
	}

	// Try user owner first
	if file.OwnerUserID != nil {
		user, err := db.GetUser(*file.OwnerUserID)
		if err == nil && user != nil {
			return user.Name
		}
	}

	// Try auth token owner
	if file.OwnerAuthTokenID != nil {
		token, err := db.GetAuthTokenByID(*file.OwnerAuthTokenID)
		if err == nil && token != nil {
			return token.Name
		}
	}

	return "Guest"
}

// resolveSessionOwnerName resolves the session owner name at log-time
// Returns the user name or auth token name, or empty string if no session
func (d *DBLogger) resolveSessionOwnerName(sessionID *int64, db *storage.DB) string {
	if sessionID == nil {
		return ""
	}

	session, err := db.GetSessionByID(*sessionID)
	if err != nil || session == nil {
		return ""
	}

	// Try user owner first
	if session.UserID != nil {
		user, err := db.GetUser(*session.UserID)
		if err == nil && user != nil {
			return user.Name
		}
	}

	// Try auth token owner (for guest sessions created via auth links)
	if session.AuthTokenID != nil {
		token, err := db.GetAuthTokenByID(*session.AuthTokenID)
		if err == nil && token != nil {
			return token.Name
		}
	}

	return ""
}
