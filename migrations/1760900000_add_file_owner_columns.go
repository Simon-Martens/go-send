package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760900000_add_file_owner_columns", up_1760900000_add_file_owner_columns, down_1760900000_add_file_owner_columns)
}

func up_1760900000_add_file_owner_columns(app *core.App) error {
	statements := []string{
		`ALTER TABLE files ADD COLUMN user_id INTEGER`,
		`ALTER TABLE files ADD COLUMN secret_ciphertext TEXT`,
		`ALTER TABLE files ADD COLUMN secret_ephemeral_pub TEXT`,
		`ALTER TABLE files ADD COLUMN secret_nonce TEXT`,
		`ALTER TABLE files ADD COLUMN secret_version INTEGER DEFAULT 0`,
		`CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id)`,
	}

	for _, stmt := range statements {
		if _, err := app.DB.DB().Exec(stmt); err != nil {
			return err
		}
	}

	app.Logger.Info("Added owner and wrapped secret columns to files table")
	return nil
}

func down_1760900000_add_file_owner_columns(app *core.App) error {
	app.Logger.Warn("Rollback for 1760900000_add_file_owner_columns not implemented (SQLite limitation)")
	return nil
}
