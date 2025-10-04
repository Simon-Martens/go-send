package migrations

import (
	"database/sql"
	"fmt"
	"sort"
	"time"

	"github.com/Simon-Martens/go-send/core"
)

type Migration struct {
	ID   string
	Up   func(*core.App) error
	Down func(*core.App) error
}

var registry = make(map[string]*Migration)

func Register(id string, up func(*core.App) error, down func(*core.App) error) {
	if _, exists := registry[id]; exists {
		panic(fmt.Sprintf("Migration %s already registered", id))
	}
	registry[id] = &Migration{
		ID:   id,
		Up:   up,
		Down: down,
	}
}

func ensureMigrationsTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS migrations (
			id TEXT PRIMARY KEY,
			applied_at INTEGER NOT NULL
		)
	`)
	return err
}

func getAppliedMigrations(db *sql.DB) (map[string]bool, error) {
	applied := make(map[string]bool)

	// Query to get applied migrations
	rows, err := db.Query(`SELECT id FROM migrations ORDER BY applied_at`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		applied[id] = true
	}

	return applied, rows.Err()
}

func RunPending(app *core.App) error {
	logger := app.Logger

	if err := ensureMigrationsTable(app.DB.DB()); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	applied, err := getAppliedMigrations(app.DB.DB())
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	var ids []string
	for id := range registry {
		if !applied[id] {
			ids = append(ids, id)
		}
	}
	sort.Strings(ids)

	if len(ids) == 0 {
		logger.Info("No pending migrations")
		return nil
	}

	logger.Info("Running pending migrations", "count", len(ids))

	for _, id := range ids {
		migration := registry[id]
		logger.Info("Applying migration", "migration_id", id)

		if err := migration.Up(app); err != nil {
			logger.Error("Migration failed", "migration_id", id, "error", err)
			return fmt.Errorf("migration %s failed: %w", id, err)
		}

		_, err := app.DB.DB().Exec(
			"INSERT INTO migrations (id, applied_at) VALUES (?, ?)",
			id,
			time.Now().Unix(),
		)
		if err != nil {
			logger.Error("Failed to record migration", "migration_id", id, "error", err)
			return fmt.Errorf("failed to record migration %s: %w", id, err)
		}

		logger.Info("Migration applied successfully", "migration_id", id)
	}

	return nil
}

func Rollback(app *core.App, count int) error {
	logger := app.Logger

	if err := ensureMigrationsTable(app.DB.DB()); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	rows, err := app.DB.DB().Query(`SELECT id FROM migrations ORDER BY applied_at DESC LIMIT ?`, count)
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}
	defer rows.Close()

	var toRollback []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return fmt.Errorf("failed to scan migration: %w", err)
		}
		toRollback = append(toRollback, id)
	}

	if err := rows.Err(); err != nil {
		return fmt.Errorf("error iterating migrations: %w", err)
	}

	if len(toRollback) == 0 {
		logger.Info("No migrations to rollback")
		return nil
	}

	logger.Info("Rolling back migrations", "count", len(toRollback))

	for _, id := range toRollback {
		migration, exists := registry[id]
		if !exists {
			logger.Error("Migration not found in registry", "migration_id", id)
			return fmt.Errorf("migration %s not found in registry", id)
		}

		logger.Info("Rolling back migration", "migration_id", id)

		if err := migration.Down(app); err != nil {
			logger.Error("Migration rollback failed", "migration_id", id, "error", err)
			return fmt.Errorf("rollback of migration %s failed: %w", id, err)
		}

		// Remove migration record
		_, err := app.DB.DB().Exec("DELETE FROM migrations WHERE id = ?", id)
		if err != nil {
			logger.Error("Failed to remove migration record", "migration_id", id, "error", err)
			return fmt.Errorf("failed to remove migration record %s: %w", id, err)
		}

		logger.Info("Migration rolled back successfully", "migration_id", id)
	}

	return nil
}

func Status(app *core.App) error {
	logger := app.Logger

	if err := ensureMigrationsTable(app.DB.DB()); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	applied, err := getAppliedMigrations(app.DB.DB())
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	var allIds []string
	for id := range registry {
		allIds = append(allIds, id)
	}
	sort.Strings(allIds)

	logger.Info("Migration Status", "total_migrations", len(allIds), "applied", len(applied))

	for _, id := range allIds {
		status := "pending"
		if applied[id] {
			status = "applied"
		}
		logger.Info("Migration", "migration_id", id, "status", status)
	}

	return nil
}
