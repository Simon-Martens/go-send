package storage

import (
	"io"
	"os"
	"path/filepath"
	"time"
)

// FileMetadata represents a file record in the database
type FileMetadata struct {
	ID          string
	OwnerToken  string
	Metadata    string // base64 encrypted metadata
	AuthKey     string // base64 auth verifier
	Nonce       string // base64 nonce
	DlLimit     int
	DlCount     int
	Password    bool
	CreatedAt   int64
	ExpiresAt   int64
}

// Database operations for files

func (d *DB) CreateFile(meta *FileMetadata) error {
	query := `
		INSERT INTO files (
			id, owner_token, metadata, auth_key, nonce,
			dl_limit, dl_count, password, created_at, expires_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

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
	)

	return err
}

func (d *DB) GetFile(id string) (*FileMetadata, error) {
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at
		FROM files
		WHERE id = ?
	`

	meta := &FileMetadata{}
	var password int

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
	)

	if err != nil {
		return nil, err
	}

	meta.Password = intToBool(password)
	return meta, nil
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
func (d *DB) GetFilesExpiringWithin(duration time.Duration) ([]struct{ ID string; ExpiresAt int64 }, error) {
	now := time.Now().Unix()
	until := now + int64(duration.Seconds())

	query := `SELECT id, expires_at FROM files WHERE expires_at > ? AND expires_at <= ?`
	rows, err := d.db.Query(query, now, until)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []struct{ ID string; ExpiresAt int64 }
	for rows.Next() {
		var f struct{ ID string; ExpiresAt int64 }
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
