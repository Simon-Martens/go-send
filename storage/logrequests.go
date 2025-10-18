package storage

import (
	"database/sql"
	"encoding/json"
	"time"
)

// RequestLog represents a general HTTP request log entry (debug only)
type RequestLog struct {
	ID          int64           `json:"id"`
	Timestamp   int64           `json:"timestamp"`
	Method      string          `json:"method"`
	URL         string          `json:"url"`
	StatusCode  int             `json:"status_code"`
	RequestData json.RawMessage `json:"request_data"` // JSON blob with IP, user agent, etc.
	UserID      *int64          `json:"user_id,omitempty"`
	Error       json.RawMessage `json:"error"` // JSON blob with error details, empty {} means no error
}

// CreateRequestLog inserts a new request log entry
func (l *LogDB) CreateRequestLog(log *RequestLog) error {
	log.Timestamp = time.Now().Unix()

	// Ensure JSON fields have at least empty objects
	if len(log.RequestData) == 0 {
		log.RequestData = json.RawMessage("{}")
	}
	if len(log.Error) == 0 {
		log.Error = json.RawMessage("{}")
	}

	query := `
		INSERT INTO request_logs (
			timestamp, method, url, status_code,
			request_data, user_id, error
		)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	result, err := l.db.Exec(
		query,
		log.Timestamp,
		log.Method,
		log.URL,
		log.StatusCode,
		string(log.RequestData),
		log.UserID,
		string(log.Error),
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	log.ID = id
	return nil
}

// GetRequestLog retrieves a request log by ID
func (l *LogDB) GetRequestLog(id int64) (*RequestLog, error) {
	query := `
		SELECT id, timestamp, method, url, status_code,
		       request_data, user_id, error
		FROM request_logs
		WHERE id = ?
	`

	log := &RequestLog{}
	var requestData, errorData string
	var userID, requestSize, responseSize sql.NullInt64

	err := l.db.QueryRow(query, id).Scan(
		&log.ID,
		&log.Timestamp,
		&log.Method,
		&log.URL,
		&log.StatusCode,
		&requestData,
		&userID,
		&requestSize,
		&responseSize,
		&errorData,
	)
	if err != nil {
		return nil, err
	}

	log.RequestData = json.RawMessage(requestData)
	log.Error = json.RawMessage(errorData)

	if userID.Valid {
		log.UserID = &userID.Int64
	}

	return log, nil
}

// ListRequestLogs retrieves request logs with optional filtering
func (l *LogDB) ListRequestLogs(method *string, path *string, statusCode *int, userID *int64, limit int, offset int) ([]*RequestLog, error) {
	query := `
		SELECT id, timestamp, method, url, status_code,
		       request_data, user_id, error
		FROM request_logs
		WHERE 1=1
	`
	var args []any

	if method != nil {
		query += " AND method = ?"
		args = append(args, *method)
	}

	if path != nil {
		query += " AND url = ?"
		args = append(args, *path)
	}

	if statusCode != nil {
		query += " AND status_code = ?"
		args = append(args, *statusCode)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
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

	var logs []*RequestLog
	for rows.Next() {
		log := &RequestLog{}
		var requestData, errorData string
		var userID sql.NullInt64

		err := rows.Scan(
			&log.ID,
			&log.Timestamp,
			&log.Method,
			&log.URL,
			&log.StatusCode,
			&requestData,
			&userID,
			&errorData,
		)
		if err != nil {
			return nil, err
		}

		log.RequestData = json.RawMessage(requestData)
		log.Error = json.RawMessage(errorData)

		if userID.Valid {
			log.UserID = &userID.Int64
		}

		logs = append(logs, log)
	}

	return logs, rows.Err()
}

// CountRequestLogs returns the count of request logs with optional filtering
func (l *LogDB) CountRequestLogs(method *string, path *string, statusCode *int, userID *int64) (int, error) {
	query := `SELECT COUNT(*) FROM request_logs WHERE 1=1`
	var args []any

	if method != nil {
		query += " AND method = ?"
		args = append(args, *method)
	}

	if path != nil {
		query += " AND url = ?"
		args = append(args, *path)
	}

	if statusCode != nil {
		query += " AND status_code = ?"
		args = append(args, *statusCode)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	var count int
	err := l.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// DeleteRequestLogsOlderThan removes request logs older than the specified timestamp
func (l *LogDB) DeleteRequestLogsOlderThan(timestamp int64) (int64, error) {
	query := `DELETE FROM request_logs WHERE timestamp < ?`
	result, err := l.db.Exec(query, timestamp)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
