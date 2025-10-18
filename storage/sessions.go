package storage

import (
	"database/sql"
	"fmt"
	"time"
)

// Session represents a session record in the database
type Session struct {
	ID          int64   `json:"id"`
	Token       string  `json:"-"` // Never expose in JSON
	LastSeen    int64   `json:"last_seen"`
	LastIP      string  `json:"last_ip"`
	ExpiresAt   int64   `json:"expires_at"`
	CreatedAt   int64   `json:"created_at"`
	UpdatedAt   int64   `json:"updated_at"`
	UserID      *int64  `json:"user_id,omitempty"`
	AuthTokenID *int64  `json:"auth_token_id,omitempty"`
}

// IsUserSession returns true if this session is associated with a user account
func (s *Session) IsUserSession() bool {
	return s.UserID != nil
}

// IsAuthTokenSession returns true if this session is associated with an auth token
func (s *Session) IsAuthTokenSession() bool {
	return s.AuthTokenID != nil
}

// IsExpired checks if the session has expired
func (s *Session) IsExpired() bool {
	return time.Now().Unix() > s.ExpiresAt
}

// Database operations for sessions

// CreateSession inserts a new session into the database
func (d *DB) CreateSession(session *Session) error {
	now := time.Now().Unix()
	session.CreatedAt = now
	session.UpdatedAt = now
	session.LastSeen = now

	// Validate that exactly one of UserID or AuthTokenID is set
	if (session.UserID == nil && session.AuthTokenID == nil) ||
		(session.UserID != nil && session.AuthTokenID != nil) {
		return fmt.Errorf("session must have either user_id or auth_token_id set, but not both")
	}

	query := `
		INSERT INTO sessions (
			token, last_seen, last_ip, expires_at, created_at, updated_at,
			user_id, auth_token_id
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := d.db.Exec(
		query,
		session.Token,
		session.LastSeen,
		session.LastIP,
		session.ExpiresAt,
		session.CreatedAt,
		session.UpdatedAt,
		session.UserID,
		session.AuthTokenID,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	session.ID = id
	return nil
}

// GetSession retrieves a session by its hashed token
func (d *DB) GetSession(tokenHash string) (*Session, error) {
	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE token = ?
	`

	return d.scanSession(d.db.QueryRow(query, tokenHash))
}

