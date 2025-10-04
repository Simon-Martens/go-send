# Migrations

This directory contains database migrations for go-send.

## Creating a New Migration

1. Create a new file with the naming pattern: `{unix_timestamp}_{description}.go`
2. Use the current Unix timestamp for ordering (you can get it with `date +%s`)
3. Implement `Up` and `Down` functions
4. Register the migration in the `init()` function

### Example Migration

```go
package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1704067300_add_user_column", up_1704067300_add_user_column, down_1704067300_add_user_column)
}

func up_1704067300_add_user_column(app *core.App) error {
	_, err := app.DB.DB().Exec(`
		ALTER TABLE files ADD COLUMN user_id TEXT DEFAULT NULL
	`)
	if err != nil {
		return err
	}

	app.Logger.Info("Added user_id column to files table")
	return nil
}

func down_1704067300_add_user_column(app *core.App) error {
	// SQLite doesn't support DROP COLUMN easily, so we'd need to recreate the table
	// For this example, we'll just show the concept
	app.Logger.Warn("Rollback for user_id column not implemented (SQLite limitation)")
	return nil
}
```

## Running Migrations

Migrations are automatically run on server startup. The system tracks which migrations have been applied in the `migrations` table.

## Migration Naming Convention

- **Format**: `{unix_timestamp}_{snake_case_description}.go`
- **Example**: `1704067200_initial_schema.go`
- **Timestamp**: Use Unix epoch seconds (e.g., `date +%s`)
- **Description**: Brief, lowercase, underscore-separated description

## Important Notes

- Migrations run in **alphabetical order** (by filename)
- Each migration is only run **once**
- The `migrations` table tracks applied migrations
- Use `app.Logger` for structured logging within migrations
- Always provide both `Up` and `Down` functions
- Test your migrations thoroughly before deploying

## Available Functions

- `migrations.RunPending(app)` - Run all pending migrations
- `migrations.Rollback(app, count)` - Rollback the last N migrations
- `migrations.Status(app)` - Show migration status
