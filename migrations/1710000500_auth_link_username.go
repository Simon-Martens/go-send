package migrations

import (
	"database/sql"

	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1710000500_auth_link_username", up_1710000500_auth_link_username, down_1710000500_auth_link_username)
}

func up_1710000500_auth_link_username(app *core.App) error {
	if exists, err := columnExists(app.DB.DB(), "auth_links", "username"); err != nil {
		return err
	} else if exists {
		return nil
	}

	_, err := app.DB.DB().Exec(`ALTER TABLE auth_links ADD COLUMN username TEXT`)
	return err
}

func down_1710000500_auth_link_username(app *core.App) error {
	// SQLite does not support dropping columns directly.
	// Recreating the table would risk data loss, so we leave the column in place.
	return nil
}

func columnExists(db *sql.DB, table, column string) (bool, error) {
	rows, err := db.Query(`PRAGMA table_info(` + table + `)`)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	for rows.Next() {
		var name string
		var discard interface{}
		if err := rows.Scan(&discard, &name, &discard, &discard, &discard, &discard); err != nil {
			return false, err
		}

		if name == column {
			return true, nil
		}
	}

	return false, rows.Err()
}
