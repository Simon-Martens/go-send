package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1760787762_create_request_logs", up_1760787762_create_request_logs, down_1760787762_create_request_logs)
}

func up_1760787762_create_request_logs(app *core.App) error {
	schema := `
	CREATE TABLE IF NOT EXISTS request_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp INTEGER NOT NULL,
		method TEXT NOT NULL,
		url TEXT NOT NULL,
		status_code INTEGER NOT NULL,
		request_data TEXT DEFAULT '{}',
		user_id INTEGER,
		error TEXT DEFAULT '{}'
	);

	CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp);
	CREATE INDEX IF NOT EXISTS idx_request_logs_method ON request_logs(method);
	CREATE INDEX IF NOT EXISTS idx_request_logs_status_code ON request_logs(status_code);
	CREATE INDEX IF NOT EXISTS idx_request_logs_user_id ON request_logs(user_id);
	CREATE INDEX IF NOT EXISTS idx_request_logs_path ON request_logs(url);
	`

	_, err := app.LogDB.DB().Exec(schema)
	if err != nil {
		return err
	}

	app.Logger.Info("Created request_logs table and indexes in log database")
	return nil
}

func down_1760787762_create_request_logs(app *core.App) error {
	_, err := app.LogDB.DB().Exec(`DROP TABLE IF EXISTS request_logs`)
	if err != nil {
		return err
	}

	app.Logger.Info("Dropped request_logs table from log database")
	return nil
}
