package main

import (
	"embed"
	"log/slog"
	"os"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/i18n"
	"github.com/Simon-Martens/go-send/migrations"
	"github.com/Simon-Martens/go-send/server"
	"github.com/Simon-Martens/go-send/server/middleware"
	"github.com/Simon-Martens/go-send/storage"

	// INFO: Importing migrations so they are visible
	// and their init functions are called
	_ "github.com/Simon-Martens/go-send/migrations"
)

//go:embed go-send-frontend/templates/*
var templatesFS embed.FS

//go:embed go-send-frontend/dist
var distFS embed.FS

func main() {
	cfg := config.Load()
	logger := config.InitLogger(cfg.Environment)
	slog.SetDefault(logger)
	logger.Info("go-send running", "environment", cfg.Environment)

	// Ensure data directory exists before initializing database
	if err := os.MkdirAll("./data", 0o755); err != nil {
		logger.Error("Failed to create data directory. Exiting", "error", err)
		os.Exit(1)
	}

	db, err := storage.NewDB(config.DB_PATH, cfg.FileDir)
	if err != nil {
		logger.Error("Failed to initialize database. Exiting", "error", err)
		os.Exit(1)
	}

	tmpl, err := core.LoadTemplates(templatesFS, cfg.UserFrontendDir, logger)
	if err != nil {
		logger.Error("Failed to load templates. Exiting", "error", err)
		os.Exit(1)
	}

	// INFO: the manifest is a file to connect request URLs to file names
	manifest := core.LoadManifest(distFS, logger)
	translator, err := i18n.New()
	if err != nil {
		logger.Error("Failed to load translations. Exiting", "error", err)
		os.Exit(1)
	}
	app := core.NewApp(db, cfg, tmpl, manifest, translator, logger)
	if err := migrations.RunPending(app); err != nil {
		logger.Error("Failed to run migrations. Exiting", "error", err)
		os.Exit(1)
	}

	if err := os.MkdirAll(cfg.FileDir, 0o755); err != nil {
		logger.Error("Failed to create uploads directory. Exiting", "directory", cfg.FileDir, "error", err)
		os.Exit(1)
	}

	logger.Info("Cleaning up expired files on startup")
	if err := db.CleanupExpired(); err != nil {
		logger.Warn("Failed to cleanup expired files", "error", err)
	}

	app.StartCleanupScheduler()

	logger.Info("Pre-caching user static files")
	middleware.PreCacheUserStaticFiles(cfg.UserFrontendDir, logger)

	srv := server.New(app, distFS)
	logger.Error("Server stopped. Exiting", "error", server.Start(srv, app))
	os.Exit(1)
}
