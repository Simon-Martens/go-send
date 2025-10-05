package migrations

import (
	"database/sql"
	"time"

	"github.com/Simon-Martens/go-send/core"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	Register("1709990000_upload_guard_auth", up_1709990000_upload_guard_auth, down_1709990000_upload_guard_auth)
}

func up_1709990000_upload_guard_auth(app *core.App) error {
	schema := `
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at INTEGER,
        username TEXT,
        max_uses INTEGER NOT NULL DEFAULT 1,
        use_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        created_by_admin_id INTEGER,
        FOREIGN KEY(created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_auth_links_token_hash ON auth_links(token_hash);
    CREATE INDEX IF NOT EXISTS idx_auth_links_expires_at ON auth_links(expires_at);

    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_hash TEXT NOT NULL UNIQUE,
        user_type TEXT NOT NULL,
        admin_id INTEGER,
        link_id INTEGER,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY(link_id) REFERENCES auth_links(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `

	if _, err := app.DB.DB().Exec(schema); err != nil {
		return err
	}

	if hasAdmins(app.DB.DB()) {
		return nil
	}

	defaultPasswordHash, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = app.DB.DB().Exec(
		"INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
		"admin",
		string(defaultPasswordHash),
		time.Now().Unix(),
	)
	if err == nil {
		app.Logger.Info("Created default admin user with username 'admin'")
	}
	return err
}

func hasAdmins(db *sql.DB) bool {
	var count int
	if err := db.QueryRow("SELECT COUNT(*) FROM admins").Scan(&count); err != nil {
		return false
	}
	return count > 0
}

func down_1709990000_upload_guard_auth(app *core.App) error {
	statements := []string{
		"DROP TABLE IF EXISTS sessions",
		"DROP TABLE IF EXISTS auth_links",
		"DROP TABLE IF EXISTS admins",
	}

	for _, stmt := range statements {
		if _, err := app.DB.DB().Exec(stmt); err != nil {
			return err
		}
	}
	return nil
}
