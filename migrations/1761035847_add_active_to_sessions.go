package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1761035847_add_active_to_sessions", up_1761035847_add_active_to_sessions, down_1761035847_add_active_to_sessions)
}

func up_1761035847_add_active_to_sessions(app *core.App) error {
	statements := []string{
		`ALTER TABLE sessions ADD COLUMN active INTEGER DEFAULT 1`,
		`CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(active)`,
	}

	for _, stmt := range statements {
		if _, err := app.DB.DB().Exec(stmt); err != nil {
			return err
		}
	}

	app.Logger.Info("Added active column to sessions table with default=1 for existing sessions")
	return nil
}

func down_1761035847_add_active_to_sessions(app *core.App) error {
	app.Logger.Warn("Rollback for 1761035847_add_active_to_sessions not implemented (SQLite limitation)")
	return nil
}
