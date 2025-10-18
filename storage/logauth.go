package storage

import (
	"database/sql"
	"encoding/json"
	"time"
)

// AuthEventLog represents an authentication event log entry
type AuthEventLog struct {
	ID          int64           `json:"id"`
	EventType   string          `json:"event_type"` // "login_success", "login_failed", "challenge_issued", "token_used", etc.
	Timestamp   int64           `json:"timestamp"`
	UserID      *int64          `json:"user_id,omitempty"`
	AuthTokenID *int64          `json:"auth_token_id,omitempty"`
	URL         string          `json:"url"`
	RequestData json.RawMessage `json:"request_data"` // JSON blob with IP, user agent, etc.
	StatusCode  *int            `json:"status_code,omitempty"`
	Error       json.RawMessage `json:"error"` // JSON blob with error details, empty {} means no error
}

// CreateAuthEventLog inserts a new authentication event log entry
func (l *LogDB) CreateAuthEventLog(log *AuthEventLog) error {
	log.Timestamp = time.Now().Unix()

	// Ensure JSON fields have at least empty objects
	if len(log.RequestData) == 0 {
		log.RequestData = json.RawMessage("{}")
	}
	if len(log.Error) == 0 {
		log.Error = json.RawMessage("{}")
	}

	query := `
		INSERT INTO auth_event_logs (
			event_type, timestamp, user_id, auth_token_id, 
	    url, request_data, status_code, error
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := l.db.Exec(
		query,
		log.EventType,
		log.Timestamp,
		log.UserID,
		log.AuthTokenID,
		log.URL,
		string(log.RequestData),
		log.StatusCode,
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

// GetAuthEventLog retrieves an authentication event log by ID
func (l *LogDB) GetAuthEventLog(id int64) (*AuthEventLog, error) {
	query := `
		SELECT id, event_type, timestamp, user_id, auth_token_id, url, 
			request_data, status_code, error
		FROM auth_event_logs
		WHERE id = ?
	`

	log := &AuthEventLog{}
	var userID, authTokenID sql.NullInt64
	var url, requestData, errorData string
	var statusCode sql.NullInt64

	err := l.db.QueryRow(query, id).Scan(
		&log.ID,
		&log.EventType,
		&log.Timestamp,
		&userID,
		&authTokenID,
		&url,
		&requestData,
		&statusCode,
		&errorData,
	)
	if err != nil {
		return nil, err
	}

	log.RequestData = json.RawMessage(requestData)
	log.Error = json.RawMessage(errorData)
	log.URL = url

	if userID.Valid {
		log.UserID = &userID.Int64
	}
	if authTokenID.Valid {
		log.AuthTokenID = &authTokenID.Int64
	}
	if statusCode.Valid {
		sc := int(statusCode.Int64)
		log.StatusCode = &sc
	}

	return log, nil
}

// ListAuthEventLogs retrieves authentication event logs with optional filtering
func (l *LogDB) ListAuthEventLogs(eventType *string, userID *int64, statusCode *int, limit int, offset int) ([]*AuthEventLog, error) {
	// INFO: 1=1 is a common pattern to be able to attach filters all with AND
	query := `
		SELECT id, event_type, timestamp, user_id, auth_token_id, url, 
			request_data, status_code, error
		FROM auth_event_logs
		WHERE 1=1
	`
	var args []any

	if eventType != nil {
		query += " AND event_type = ?"
		args = append(args, *eventType)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	if statusCode != nil {
		query += " AND status_code = ?"
		args = append(args, *statusCode)
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

	var logs []*AuthEventLog
	for rows.Next() {
		log := &AuthEventLog{}
		var userID, authTokenID sql.NullInt64
		var requestData, errorData, url string
		var statusCode sql.NullInt64

		err := rows.Scan(
			&log.ID,
			&log.EventType,
			&log.Timestamp,
			&userID,
			&authTokenID,
			&url,
			&requestData,
			&statusCode,
			&errorData,
		)
		if err != nil {
			return nil, err
		}

		log.RequestData = json.RawMessage(requestData)
		log.Error = json.RawMessage(errorData)
		log.URL = url

		if userID.Valid {
			log.UserID = &userID.Int64
		}
		if authTokenID.Valid {
			log.AuthTokenID = &authTokenID.Int64
		}
		if statusCode.Valid {
			sc := int(statusCode.Int64)
			log.StatusCode = &sc
		}

		logs = append(logs, log)
	}

	return logs, rows.Err()
}

// CountAuthEventLogs returns the count of authentication event logs with optional filtering
func (l *LogDB) CountAuthEventLogs(eventType *string, userID *int64, statusCode *int) (int, error) {
	query := `SELECT COUNT(*) FROM auth_event_logs WHERE 1=1`
	var args []any

	if eventType != nil {
		query += " AND event_type = ?"
		args = append(args, *eventType)
	}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	if statusCode != nil {
		query += " AND status_code = ?"
		args = append(args, *statusCode)
	}

	var count int
	err := l.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// DeleteAuthEventLogsOlderThan removes authentication event logs older than the specified timestamp
func (l *LogDB) DeleteAuthEventLogsOlderThan(timestamp int64) (int64, error) {
	query := `DELETE FROM auth_event_logs WHERE timestamp < ?`
	result, err := l.db.Exec(query, timestamp)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
