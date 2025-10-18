package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760783466_add_authtokens_table", up_1760783466_add_authtokens_table, down_1760783466_add_authtokens_table)
}

func up_1760783466_add_authtokens_table(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS authtokens (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		token TEXT NOT NULL UNIQUE,
		expires INTEGER NOT NULL DEFAULT 0,
		expires_at INTEGER DEFAULT NULL,
		expires_in INTEGER DEFAULT NULL,
		name TEXT DEFAULT '',
		description TEXT DEFAULT '',
		preview TEXT NOT NULL,
		active INTEGER NOT NULL DEFAULT 1,
		type INTEGER NOT NULL,
		created INTEGER NOT NULL,
		created_by INTEGER NOT NULL,
		FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_authtokens_token ON authtokens(token);
	CREATE INDEX IF NOT EXISTS idx_authtokens_type ON authtokens(type);
	CREATE INDEX IF NOT EXISTS idx_authtokens_created_by ON authtokens(created_by);
	CREATE INDEX IF NOT EXISTS idx_authtokens_active ON authtokens(active);
	CREATE INDEX IF NOT EXISTS idx_authtokens_expires_at ON authtokens(expires_at);
	`

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created authtokens table and indexes")
	return nil
}

func down_1760783466_add_authtokens_table(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS authtokens`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped authtokens table")
	return nil
}
