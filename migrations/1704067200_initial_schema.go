package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1704067200_initial_schema", up_1704067200_initial_schema, down_1704067200_initial_schema)
}

func up_1704067200_initial_schema(app *core.App) error {
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

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created files table and indexes")
	return nil
}

func down_1704067200_initial_schema(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS files`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped files table")
	return nil
}
