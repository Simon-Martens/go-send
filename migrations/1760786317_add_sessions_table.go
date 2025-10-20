package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760786317_add_sessions_table", up_1760786317_add_sessions_table, down_1760786317_add_sessions_table)
}

func up_1760786317_add_sessions_table(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS sessions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		token TEXT NOT NULL UNIQUE,
		last_seen INTEGER NOT NULL,
		last_ip TEXT NOT NULL,
		expires_at INTEGER NOT NULL,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		ephemeral INTEGER DEFAULT 0,
		user_id INTEGER DEFAULT NULL,
		auth_token_id INTEGER DEFAULT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY (auth_token_id) REFERENCES authtokens(id) ON DELETE CASCADE,
		CHECK ((user_id IS NOT NULL AND auth_token_id IS NULL) OR (user_id IS NULL AND auth_token_id IS NOT NULL))
	);

	CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
	CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
	CREATE INDEX IF NOT EXISTS idx_sessions_auth_token_id ON sessions(auth_token_id);
	CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
	CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen);
	`

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created sessions table and indexes")
	return nil
}

func down_1760786317_add_sessions_table(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS sessions`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped sessions table")
	return nil
}
