package storage

import (
	"crypto/rand"
	"database/sql"
	"fmt"
	"time"

	"github.com/Simon-Martens/go-send/utils"
)

// AuthTokenType represents the type of authentication token
type AuthTokenType int

const (
	TokenTypeAdminSignup        AuthTokenType = 0
	TokenTypeUserSignup         AuthTokenType = 1
	TokenTypeGeneralGuestUpload AuthTokenType = 2
	TokenTypeSpecificGuestUpload AuthTokenType = 3
)

// String returns the string representation of an AuthTokenType
func (t AuthTokenType) String() string {
	switch t {
	case TokenTypeAdminSignup:
		return "admin_signup"
	case TokenTypeUserSignup:
		return "user_signup"
	case TokenTypeGeneralGuestUpload:
		return "general_guest_upload"
	case TokenTypeSpecificGuestUpload:
		return "specific_guest_upload"
	default:
		return "unknown"
	}
}

// IsValid checks if the token type is valid
func (t AuthTokenType) IsValid() bool {
	return t >= TokenTypeAdminSignup && t <= TokenTypeSpecificGuestUpload
}

// AuthToken represents an authentication token in the database
type AuthToken struct {
	ID          int64         `json:"id"`
	Token       string        `json:"-"` // Never expose in JSON
	Expires     bool          `json:"expires"`
	ExpiresAt   *int64        `json:"expires_at,omitempty"`
	ExpiresIn   *int          `json:"expires_in,omitempty"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Preview     string        `json:"preview"`
	Active      bool          `json:"active"`
	Type        AuthTokenType `json:"type"`
	Created     int64         `json:"created"`
	CreatedBy   int64         `json:"created_by"`
}

// Database operations for auth tokens

// CreateAuthToken inserts a new auth token into the database
func (d *DB) CreateAuthToken(token *AuthToken) error {
	token.Created = time.Now().Unix()

	// Validate token type
	if !token.Type.IsValid() {
		return fmt.Errorf("invalid token type: %d", token.Type)
	}

	query := `
		INSERT INTO authtokens (
			token, expires, expires_at, expires_in, name, description,
			preview, active, type, created, created_by
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := d.db.Exec(
		query,
		token.Token,
		boolToInt(token.Expires),
		token.ExpiresAt,
		token.ExpiresIn,
		token.Name,
		token.Description,
		token.Preview,
		boolToInt(token.Active),
		int(token.Type),
		token.Created,
		token.CreatedBy,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	token.ID = id
	return nil
}

// GetAuthToken retrieves a token by its hashed value
func (d *DB) GetAuthToken(tokenHash string) (*AuthToken, error) {
	query := `
		SELECT id, token, expires, expires_at, expires_in, name, description,
		       preview, active, type, created, created_by
		FROM authtokens
		WHERE token = ?
	`

	return d.scanAuthToken(d.db.QueryRow(query, tokenHash))
}

// GetAuthTokenByID retrieves a token by its ID
func (d *DB) GetAuthTokenByID(id int64) (*AuthToken, error) {
	query := `
		SELECT id, token, expires, expires_at, expires_in, name, description,
		       preview, active, type, created, created_by
		FROM authtokens
		WHERE id = ?
	`

	return d.scanAuthToken(d.db.QueryRow(query, id))
}

// scanAuthToken scans a row into an AuthToken struct
func (d *DB) scanAuthToken(row *sql.Row) (*AuthToken, error) {
	token := &AuthToken{}
	var expires, active, tokenType int
	var expiresAt, expiresIn sql.NullInt64

	err := row.Scan(
		&token.ID,
		&token.Token,
		&expires,
		&expiresAt,
		&expiresIn,
		&token.Name,
		&token.Description,
		&token.Preview,
		&active,
		&tokenType,
		&token.Created,
		&token.CreatedBy,
	)
	if err != nil {
		return nil, err
	}

	token.Expires = intToBool(expires)
	token.Active = intToBool(active)
	token.Type = AuthTokenType(tokenType)

	if expiresAt.Valid {
		token.ExpiresAt = &expiresAt.Int64
	}
	if expiresIn.Valid {
		val := int(expiresIn.Int64)
		token.ExpiresIn = &val
	}

	return token, nil
}

// scanAuthTokens scans multiple rows into AuthToken structs
func (d *DB) scanAuthTokens(rows *sql.Rows) ([]*AuthToken, error) {
	var tokens []*AuthToken

	for rows.Next() {
		token := &AuthToken{}
		var expires, active, tokenType int
		var expiresAt, expiresIn sql.NullInt64

		err := rows.Scan(
			&token.ID,
			&token.Token,
			&expires,
			&expiresAt,
			&expiresIn,
			&token.Name,
			&token.Description,
			&token.Preview,
			&active,
			&tokenType,
			&token.Created,
			&token.CreatedBy,
		)
		if err != nil {
			return nil, err
		}

		token.Expires = intToBool(expires)
		token.Active = intToBool(active)
		token.Type = AuthTokenType(tokenType)

		if expiresAt.Valid {
			token.ExpiresAt = &expiresAt.Int64
		}
		if expiresIn.Valid {
			val := int(expiresIn.Int64)
			token.ExpiresIn = &val
		}

		tokens = append(tokens, token)
	}

	return tokens, rows.Err()
}

// UpdateAuthToken updates an existing auth token
func (d *DB) UpdateAuthToken(token *AuthToken) error {
	// Validate token type
	if !token.Type.IsValid() {
		return fmt.Errorf("invalid token type: %d", token.Type)
	}

	query := `
		UPDATE authtokens
		SET token = ?, expires = ?, expires_at = ?, expires_in = ?,
		    name = ?, description = ?, preview = ?, active = ?, type = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(
		query,
		token.Token,
		boolToInt(token.Expires),
		token.ExpiresAt,
		token.ExpiresIn,
		token.Name,
		token.Description,
		token.Preview,
		boolToInt(token.Active),
		int(token.Type),
		token.ID,
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

// DeactivateAuthToken marks a token as inactive
func (d *DB) DeactivateAuthToken(id int64) error {
	query := `UPDATE authtokens SET active = 0 WHERE id = ?`
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

// ActivateAuthToken marks a token as active
func (d *DB) ActivateAuthToken(id int64) error {
	query := `UPDATE authtokens SET active = 1 WHERE id = ?`
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

// DeleteAuthToken removes a token from the database
func (d *DB) DeleteAuthToken(id int64) error {
	query := `DELETE FROM authtokens WHERE id = ?`
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

// DecrementTokenUsage decrements the expires_in counter for a token
// Returns true if the token still has uses remaining, false if it's exhausted
func (d *DB) DecrementTokenUsage(id int64) (bool, error) {
	// First get current expires_in value
	var expiresIn sql.NullInt64
	err := d.db.QueryRow("SELECT expires_in FROM authtokens WHERE id = ?", id).Scan(&expiresIn)
	if err != nil {
		return false, err
	}

	// If expires_in is NULL, token has unlimited uses
	if !expiresIn.Valid {
		return true, nil
	}

	// If already at 0 or below, token is exhausted
	if expiresIn.Int64 <= 0 {
		return false, nil
	}

	// Decrement the counter
	query := `UPDATE authtokens SET expires_in = expires_in - 1 WHERE id = ?`
	_, err = d.db.Exec(query, id)
	if err != nil {
		return false, err
	}

	// Return true if still has uses remaining
	return expiresIn.Int64 > 1, nil
}

// IsTokenValid checks if a token is valid (active, not expired, has uses remaining)
func (d *DB) IsTokenValid(tokenHash string) (bool, *AuthToken, error) {
	token, err := d.GetAuthToken(tokenHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil, nil
		}
		return false, nil, err
	}

	// Check if active
	if !token.Active {
		return false, token, nil
	}

	// Check time-based expiration
	if token.Expires && token.ExpiresAt != nil {
		if time.Now().Unix() > *token.ExpiresAt {
			return false, token, nil
		}
	}

	// Check usage-based expiration
	if token.ExpiresIn != nil && *token.ExpiresIn <= 0 {
		return false, token, nil
	}

	return true, token, nil
}

// ListAuthTokens retrieves all tokens, optionally filtered by type, active status, or creator
func (d *DB) ListAuthTokens(tokenType *AuthTokenType, active *bool, createdBy *int64) ([]*AuthToken, error) {
	query := `
		SELECT id, token, expires, expires_at, expires_in, name, description,
		       preview, active, type, created, created_by
		FROM authtokens
		WHERE 1=1
	`
	var args []interface{}

	if tokenType != nil {
		if !tokenType.IsValid() {
			return nil, fmt.Errorf("invalid token type: %d", *tokenType)
		}
		query += " AND type = ?"
		args = append(args, int(*tokenType))
	}

	if active != nil {
		query += " AND active = ?"
		args = append(args, boolToInt(*active))
	}

	if createdBy != nil {
		query += " AND created_by = ?"
		args = append(args, *createdBy)
	}

	query += " ORDER BY created DESC"

	rows, err := d.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanAuthTokens(rows)
}

// CountAuthTokens returns the total number of tokens, optionally filtered
func (d *DB) CountAuthTokens(tokenType *AuthTokenType, active *bool, createdBy *int64) (int, error) {
	query := `SELECT COUNT(*) FROM authtokens WHERE 1=1`
	var args []interface{}

	if tokenType != nil {
		if !tokenType.IsValid() {
			return 0, fmt.Errorf("invalid token type: %d", *tokenType)
		}
		query += " AND type = ?"
		args = append(args, int(*tokenType))
	}

	if active != nil {
		query += " AND active = ?"
		args = append(args, boolToInt(*active))
	}

	if createdBy != nil {
		query += " AND created_by = ?"
		args = append(args, *createdBy)
	}

	var count int
	err := d.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// CleanupExpiredTokens deactivates or deletes tokens that have expired (time-based or usage-based)
func (d *DB) CleanupExpiredTokens(deleteInsteadOfDeactivate bool) error {
	now := time.Now().Unix()

	if deleteInsteadOfDeactivate {
		// Delete expired tokens
		query := `
			DELETE FROM authtokens
			WHERE (expires = 1 AND expires_at IS NOT NULL AND expires_at < ?)
			   OR (expires_in IS NOT NULL AND expires_in <= 0)
		`
		_, err := d.db.Exec(query, now)
		return err
	} else {
		// Deactivate expired tokens
		query := `
			UPDATE authtokens
			SET active = 0
			WHERE (expires = 1 AND expires_at IS NOT NULL AND expires_at < ?)
			   OR (expires_in IS NOT NULL AND expires_in <= 0)
		`
		_, err := d.db.Exec(query, now)
		return err
	}
}

// GetTokensByUser retrieves all tokens created by a specific user
func (d *DB) GetTokensByUser(userID int64) ([]*AuthToken, error) {
	query := `
		SELECT id, token, expires, expires_at, expires_in, name, description,
		       preview, active, type, created, created_by
		FROM authtokens
		WHERE created_by = ?
		ORDER BY created DESC
	`

	rows, err := d.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanAuthTokens(rows)
}

// DeleteTokensByType deletes all tokens of a specific type
func (d *DB) DeleteTokensByType(tokenType AuthTokenType) (int64, error) {
	if !tokenType.IsValid() {
		return 0, fmt.Errorf("invalid token type: %d", tokenType)
	}

	query := `DELETE FROM authtokens WHERE type = ?`
	result, err := d.db.Exec(query, int(tokenType))
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}

// GenerateInitialAdminToken creates a one-time use admin signup token
// Returns the raw token (to be shown once) and the database record
func (d *DB) GenerateInitialAdminToken(creatorID int64) (string, *AuthToken, error) {
	// Generate a user-friendly token using only lowercase letters and digits (a-z, 0-9)
	// 40 characters = ~206 bits of entropy (log2(36^40))
	const tokenLength = 40
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"

	rawBytes := make([]byte, tokenLength)
	if _, err := rand.Read(rawBytes); err != nil {
		return "", nil, fmt.Errorf("failed to generate random token: %w", err)
	}

	// Convert random bytes to charset characters
	rawToken := make([]byte, tokenLength)
	for i := 0; i < tokenLength; i++ {
		rawToken[i] = charset[int(rawBytes[i])%len(charset)]
	}

	// Hash the token for storage
	hashedToken := utils.HashToken(string(rawToken))

	// Create preview (first 8 characters)
	preview := string(rawToken[:8]) + "..."

	// Create one-time use token
	expiresIn := 1
	token := &AuthToken{
		Token:       hashedToken,
		Expires:     false, // No time-based expiration
		ExpiresAt:   nil,
		ExpiresIn:   &expiresIn, // One-time use
		Name:        "Initial Admin Token",
		Description: "Auto-generated token for creating the first administrator account",
		Preview:     preview,
		Active:      true,
		Type:        TokenTypeAdminSignup,
		CreatedBy:   creatorID,
	}

	if err := d.CreateAuthToken(token); err != nil {
		return "", nil, fmt.Errorf("failed to save token to database: %w", err)
	}

	return string(rawToken), token, nil
}
