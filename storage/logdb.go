package storage

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

// LogDB represents the logging database connection
type LogDB struct {
	db *sql.DB
}

// DB returns the underlying sql.DB for migrations and other low-level operations
func (l *LogDB) DB() *sql.DB {
	return l.db
}

// NewLogDB creates a new logging database connection with optimized SQLite settings
func NewLogDB(dbPath string) (*LogDB, error) {
	pragmas := "?_pragma=busy_timeout(10000)&_pragma=journal_mode(WAL)&_pragma=journal_size_limit(200000000)&_pragma=synchronous(NORMAL)&_pragma=foreign_keys(ON)&_pragma=temp_store(MEMORY)&_pragma=cache_size(-16000)"
	dsn := dbPath + pragmas

	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, err
	}

	// Schema creation is handled by migrations
	return &LogDB{db: db}, nil
}

// Ping checks if the database connection is alive
func (l *LogDB) Ping() error {
	return l.db.Ping()
}

// Close closes the database connection
func (l *LogDB) Close() error {
	return l.db.Close()
}
