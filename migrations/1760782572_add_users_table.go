package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760782572_add_users_table", up_1760782572_add_users_table, down_1760782572_add_users_table)
}

func up_1760782572_add_users_table(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		salt TEXT NOT NULL,
		active INTEGER NOT NULL DEFAULT 1,
		public_key TEXT NOT NULL,
		created INTEGER NOT NULL,
		updated INTEGER NOT NULL,
		settings TEXT DEFAULT '{}',
		role INTEGER NOT NULL DEFAULT 1
	);

	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
	`

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created users table and indexes")
	return nil
}

func down_1760782572_add_users_table(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS users`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped users table")
	return nil
}
