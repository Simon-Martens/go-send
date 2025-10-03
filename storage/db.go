package storage

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	db *sql.DB
}

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

func NewDB(dbPath string) (*DB, error) {
	pragmas := "?_pragma=busy_timeout(10000)&_pragma=journal_mode(WAL)&_pragma=journal_size_limit(200000000)&_pragma=synchronous(NORMAL)&_pragma=foreign_keys(ON)&_pragma=temp_store(MEMORY)&_pragma=cache_size(-16000)"
	dsn := dbPath + pragmas

	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, err
	}

	// Create schema
	schema := `
	CREATE TABLE IF NOT EXISTS files (
		id TEXT PRIMARY KEY,
		owner_token TEXT NOT NULL,
		metadata TEXT NOT NULL,
		auth_key TEXT NOT NULL,
		nonce TEXT NOT NULL,
		dl_limit INTEGER NOT NULL,
		dl_count INTEGER DEFAULT 0,
		password INTEGER DEFAULT 0,
		created_at INTEGER NOT NULL,
		expires_at INTEGER NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_expires ON files(expires_at);
	`

	if _, err := db.Exec(schema); err != nil {
		return nil, err
	}

	return &DB{db: db}, nil
}

func (d *DB) Ping() error {
	return d.db.Ping()
}

func (d *DB) Close() error {
	return d.db.Close()
}

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

func (d *DB) DeleteFile(id string) error {
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
		DeleteFile(id) // Ignore errors, file might already be deleted
	}

	// Delete database entries
	deleteQuery := `DELETE FROM files WHERE expires_at < ?`
	_, err = d.db.Exec(deleteQuery, now)
	return err
}

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}

func intToBool(i int) bool {
	return i != 0
}
