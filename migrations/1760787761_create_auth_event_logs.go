package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760787761_create_auth_event_logs", up_1760787761_create_auth_event_logs, down_1760787761_create_auth_event_logs)
}

func up_1760787761_create_auth_event_logs(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS auth_event_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		event_type TEXT NOT NULL,
		timestamp INTEGER NOT NULL,
		user_id INTEGER,
		auth_token_id INTEGER,
		url TEXT NOT NULL,
		request_data TEXT DEFAULT '{}',
		status_code INTEGER,
		data TEXT DEFAULT '{}'
	);

	CREATE INDEX IF NOT EXISTS idx_auth_event_logs_timestamp ON auth_event_logs(timestamp);
	CREATE INDEX IF NOT EXISTS idx_auth_event_logs_event_type ON auth_event_logs(event_type);
	CREATE INDEX IF NOT EXISTS idx_auth_event_logs_user_id ON auth_event_logs(user_id);
	CREATE INDEX IF NOT EXISTS idx_auth_event_logs_status_code ON auth_event_logs(status_code);
	CREATE INDEX IF NOT EXISTS idx_auth_event_logs_url ON auth_event_logs(url);
	`

	_, err := app.LogDB().DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created auth_event_logs table and indexes in log database")
	return nil
}

func down_1760787761_create_auth_event_logs(app *core.App) error {
	_, err := app.LogDB().DB().Exec(`DROP TABLE IF EXISTS auth_event_logs`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped auth_event_logs table from log database")
	return nil
}