// GetSessionByID retrieves a session by its ID
func (d *DB) GetSessionByID(id int64) (*Session, error) {
	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE id = ?
	`

	return d.scanSession(d.db.QueryRow(query, id))
}

// scanSession scans a row into a Session struct
func (d *DB) scanSession(row *sql.Row) (*Session, error) {
	session := &Session{}
	var userID, authTokenID sql.NullInt64

	err := row.Scan(
		&session.ID,
		&session.Token,
		&session.LastSeen,
		&session.LastIP,
		&session.ExpiresAt,
		&session.CreatedAt,
		&session.UpdatedAt,
		&userID,
		&authTokenID,
	)
	if err != nil {
		return nil, err
	}

	if userID.Valid {
		session.UserID = &userID.Int64
	}
	if authTokenID.Valid {
		session.AuthTokenID = &authTokenID.Int64
	}

	return session, nil
}

// scanSessions scans multiple rows into Session structs
func (d *DB) scanSessions(rows *sql.Rows) ([]*Session, error) {
	var sessions []*Session

	for rows.Next() {
		session := &Session{}
		var userID, authTokenID sql.NullInt64

		err := rows.Scan(
			&session.ID,
			&session.Token,
			&session.LastSeen,
			&session.LastIP,
			&session.ExpiresAt,
			&session.CreatedAt,
			&session.UpdatedAt,
			&userID,
			&authTokenID,
		)
		if err != nil {
			return nil, err
		}

		if userID.Valid {
			session.UserID = &userID.Int64
		}
		if authTokenID.Valid {
			session.AuthTokenID = &authTokenID.Int64
		}

		sessions = append(sessions, session)
	}

	return sessions, rows.Err()
}

// UpdateSession updates an existing session
func (d *DB) UpdateSession(session *Session) error {
	session.UpdatedAt = time.Now().Unix()

	// Validate that exactly one of UserID or AuthTokenID is set
	if (session.UserID == nil && session.AuthTokenID == nil) ||
		(session.UserID != nil && session.AuthTokenID != nil) {
		return fmt.Errorf("session must have either user_id or auth_token_id set, but not both")
	}

	query := `
		UPDATE sessions
		SET token = ?, last_seen = ?, last_ip = ?, expires_at = ?, updated_at = ?,
		    user_id = ?, auth_token_id = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(
		query,
		session.Token,
		session.LastSeen,
		session.LastIP,
		session.ExpiresAt,
		session.UpdatedAt,
		session.UserID,
		session.AuthTokenID,
		session.ID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// UpdateSessionLastSeen updates the last_seen timestamp and IP address
func (d *DB) UpdateSessionLastSeen(id int64, ip string) error {
	now := time.Now().Unix()

	query := `
		UPDATE sessions
		SET last_seen = ?, last_ip = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, now, ip, now, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// ExtendSession extends the expiration time of a session
func (d *DB) ExtendSession(id int64, duration time.Duration) error {
	now := time.Now().Unix()
	newExpiry := now + int64(duration.Seconds())

	query := `
		UPDATE sessions
		SET expires_at = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, newExpiry, now, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// DeleteSession removes a session from the database
func (d *DB) DeleteSession(id int64) error {
	query := `DELETE FROM sessions WHERE id = ?`
	result, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// DeleteSessionByToken removes a session by its hashed token
func (d *DB) DeleteSessionByToken(tokenHash string) error {
	query := `DELETE FROM sessions WHERE token = ?`
	result, err := d.db.Exec(query, tokenHash)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// IsSessionValid checks if a session exists and is not expired
func (d *DB) IsSessionValid(tokenHash string) (bool, *Session, error) {
	session, err := d.GetSession(tokenHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil, nil
		}
		return false, nil, err
	}

	if session.IsExpired() {
		return false, session, nil
	}

	return true, session, nil
}

// GetSessionsByUser retrieves all sessions for a specific user
func (d *DB) GetSessionsByUser(userID int64) ([]*Session, error) {
	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE user_id = ?
		ORDER BY last_seen DESC
	`

	rows, err := d.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanSessions(rows)
}

// GetSessionsByAuthToken retrieves all sessions for a specific auth token
func (d *DB) GetSessionsByAuthToken(authTokenID int64) ([]*Session, error) {
	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE auth_token_id = ?
		ORDER BY last_seen DESC
	`

	rows, err := d.db.Query(query, authTokenID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanSessions(rows)
}

// DeleteSessionsByUser deletes all sessions for a specific user
func (d *DB) DeleteSessionsByUser(userID int64) error {
	query := `DELETE FROM sessions WHERE user_id = ?`
	_, err := d.db.Exec(query, userID)
	return err
}

// DeleteSessionsByAuthToken deletes all sessions for a specific auth token
func (d *DB) DeleteSessionsByAuthToken(authTokenID int64) error {
	query := `DELETE FROM sessions WHERE auth_token_id = ?`
	_, err := d.db.Exec(query, authTokenID)
	return err
}

// CleanupExpiredSessions removes all expired sessions
func (d *DB) CleanupExpiredSessions() (int64, error) {
	now := time.Now().Unix()

	query := `DELETE FROM sessions WHERE expires_at < ?`
	result, err := d.db.Exec(query, now)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}

// CountSessions returns the total number of sessions, optionally filtered
func (d *DB) CountSessions(userID *int64, authTokenID *int64, onlyValid bool) (int, error) {
	query := `SELECT COUNT(*) FROM sessions WHERE 1=1`
	var args []interface{}

	if userID != nil {
		query += " AND user_id = ?"
		args = append(args, *userID)
	}

	if authTokenID != nil {
		query += " AND auth_token_id = ?"
		args = append(args, *authTokenID)
	}

	if onlyValid {
		query += " AND expires_at > ?"
		args = append(args, time.Now().Unix())
	}

	var count int
	err := d.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// GetActiveSessions retrieves all non-expired sessions
func (d *DB) GetActiveSessions(limit int) ([]*Session, error) {
	now := time.Now().Unix()

	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE expires_at > ?
		ORDER BY last_seen DESC
	`

	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := d.db.Query(query, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanSessions(rows)
}

// GetInactiveSessions retrieves sessions that haven't been seen for a duration
func (d *DB) GetInactiveSessions(inactiveDuration time.Duration) ([]*Session, error) {
	threshold := time.Now().Unix() - int64(inactiveDuration.Seconds())

	query := `
		SELECT id, token, last_seen, last_ip, expires_at, created_at, updated_at,
		       user_id, auth_token_id
		FROM sessions
		WHERE last_seen < ?
		ORDER BY last_seen ASC
	`

	rows, err := d.db.Query(query, threshold)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanSessions(rows)
}

// DeleteInactiveSessions removes sessions that haven't been seen for a duration
func (d *DB) DeleteInactiveSessions(inactiveDuration time.Duration) (int64, error) {
	threshold := time.Now().Unix() - int64(inactiveDuration.Seconds())

	query := `DELETE FROM sessions WHERE last_seen < ?`
	result, err := d.db.Exec(query, threshold)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
