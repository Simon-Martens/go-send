package storage

import (
	"database/sql"
	"io"
	"os"
	"path/filepath"
	"time"
)

// FileMetadata represents a file record in the database
type FileMetadata struct {
	ID                 string
	OwnerToken         string
	Metadata           string // base64 encrypted metadata
	AuthKey            string // base64 auth verifier
	Nonce              string // base64 nonce
	DlLimit            int
	DlCount            int
	Password           bool
	CreatedAt          int64
	ExpiresAt          int64
	UserID             *int64
	SecretCiphertext   string
	SecretEphemeralPub string
	SecretNonce        string
	SecretVersion      int
}

// Database operations for files

func (d *DB) CreateFile(meta *FileMetadata) error {
	query := `
		INSERT INTO files (
			id, owner_token, metadata, auth_key, nonce,
			dl_limit, dl_count, password, created_at, expires_at,
			user_id, secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	var userID interface{}
	if meta.UserID != nil {
		userID = *meta.UserID
	}

	_, err := d.db.Exec(
		query,
		meta.ID,
		meta.OwnerToken,
		meta.Metadata,
		meta.AuthKey,
		meta.Nonce,
		meta.DlLimit,
		meta.DlCount,
		boolToInt(meta.Password),
		meta.CreatedAt,
		meta.ExpiresAt,
		userID,
		nullIfEmpty(meta.SecretCiphertext),
		nullIfEmpty(meta.SecretEphemeralPub),
		nullIfEmpty(meta.SecretNonce),
		meta.SecretVersion,
	)

	return err
}

func (d *DB) GetFile(id string) (*FileMetadata, error) {
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       user_id, secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version
		FROM files
		WHERE id = ?
	`

	meta := &FileMetadata{}
	var password int
	var userID sql.NullInt64
	var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
	var secretVersion sql.NullInt64

	err := d.db.QueryRow(query, id).Scan(
		&meta.ID,
		&meta.OwnerToken,
		&meta.Metadata,
		&meta.AuthKey,
		&meta.Nonce,
		&meta.DlLimit,
		&meta.DlCount,
		&password,
		&meta.CreatedAt,
		&meta.ExpiresAt,
		&userID,
		&secretCiphertext,
		&secretEphemeralPub,
		&secretNonce,
		&secretVersion,
	)

	if err != nil {
		return nil, err
	}

	meta.Password = intToBool(password)

	if userID.Valid {
		val := userID.Int64
		meta.UserID = &val
	}
	if secretCiphertext.Valid {
		meta.SecretCiphertext = secretCiphertext.String
	}
	if secretEphemeralPub.Valid {
		meta.SecretEphemeralPub = secretEphemeralPub.String
	}
	if secretNonce.Valid {
		meta.SecretNonce = secretNonce.String
	}
	if secretVersion.Valid {
		meta.SecretVersion = int(secretVersion.Int64)
	}

	return meta, nil
}

