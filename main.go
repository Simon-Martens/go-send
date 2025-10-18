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

//go:embed views/templates/*
var templatesFS embed.FS

//go:embed views/dist
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

	dbLogger, err := core.NewDBLogger(config.LOG_DB_PATH, logger)
	if err != nil {
		logger.Error("Failed to initialize DBLogger. Exiting", "error", err)
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
	app := core.NewApp(db, cfg, tmpl, manifest, translator, logger, dbLogger)
	if err := migrations.RunPending(app); err != nil {
		logger.Error("Failed to run migrations. Exiting", "error", err)
		os.Exit(1)
	}

	// Check if there are any users, if not generate initial admin token
	userCount, err := db.CountUsers(nil)
	if err != nil {
		logger.Error("Failed to count users. Exiting", "error", err)
		os.Exit(1)
	}

	if userCount == 0 {
		logger.Warn("No users found in database. Generating initial admin token...")

		// Delete all existing admin signup tokens to avoid accumulation on restarts
		deleted, err := db.DeleteTokensByType(storage.TokenTypeAdminSignup)
		if err != nil {
			logger.Warn("Failed to cleanup old admin tokens", "error", err)
		} else if deleted > 0 {
			logger.Info("Cleaned up old admin signup tokens", "count", deleted)
		}

		rawToken, tokenRecord, err := db.GenerateInitialAdminToken(0) // creator_id=0 for system
		if err != nil {
			logger.Error("Failed to generate initial admin token. Exiting", "error", err)
			os.Exit(1)
		}

		claimURL := "http://localhost:" + cfg.Port + "/auth/claim/" + rawToken
		logger.Warn("═══════════════════════════════════════════════════════════════════════")
		logger.Warn("⚠️  NO USERS REGISTERED - INITIAL ADMIN SETUP REQUIRED")
		logger.Warn("═══════════════════════════════════════════════════════════════════════")
		logger.Warn("Create your first administrator account using this one-time link:")
		logger.Warn("", "url", claimURL)
		logger.Warn("", "token_id", tokenRecord.ID, "expires", "after first use")
		logger.Warn("═══════════════════════════════════════════════════════════════════════")
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
