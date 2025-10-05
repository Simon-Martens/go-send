package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1710000600_auth_link_token_preview", up_1710000600_auth_link_token_preview, down_1710000600_auth_link_token_preview)
}

func up_1710000600_auth_link_token_preview(app *core.App) error {
	if exists, err := columnExists(app.DB.DB(), "auth_links", "token_preview"); err != nil {
		return err
	} else if exists {
		return nil
	}

	_, err := app.DB.DB().Exec(`ALTER TABLE auth_links ADD COLUMN token_preview TEXT`)
	return err
}

func down_1710000600_auth_link_token_preview(app *core.App) error {
	// Leave column in place to avoid data loss during downgrade.
	return nil
}
