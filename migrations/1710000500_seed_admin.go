package migrations

import (
	"time"

	"github.com/Simon-Martens/go-send/core"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	Register("1710000500_seed_admin", up_1710000500_seed_admin, down_1710000500_seed_admin)
}

func up_1710000500_seed_admin(app *core.App) error {
	hash, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = app.DB.DB().Exec(
		`INSERT OR IGNORE INTO admins (username, password_hash, created_at)
         VALUES (?, ?, ?)`,
		"admin",
		string(hash),
		time.Now().Unix(),
	)
	if err != nil {
		return err
	}

	app.Logger.Info("Created default admin user")
	return nil
}

func down_1710000500_seed_admin(app *core.App) error {
	_, err := app.DB.DB().Exec(`DELETE FROM admins WHERE username = ?`, "admin")
	if err != nil {
		return err
	}

	app.Logger.Info("Removed default admin user")
	return nil
}
