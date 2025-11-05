package storage

import (
	"database/sql"
	"encoding/json"
	"time"
)

// FileTransferLog represents a file upload/download log entry
type FileTransferLog struct {
	ID           int64           `json:"id"`
	EventType    string          `json:"event_type"` // "upload" or "download"
	FileID       *string         `json:"file_id,omitempty"`
	Timestamp    int64           `json:"timestamp"`
	RequestData  json.RawMessage `json:"request_data"` // JSON blob with URL, IP, user agent, etc.
	StatusCode   *int            `json:"status_code,omitempty"`
	Data         json.RawMessage `json:"data"` // JSON blob with additional data (errors, context, etc)
	UserID       *int64          `json:"user_id,omitempty"`
	SessionID    *int64          `json:"session_id,omitempty"`
	Owner        string          `json:"owner"`         // File owner name (resolved at log-time)
	SessionOwner string          `json:"session_owner"` // Session owner name (resolved at log-time)
	DurationMS   *int64          `json:"duration_ms,omitempty"`
}

// CreateFileTransferLog inserts a new file transfer log entry
func (l *LogDB) CreateFileTransferLog(log *FileTransferLog) error {
	log.Timestamp = time.Now().Unix()

	// Ensure JSON fields have at least empty objects
	if len(log.RequestData) == 0 {
		log.RequestData = json.RawMessage("{}")
	}
	if len(log.Data) == 0 {
		log.Data = json.RawMessage("{}")
	}

	query := `
		INSERT INTO file_transfer_logs (
			event_type, file_id, timestamp, request_data, status_code,
			data, user_id, session_id, owner, session_owner, duration_ms
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	// Use explicit transaction with immediate lock to avoid conflicts
	tx, err := l.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	result, err := tx.Exec(
		query,
		log.EventType,
		log.FileID,
		log.Timestamp,
		string(log.RequestData),
		log.StatusCode,
		string(log.Data),
		log.UserID,
		log.SessionID,
		log.Owner,
		log.SessionOwner,
		log.DurationMS,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	log.ID = id
	return nil
}

// GetFileTransferLog retrieves a file transfer log by ID
func (l *LogDB) GetFileTransferLog(id int64) (*FileTransferLog, error) {
	query := `
		SELECT id, event_type, file_id, timestamp, request_data, status_code,
		       data, user_id, session_id, owner, session_owner, duration_ms
		FROM file_transfer_logs
		WHERE id = ?
	`

	log := &FileTransferLog{}
	var fileID sql.NullString
	var requestData, data string
	var statusCode sql.NullInt64
	var userID, sessionID, durationMS sql.NullInt64

	err := l.db.QueryRow(query, id).Scan(
		&log.ID,
		&log.EventType,
		&fileID,
		&log.Timestamp,
		&requestData,
		&statusCode,
		&data,
		&userID,
		&sessionID,
		&log.Owner,
		&log.SessionOwner,
		&durationMS,
	)
	if err != nil {
		return nil, err
	}

	log.RequestData = json.RawMessage(requestData)
	log.Data = json.RawMessage(data)

	if fileID.Valid {
		log.FileID = &fileID.String
	}
	if statusCode.Valid {
		sc := int(statusCode.Int64)
		log.StatusCode = &sc
	}
	if userID.Valid {
		log.UserID = &userID.Int64
	}
	if sessionID.Valid {
		log.SessionID = &sessionID.Int64
	}
	if durationMS.Valid {
		log.DurationMS = &durationMS.Int64
	}

	return log, nil
}

// ListFileTransferLogs retrieves file transfer logs with optional filtering
func (l *LogDB) ListFileTransferLogs(eventType *string, userID *int64, fileID *string, limit int, offset int) ([]*FileTransferLog, error) {
	query := `
		SELECT id, event_type, file_id, timestamp, request_data, status_code,
		       data, user_id, session_id, owner, session_owner, duration_ms
		FROM file_transfer_logs
		WHERE 1=1
	`
	var args []interface{}

	if eventType != nil {
		query += " AND event_type = ?"
		args = append(args, *eventType)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	if fileID != nil {
		query += " AND file_id = ?"
		args = append(args, *fileID)
	}

	query += " ORDER BY timestamp DESC"

	if limit > 0 {
		query += " LIMIT ?"
		args = append(args, limit)
	}

	if offset > 0 {
		query += " OFFSET ?"
		args = append(args, offset)
	}

	rows, err := l.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*FileTransferLog
	for rows.Next() {
		log := &FileTransferLog{}
		var fileID sql.NullString
		var requestData, data string
		var statusCode sql.NullInt64
		var userID, sessionID, durationMS sql.NullInt64

		err := rows.Scan(
			&log.ID,
			&log.EventType,
			&fileID,
			&log.Timestamp,
			&requestData,
			&statusCode,
			&data,
			&userID,
			&sessionID,
			&log.Owner,
			&log.SessionOwner,
			&durationMS,
		)
		if err != nil {
			return nil, err
		}

		log.RequestData = json.RawMessage(requestData)
		log.Data = json.RawMessage(data)

		if fileID.Valid {
			log.FileID = &fileID.String
		}
		if statusCode.Valid {
			sc := int(statusCode.Int64)
			log.StatusCode = &sc
		}
		if userID.Valid {
			log.UserID = &userID.Int64
		}
		if sessionID.Valid {
			log.SessionID = &sessionID.Int64
		}
		if durationMS.Valid {
			log.DurationMS = &durationMS.Int64
		}

		logs = append(logs, log)
	}

	return logs, rows.Err()
}

// CountFileTransferLogs returns the count of file transfer logs with optional filtering
func (l *LogDB) CountFileTransferLogs(eventType *string, userID *int64, fileID *string) (int, error) {
	query := `SELECT COUNT(*) FROM file_transfer_logs WHERE 1=1`
	var args []interface{}

	if eventType != nil {
		query += " AND event_type = ?"
		args = append(args, *eventType)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	if fileID != nil {
		query += " AND file_id = ?"
		args = append(args, *fileID)
	}

	var count int
	err := l.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// ListFileTransferLogsByFileIDs retrieves file transfer logs for specific files
// This is useful when file IDs have been pre-filtered based on user permissions
func (l *LogDB) ListFileTransferLogsByFileIDs(fileIDs []string, limit int, offset int) ([]*FileTransferLog, error) {
	if len(fileIDs) == 0 {
		return []*FileTransferLog{}, nil
	}

	query := `
		SELECT id, event_type, file_id, timestamp, request_data, status_code,
		       data, user_id, session_id, owner, session_owner, duration_ms
		FROM file_transfer_logs
		WHERE file_id IN (` + placeholders(len(fileIDs)) + `)
		ORDER BY timestamp DESC
	`

	var args []interface{}
	for _, fid := range fileIDs {
		args = append(args, fid)
	}

	if limit > 0 {
		query += " LIMIT ?"
		args = append(args, limit)
	}

	if offset > 0 {
		query += " OFFSET ?"
		args = append(args, offset)
	}

	rows, err := l.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*FileTransferLog
	for rows.Next() {
		log := &FileTransferLog{}
		var fileID sql.NullString
		var requestData, data string
		var statusCode sql.NullInt64
		var userID, sessionID, durationMS sql.NullInt64

		err := rows.Scan(
			&log.ID,
			&log.EventType,
			&fileID,
			&log.Timestamp,
			&requestData,
			&statusCode,
			&data,
			&userID,
			&sessionID,
			&log.Owner,
			&log.SessionOwner,
			&durationMS,
		)
		if err != nil {
			return nil, err
		}

		log.RequestData = json.RawMessage(requestData)
		log.Data = json.RawMessage(data)

		if fileID.Valid {
			log.FileID = &fileID.String
		}
		if statusCode.Valid {
			sc := int(statusCode.Int64)
			log.StatusCode = &sc
		}
		if userID.Valid {
			log.UserID = &userID.Int64
		}
		if sessionID.Valid {
			log.SessionID = &sessionID.Int64
		}
		if durationMS.Valid {
			log.DurationMS = &durationMS.Int64
		}

		logs = append(logs, log)
	}

	return logs, rows.Err()
}

// CountFileTransferLogsByFileIDs returns the count of file transfer logs for specific files
func (l *LogDB) CountFileTransferLogsByFileIDs(fileIDs []string) (int, error) {
	if len(fileIDs) == 0 {
		return 0, nil
	}

	query := `SELECT COUNT(*) FROM file_transfer_logs WHERE file_id IN (` + placeholders(len(fileIDs)) + `)`

	var args []interface{}
	for _, fid := range fileIDs {
		args = append(args, fid)
	}

	var count int
	err := l.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// placeholders generates SQL placeholders like "?, ?, ?"
func placeholders(count int) string {
	if count == 0 {
		return ""
	}
	result := "?"
	for i := 1; i < count; i++ {
		result += ", ?"
	}
	return result
}

// ListFileTransferLogsForUser retrieves file transfer logs accessible to a specific user
// For admins (isAdmin=true), returns all logs
// For regular users, returns logs where the log's user_id matches
// NOTE: This only queries the log database - file/user enrichment must be done in the application layer
func (l *LogDB) ListFileTransferLogsForUser(userID int64, isAdmin bool, limit int, offset int) ([]*FileTransferLog, error) {
	if isAdmin {
		// Admin sees all logs
		return l.ListFileTransferLogs(nil, nil, nil, limit, offset)
	}

	// Regular user sees only their logs
	return l.ListFileTransferLogs(nil, &userID, nil, limit, offset)
}

// CountFileTransferLogsForUser returns the count of file transfer logs accessible to a user
func (l *LogDB) CountFileTransferLogsForUser(userID int64, isAdmin bool) (int, error) {
	if isAdmin {
		return l.CountFileTransferLogs(nil, nil, nil)
	}

	// For regular users, count logs where they are the user
	return l.CountFileTransferLogs(nil, &userID, nil)
}

// DeleteFileTransferLogsOlderThan removes file transfer logs older than the specified timestamp
func (l *LogDB) DeleteFileTransferLogsOlderThan(timestamp int64) (int64, error) {
	query := `DELETE FROM file_transfer_logs WHERE timestamp < ?`
	result, err := l.db.Exec(query, timestamp)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
