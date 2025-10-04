# Database Migrations

go-send uses a custom migration system to manage database schema changes and data transformations.

## Overview

- Migrations are Go files in the `migrations/` directory
- Each migration has `Up` (apply) and `Down` (rollback) functions
- Migrations execute in **alphabetical order** by filename
- Applied migrations are tracked in the `migrations` table
- Migrations run automatically on server startup

## Creating a Migration

### 1. Generate a timestamp

```bash
date +%s
# Output: 1704067200
```

### 2. Create the migration file

Create a new file: `migrations/{timestamp}_{description}.go`

```go
package migrations

import (
	"github.com/Simon-Martens/go-send/core"
)

func init() {
	Register("1704067500_add_custom_field", up_1704067500_add_custom_field, down_1704067500_add_custom_field)
}

func up_1704067500_add_custom_field(app *core.App) error {
	_, err := app.DB.DB().Exec(`
		ALTER TABLE files ADD COLUMN custom_field TEXT DEFAULT NULL
	`)
	if err != nil {
		return err
	}

	app.Logger.Info("Added custom_field column to files table")
	return nil
}

func down_1704067500_add_custom_field(app *core.App) error {
	// Note: SQLite has limited ALTER TABLE support
	// Dropping columns requires recreating the table
	app.Logger.Warn("Rollback not implemented for custom_field (SQLite limitation)")
	return nil
}
```

### 3. The migration runs automatically

On next server startup, the migration will run automatically.

## Migration Naming Convention

**Format**: `{unix_timestamp}_{description}.go`

- **Timestamp**: Unix epoch seconds (e.g., `1704067200`)
- **Description**: Snake_case description (e.g., `add_user_table`)
- **Example**: `1704067200_initial_schema.go`

**Why timestamps?**
- Ensures chronological ordering
- Avoids conflicts between developers
- Makes it clear when migration was created

## Using the Migration CLI

A standalone migration tool is available for manual operations:

```bash
# Build the migration tool
go build -o bin/migrate ./cmd/migrate

# Run pending migrations
./bin/migrate -action=up

# Rollback last migration
./bin/migrate -action=down -count=1

# Rollback last 3 migrations
./bin/migrate -action=down -count=3

# Check migration status
./bin/migrate -action=status
```

## Migration Patterns

### Adding a Column

```go
func up(app *core.App) error {
	_, err := app.DB.DB().Exec(`
		ALTER TABLE files ADD COLUMN new_column TEXT DEFAULT NULL
	`)
	return err
}
```

### Creating an Index

```go
func up(app *core.App) error {
	_, err := app.DB.DB().Exec(`
		CREATE INDEX IF NOT EXISTS idx_files_new_column ON files(new_column)
	`)
	return err
}

func down(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP INDEX IF EXISTS idx_files_new_column`)
	return err
}
```

### Creating a New Table

```go
func up(app *core.App) error {
	_, err := app.DB.DB().Exec(`
		CREATE TABLE users (
			id TEXT PRIMARY KEY,
			email TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL
		)
	`)
	return err
}

func down(app *core.App) error {
	_, err := app.DB.DB().Exec(`DROP TABLE IF EXISTS users`)
	return err
}
```

### Data Migration

```go
func up(app *core.App) error {
	// Get all records
	rows, err := app.DB.DB().Query(`SELECT id, old_field FROM files`)
	if err != nil {
		return err
	}
	defer rows.Close()

	// Prepare update statement
	stmt, err := app.DB.DB().Prepare(`UPDATE files SET new_field = ? WHERE id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Transform and update each record
	count := 0
	for rows.Next() {
		var id, oldValue string
		if err := rows.Scan(&id, &oldValue); err != nil {
			return err
		}

		// Transform data
		newValue := transformData(oldValue)

		// Update record
		if _, err := stmt.Exec(newValue, id); err != nil {
			app.Logger.Error("Failed to migrate record", "id", id, "error", err)
			continue
		}
		count++
	}

	app.Logger.Info("Data migration complete", "records_updated", count)
	return nil
}
```

## SQLite Limitations

SQLite has limited `ALTER TABLE` support:

**Not Supported**:
- `DROP COLUMN`
- `ALTER COLUMN` (change type)
- `RENAME COLUMN` (before SQLite 3.25.0)

**Workaround** - Recreate the table:

```go
func up(app *core.App) error {
	tx, err := app.DB.DB().Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Create new table with desired schema
	_, err = tx.Exec(`
		CREATE TABLE files_new (
			id TEXT PRIMARY KEY,
			-- New schema here
		)
	`)
	if err != nil {
		return err
	}

	// Copy data
	_, err = tx.Exec(`
		INSERT INTO files_new SELECT id, ... FROM files
	`)
	if err != nil {
		return err
	}

	// Drop old table
	_, err = tx.Exec(`DROP TABLE files`)
	if err != nil {
		return err
	}

	// Rename new table
	_, err = tx.Exec(`ALTER TABLE files_new RENAME TO files`)
	if err != nil {
		return err
	}

	// Recreate indexes
	_, err = tx.Exec(`CREATE INDEX idx_expires ON files(expires_at)`)
	if err != nil {
		return err
	}

	return tx.Commit()
}
```

## Best Practices

1. **Always test migrations** on a copy of production data
2. **Keep migrations small** and focused on one change
3. **Use transactions** for complex migrations
4. **Log important actions** using `app.Logger`
5. **Handle errors gracefully** - return errors, don't panic
6. **Consider rollback complexity** - some changes can't be easily reversed
7. **Back up before migrating** in production
8. **Test rollback** to ensure `Down` functions work

## Migration Lifecycle

1. **Development**: Create migration file
2. **Registration**: `init()` function registers migration
3. **Startup**: Server runs `migrations.RunPending(app)`
4. **Execution**: Pending migrations run in order
5. **Tracking**: Applied migrations recorded in `migrations` table
6. **Rollback**: Use migrate CLI to rollback if needed

## Troubleshooting

### Migration fails halfway

If a migration fails:
1. Check server logs for the error
2. Fix the migration code
3. Manually rollback using: `./bin/migrate -action=down -count=1`
4. Restart server to rerun the fixed migration

### Migration already applied but not in table

If the `migrations` table is out of sync:
1. Manually check which migrations are actually applied
2. Insert records into the `migrations` table:
   ```sql
   INSERT INTO migrations (id, applied_at) VALUES ('migration_id', 1704067200);
   ```

### Need to skip a migration

To skip a migration without running it:
```sql
INSERT INTO migrations (id, applied_at) VALUES ('migration_id', strftime('%s', 'now'));
```

## Migration Table Schema

```sql
CREATE TABLE migrations (
    id TEXT PRIMARY KEY,        -- Migration ID (filename without .go)
    applied_at INTEGER NOT NULL -- Unix timestamp when applied
);
```

## Examples

See the `migrations/` directory for examples:
- `1704067200_initial_schema.go` - Creates the files table
- `example_1704067300_add_index.go.example` - Adds an index
- `example_1704067400_data_migration.go.example` - Data transformation

To use the examples, remove the `.example` extension and update the timestamp.
