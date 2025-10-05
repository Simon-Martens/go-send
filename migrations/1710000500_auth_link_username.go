package migrations

import "github.com/Simon-Martens/go-send/core"

func init() {
	Register("1710000500_auth_link_username", up_1710000500_auth_link_username, down_1710000500_auth_link_username)
}

func up_1710000500_auth_link_username(app *core.App) error {
	_, err := app.DB.DB().Exec(`ALTER TABLE auth_links ADD COLUMN username TEXT`)
	return err
}

func down_1710000500_auth_link_username(app *core.App) error {
	// SQLite does not support dropping columns directly.
	// Recreating the table would risk data loss, so we leave the column in place.
	return nil
}