func (d *DB) GetFilesByUserID(userID int64) ([]*FileMetadata, error) {
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       user_id, secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version
		FROM files
		WHERE user_id = ?
		ORDER BY created_at DESC
	`

	rows, err := d.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []*FileMetadata
	for rows.Next() {
		meta := &FileMetadata{}
		var password int
		var rowUserID sql.NullInt64
		var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
		var secretVersion sql.NullInt64

		if err := rows.Scan(
			&meta.ID,
			&meta.OwnerToken,
			&meta.Metadata,
			&meta.AuthKey,
			&meta.Nonce,
			&meta.DlLimit,
			&meta.DlCount,
			&password,
			&meta.CreatedAt,
			&meta.ExpiresAt,
			&rowUserID,
			&secretCiphertext,
			&secretEphemeralPub,
			&secretNonce,
			&secretVersion,
		); err != nil {
			return nil, err
		}

		meta.Password = intToBool(password)

		if rowUserID.Valid {
			val := rowUserID.Int64
			meta.UserID = &val
		}
		if secretCiphertext.Valid {
			meta.SecretCiphertext = secretCiphertext.String
		}
		if secretEphemeralPub.Valid {
			meta.SecretEphemeralPub = secretEphemeralPub.String
		}
		if secretNonce.Valid {
			meta.SecretNonce = secretNonce.String
		}
		if secretVersion.Valid {
			meta.SecretVersion = int(secretVersion.Int64)
		}

		files = append(files, meta)
	}

	return files, rows.Err()
}

// ClearUserOwnership removes the user association from all files owned by the given user.
func (d *DB) ClearUserOwnership(userID int64) error {
	query := `UPDATE files SET user_id = NULL WHERE user_id = ?`
	_, err := d.db.Exec(query, userID)
	return err
}

// DeleteFilesByUser removes all files owned by the specified user, including disk data.
func (d *DB) DeleteFilesByUser(userID int64) error {
	rows, err := d.db.Query(`SELECT id FROM files WHERE user_id = ?`, userID)
	if err != nil {
		return err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return err
	}

	for _, id := range ids {
		DeleteFile(d.fileDir, id) // best effort
	}

	_, err = d.db.Exec(`DELETE FROM files WHERE user_id = ?`, userID)
	return err
}

func (d *DB) UpdateNonce(id, nonce string) error {
	query := `UPDATE files SET nonce = ? WHERE id = ?`
	_, err := d.db.Exec(query, nonce, id)
	return err
}

func (d *DB) IncrementDownload(id string) error {
	query := `UPDATE files SET dl_count = dl_count + 1 WHERE id = ?`
	_, err := d.db.Exec(query, id)
	return err
}

func (d *DB) DeleteFileRecord(id string) error {
	query := `DELETE FROM files WHERE id = ?`
	_, err := d.db.Exec(query, id)
	return err
}

func (d *DB) SetPassword(id, authKey string) error {
	query := `UPDATE files SET auth_key = ?, password = 1 WHERE id = ?`
	_, err := d.db.Exec(query, authKey, id)
	return err
}

func (d *DB) Exists(id string) (bool, error) {
	query := `SELECT COUNT(*) FROM files WHERE id = ?`
	var count int
	err := d.db.QueryRow(query, id).Scan(&count)
	return count > 0, err
}

func (d *DB) CleanupExpired() error {
	now := time.Now().Unix()

	// First, get all expired file IDs
	query := `SELECT id FROM files WHERE expires_at < ?`
	rows, err := d.db.Query(query, now)
	if err != nil {
		return err
	}
	defer rows.Close()

	var expiredIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		expiredIDs = append(expiredIDs, id)
	}

	// Delete files from disk
	for _, id := range expiredIDs {
		DeleteFile(d.fileDir, id) // Ignore errors, file might already be deleted
	}

	// Delete database entries
	deleteQuery := `DELETE FROM files WHERE expires_at < ?`
	_, err = d.db.Exec(deleteQuery, now)
	return err
}

// GetFilesExpiringWithin returns file IDs and expiration times for files expiring within the given duration
func (d *DB) GetFilesExpiringWithin(duration time.Duration) ([]struct {
	ID        string
	ExpiresAt int64
}, error) {
	now := time.Now().Unix()
	until := now + int64(duration.Seconds())

	query := `SELECT id, expires_at FROM files WHERE expires_at > ? AND expires_at <= ?`
	rows, err := d.db.Query(query, now, until)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []struct {
		ID        string
		ExpiresAt int64
	}
	for rows.Next() {
		var f struct {
			ID        string
			ExpiresAt int64
		}
		if err := rows.Scan(&f.ID, &f.ExpiresAt); err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return files, rows.Err()
}

// Helper functions

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}

func intToBool(i int) bool {
	return i != 0
}

func nullIfEmpty(s string) interface{} {
	if s == "" {
		return nil
	}
	return s
}

// Filesystem operations for files

// SaveFile saves uploaded data to disk
func SaveFile(fileDir, id string, data io.Reader) error {
	filePath := filepath.Join(fileDir, id)
	f, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = io.Copy(f, data)
	return err
}

// GetFileSize returns the size of a file
func GetFileSize(fileDir, id string) (int64, error) {
	filePath := filepath.Join(fileDir, id)
	info, err := os.Stat(filePath)
	if err != nil {
		return 0, err
	}
	return info.Size(), nil
}

// OpenFile opens a file for reading
func OpenFile(fileDir, id string) (*os.File, error) {
	filePath := filepath.Join(fileDir, id)
	return os.Open(filePath)
}

// DeleteFile deletes a file from disk
func DeleteFile(fileDir, id string) error {
	filePath := filepath.Join(fileDir, id)
	return os.Remove(filePath)
}

// FileExists checks if a file exists on disk
func FileExists(fileDir, id string) bool {
	filePath := filepath.Join(fileDir, id)
	_, err := os.Stat(filePath)
	return err == nil
}
