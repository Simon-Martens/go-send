package main

import (
	"embed"
	"log/slog"
	"os"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/migrations"
	"github.com/Simon-Martens/go-send/server"
	"github.com/Simon-Martens/go-send/storage"

	// Import migrations to register them
	_ "github.com/Simon-Martens/go-send/migrations"
)

//go:embed frontend/templates/*
var templatesFS embed.FS

//go:embed frontend/dist
var distFS embed.FS

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize logger
	logger := config.InitLogger(cfg.Environment)
	slog.SetDefault(logger) // Set as default logger for the application

	logger.Info("Starting go-send server", "environment", cfg.Environment)
	logger.Info("User frontend directory configured", "directory", cfg.UserFrontendDir)
	logger.Debug("Custom templates location", "path", cfg.UserFrontendDir+"/templates/")
	logger.Debug("Custom static files location", "path", cfg.UserFrontendDir+"/public/")

	// Initialize database
	db, err := storage.NewDB(config.DB_PATH)
	if err != nil {
		logger.Error("Failed to initialize database", "error", err)
		os.Exit(1)
	}

	// Load templates (user overrides or embedded)
	tmpl, err := core.LoadTemplates(templatesFS, cfg.UserFrontendDir, logger)
	if err != nil {
		logger.Error("Failed to load templates", "error", err)
		os.Exit(1)
	}

	// Load manifest
	manifest := core.LoadManifest(distFS, logger)

	// Create app instance
	app := core.NewApp(db, cfg, tmpl, manifest, logger)

	// Run database migrations
	logger.Info("Running database migrations")
	if err := migrations.RunPending(app); err != nil {
		logger.Error("Failed to run migrations", "error", err)
		os.Exit(1)
	}

	// Create uploads directory from config
	if err := os.MkdirAll(cfg.FileDir, 0o755); err != nil {
		logger.Error("Failed to create uploads directory", "directory", cfg.FileDir, "error", err)
		os.Exit(1)
	}

	// Clean up expired files on startup (for files that expired while server was down)
	logger.Info("Cleaning up expired files on startup")
	if err := db.CleanupExpired(); err != nil {
		logger.Warn("Failed to cleanup expired files", "error", err)
	}

	// Start cleanup scheduler
	app.StartCleanupScheduler()

	// Create and start server
	srv := server.New(app, distFS)
	logger.Error("Server stopped", "error", server.Start(srv, app))
	os.Exit(1)
}
