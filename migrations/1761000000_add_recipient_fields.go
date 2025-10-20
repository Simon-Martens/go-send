package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1761000000_add_owner_recipient_fields", up_1761000000_add_owner_recipient_fields, down_1761000000_add_owner_recipient_fields)
}

func up_1761000000_add_owner_recipient_fields(app *core.App) error {
	statements := []string{
		// Rename user_id to owner_user_id (the person who uploaded - has metadata access)
		`ALTER TABLE files RENAME COLUMN user_id TO owner_user_id`,
		// Add owner_auth_token_id for guest uploads with auth links
		`ALTER TABLE files ADD COLUMN owner_auth_token_id INTEGER`,
		// Add recipient fields (person file is encrypted FOR - optional)
		`ALTER TABLE files ADD COLUMN recipient_user_id INTEGER`,
		`ALTER TABLE files ADD COLUMN recipient_secret_ciphertext TEXT`,
		`ALTER TABLE files ADD COLUMN recipient_secret_ephemeral_pub TEXT`,
		`ALTER TABLE files ADD COLUMN recipient_secret_nonce TEXT`,
		`ALTER TABLE files ADD COLUMN recipient_secret_version INTEGER DEFAULT 0`,
		// Add indexes
		`CREATE INDEX IF NOT EXISTS idx_files_owner_auth_token_id ON files(owner_auth_token_id)`,
		`CREATE INDEX IF NOT EXISTS idx_files_recipient_user_id ON files(recipient_user_id)`,
	}

	for _, stmt := range statements {
		if _, err := app.DB.DB().Exec(stmt); err != nil {
			return err
		}
	}

	app.Logger.Info("Added owner and recipient tracking fields to files table")
	return nil
}

func down_1761000000_add_owner_recipient_fields(app *core.App) error {
	app.Logger.Warn("Rollback for 1761000000_add_owner_recipient_fields not implemented (SQLite limitation)")
	return nil
}
