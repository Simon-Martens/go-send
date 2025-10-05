package migrations

import (
	"time"

	"github.com/Simon-Martens/go-send/core"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	Register("1710000600_seed_ulrich_admin", up_1710000600_seed_ulrich_admin, down_1710000600_seed_ulrich_admin)
}

func up_1710000600_seed_ulrich_admin(app *core.App) error {
	hash, err := bcrypt.GenerateFromPassword([]byte("test"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = app.DB.DB().Exec(
		`INSERT OR IGNORE INTO admins (username, password_hash, created_at)
         VALUES (?, ?, ?)`,
		"ulrich",
		string(hash),
		time.Now().Unix(),
	)
	if err != nil {
		return err
	}

	app.Logger.Info("Created ulrich test admin user")
	return nil
}

func down_1710000600_seed_ulrich_admin(app *core.App) error {
	_, err := app.DB.DB().Exec(`DELETE FROM admins WHERE username = ?`, "ulrich")
	if err != nil {
		return err
	}

	app.Logger.Info("Removed ulrich test admin user")
	return nil
}
