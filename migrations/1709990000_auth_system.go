package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1709990000_auth_system", up_1709990000_auth_system, down_1709990000_auth_system)
}

func up_1709990000_auth_system(app *core.App) error {
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
        token_preview TEXT,
        active INTEGER DEFAULT 0,
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
        FOREIGN KEY(link_id) REFERENCES auth_links(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created auth system tables and indexes")
	return nil
}

func down_1709990000_auth_system(app *core.App) error {
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

	app.Logger.Info("Dropped auth system tables")
	return nil
}
