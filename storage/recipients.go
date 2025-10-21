package storage

import (
	"database/sql"
)

// Recipient represents a recipient record in the database
type Recipient struct {
	ID                 int64
	UserID             int64
	FileID             string
	SecretCiphertext   string
	SecretEphemeralPub string
	SecretNonce        string
	SecretVersion      int
}

// RecipientWithUserInfo represents a recipient with user information
type RecipientWithUserInfo struct {
	Recipient
	UserName  string
	UserEmail string
}

// CreateRecipient creates a new recipient entry
func (d *DB) CreateRecipient(r *Recipient) error {
	query := `
		INSERT INTO recipient (
			user_id, file_id, secret_ciphertext, secret_ephemeral_pub,
			secret_nonce, secret_version
		) VALUES (?, ?, ?, ?, ?, ?)
	`

	result, err := d.db.Exec(
		query,
		r.UserID,
		r.FileID,
		r.SecretCiphertext,
		r.SecretEphemeralPub,
		r.SecretNonce,
		r.SecretVersion,
	)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	r.ID = id
	return nil
}

// GetRecipientsByFileID retrieves all recipients for a given file
func (d *DB) GetRecipientsByFileID(fileID string) ([]*Recipient, error) {
	query := `
		SELECT id, user_id, file_id, secret_ciphertext, secret_ephemeral_pub,
		       secret_nonce, secret_version
		FROM recipient
		WHERE file_id = ?
	`

	rows, err := d.db.Query(query, fileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recipients []*Recipient
	for rows.Next() {
		r := &Recipient{}
		if err := rows.Scan(
			&r.ID,
			&r.UserID,
			&r.FileID,
			&r.SecretCiphertext,
			&r.SecretEphemeralPub,
			&r.SecretNonce,
			&r.SecretVersion,
		); err != nil {
			return nil, err
		}
		recipients = append(recipients, r)
	}

	return recipients, rows.Err()
}

// GetRecipientsByUserID retrieves all recipients for a given user
func (d *DB) GetRecipientsByUserID(userID int64) ([]*Recipient, error) {
	query := `
		SELECT id, user_id, file_id, secret_ciphertext, secret_ephemeral_pub,
		       secret_nonce, secret_version
		FROM recipient
		WHERE user_id = ?
	`

	rows, err := d.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recipients []*Recipient
	for rows.Next() {
		r := &Recipient{}
		if err := rows.Scan(
			&r.ID,
			&r.UserID,
			&r.FileID,
			&r.SecretCiphertext,
			&r.SecretEphemeralPub,
			&r.SecretNonce,
			&r.SecretVersion,
		); err != nil {
			return nil, err
		}
		recipients = append(recipients, r)
	}

	return recipients, rows.Err()
}

// GetRecipientWithUserInfo retrieves a recipient with user information
func (d *DB) GetRecipientWithUserInfo(fileID string, userID int64) (*RecipientWithUserInfo, error) {
	query := `
		SELECT r.id, r.user_id, r.file_id, r.secret_ciphertext, r.secret_ephemeral_pub,
		       r.secret_nonce, r.secret_version, u.name, u.email
		FROM recipient r
		LEFT JOIN users u ON r.user_id = u.id
		WHERE r.file_id = ? AND r.user_id = ?
	`

	rwi := &RecipientWithUserInfo{}
	var userName, userEmail sql.NullString

	err := d.db.QueryRow(query, fileID, userID).Scan(
		&rwi.ID,
		&rwi.UserID,
		&rwi.FileID,
		&rwi.SecretCiphertext,
		&rwi.SecretEphemeralPub,
		&rwi.SecretNonce,
		&rwi.SecretVersion,
		&userName,
		&userEmail,
	)

	if err != nil {
		return nil, err
	}

	if userName.Valid {
		rwi.UserName = userName.String
	}
	if userEmail.Valid {
		rwi.UserEmail = userEmail.String
	}

	return rwi, nil
}

// GetRecipientsWithUserInfoByFileID retrieves all recipients with user information for a file
func (d *DB) GetRecipientsWithUserInfoByFileID(fileID string) ([]*RecipientWithUserInfo, error) {
	query := `
		SELECT r.id, r.user_id, r.file_id, r.secret_ciphertext, r.secret_ephemeral_pub,
		       r.secret_nonce, r.secret_version, u.name, u.email
		FROM recipient r
		LEFT JOIN users u ON r.user_id = u.id
		WHERE r.file_id = ?
	`

	rows, err := d.db.Query(query, fileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recipients []*RecipientWithUserInfo
	for rows.Next() {
		rwi := &RecipientWithUserInfo{}
		var userName, userEmail sql.NullString

		if err := rows.Scan(
			&rwi.ID,
			&rwi.UserID,
			&rwi.FileID,
			&rwi.SecretCiphertext,
			&rwi.SecretEphemeralPub,
			&rwi.SecretNonce,
			&rwi.SecretVersion,
			&userName,
			&userEmail,
		); err != nil {
			return nil, err
		}

		if userName.Valid {
			rwi.UserName = userName.String
		}
		if userEmail.Valid {
			rwi.UserEmail = userEmail.String
		}

		recipients = append(recipients, rwi)
	}

	return recipients, rows.Err()
}

// DeleteRecipientsByFileID removes all recipients for a given file
func (d *DB) DeleteRecipientsByFileID(fileID string) error {
	query := `DELETE FROM recipient WHERE file_id = ?`
	_, err := d.db.Exec(query, fileID)
	return err
}

// DeleteRecipientsByUserID removes all recipients for a given user
func (d *DB) DeleteRecipientsByUserID(userID int64) error {
	query := `DELETE FROM recipient WHERE user_id = ?`
	_, err := d.db.Exec(query, userID)
	return err
}

// DeleteRecipient removes a specific recipient entry
func (d *DB) DeleteRecipient(fileID string, userID int64) error {
	query := `DELETE FROM recipient WHERE file_id = ? AND user_id = ?`
	_, err := d.db.Exec(query, fileID, userID)
	return err
}

// IsRecipient checks if a user is a recipient of a file
func (d *DB) IsRecipient(fileID string, userID int64) (bool, error) {
	query := `SELECT COUNT(*) FROM recipient WHERE file_id = ? AND user_id = ?`
	var count int
	err := d.db.QueryRow(query, fileID, userID).Scan(&count)
	return count > 0, err
}

// HasRecipients checks if a file has any recipients assigned
func (d *DB) HasRecipients(fileID string) (bool, error) {
	query := `SELECT COUNT(*) FROM recipient WHERE file_id = ?`
	var count int
	err := d.db.QueryRow(query, fileID).Scan(&count)
	return count > 0, err
}
