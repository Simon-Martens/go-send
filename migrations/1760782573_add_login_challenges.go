package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760782573_add_login_challenges", up1760782573AddLoginChallenges, down1760782573AddLoginChallenges)
}

func up1760782573AddLoginChallenges(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS login_challenges (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		nonce TEXT NOT NULL,
		expires INTEGER NOT NULL,
		used INTEGER NOT NULL DEFAULT 0,
		created INTEGER NOT NULL,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_login_challenges_user ON login_challenges(user_id);
	CREATE INDEX IF NOT EXISTS idx_login_challenges_expires ON login_challenges(expires);
	`

	_, err := app.DB.DB().Exec(schema)
	return err
}

func down1760782573AddLoginChallenges(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS login_challenges`)
	return err
}
