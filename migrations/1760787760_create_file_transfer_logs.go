package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760787760_create_file_transfer_logs", up_1760787760_create_file_transfer_logs, down_1760787760_create_file_transfer_logs)
}

func up_1760787760_create_file_transfer_logs(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS file_transfer_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		event_type TEXT NOT NULL,
		file_id TEXT,
		timestamp INTEGER NOT NULL,
		request_data TEXT DEFAULT '{}',
		status_code INTEGER,
		error TEXT DEFAULT '{}',
		user_id INTEGER,
		session_id INTEGER,
		duration_ms INTEGER
	);

	CREATE INDEX IF NOT EXISTS idx_file_transfer_logs_timestamp ON file_transfer_logs(timestamp);
	CREATE INDEX IF NOT EXISTS idx_file_transfer_logs_event_type ON file_transfer_logs(event_type);
	CREATE INDEX IF NOT EXISTS idx_file_transfer_logs_file_id ON file_transfer_logs(file_id);
	CREATE INDEX IF NOT EXISTS idx_file_transfer_logs_user_id ON file_transfer_logs(user_id);
	CREATE INDEX IF NOT EXISTS idx_file_transfer_logs_status_code ON file_transfer_logs(status_code);
	`

	_, err := app.LogDB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created file_transfer_logs table and indexes in log database")
	return nil
}

func down_1760787760_create_file_transfer_logs(app *core.App) error {
	_, err := app.LogDB.DB().Exec(`DROP TABLE IF EXISTS file_transfer_logs`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped file_transfer_logs table from log database")
	return nil
}
