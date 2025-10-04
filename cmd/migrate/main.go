package main

import (
	"embed"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/migrations"
	"github.com/Simon-Martens/go-send/storage"

	// Import migrations to register them
	_ "github.com/Simon-Martens/go-send/migrations"
)

//go:embed dummy
var _ embed.FS

func main() {
	var (
		action = flag.String("action", "up", "Migration action: up, down, status")
		count  = flag.Int("count", 1, "Number of migrations to rollback (for down action)")
	)
	flag.Parse()

	// Load configuration
	cfg := config.Load()

	// Initialize logger
	logger := config.InitLogger(cfg.Environment)
	slog.SetDefault(logger)

	logger.Info("Migration tool starting", "action", *action)

	// Initialize database
	db, err := storage.NewDB(config.DB_PATH)
	if err != nil {
		logger.Error("Failed to initialize database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// Create minimal app instance (without template/manifest)
	app := core.NewApp(db, cfg, nil, nil, logger)

	// Execute migration action
	switch *action {
	case "up":
		logger.Info("Running pending migrations")
		if err := migrations.RunPending(app); err != nil {
			logger.Error("Migration failed", "error", err)
			os.Exit(1)
		}
		logger.Info("Migrations completed successfully")

	case "down":
		if *count < 1 {
			logger.Error("Count must be at least 1")
			os.Exit(1)
		}
		logger.Info("Rolling back migrations", "count", *count)
		if err := migrations.Rollback(app, *count); err != nil {
			logger.Error("Rollback failed", "error", err)
			os.Exit(1)
		}
		logger.Info("Rollback completed successfully")

	case "status":
		logger.Info("Checking migration status")
		if err := migrations.Status(app); err != nil {
			logger.Error("Status check failed", "error", err)
			os.Exit(1)
		}

	default:
		logger.Error("Invalid action", "action", *action)
		fmt.Println("Usage: migrate -action=<up|down|status> [-count=N]")
		os.Exit(1)
	}
}
