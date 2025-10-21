package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1761025845_add_recipient_table", up_1761025845_add_recipient_table, down_1761025845_add_recipient_table)
}

func up_1761025845_add_recipient_table(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS recipient (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		file_id TEXT NOT NULL,
		secret_ciphertext TEXT NOT NULL,
		secret_ephemeral_pub TEXT NOT NULL,
		secret_nonce TEXT NOT NULL,
		secret_version INTEGER DEFAULT 0,
		FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_recipient_user_id ON recipient(user_id);
	CREATE INDEX IF NOT EXISTS idx_recipient_file_id ON recipient(file_id);
	`

	_, err := app.DB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created recipient table and indexes")
	return nil
}

func down_1761025845_add_recipient_table(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS recipient`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped recipient table")
	return nil
}
