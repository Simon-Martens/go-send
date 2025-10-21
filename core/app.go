package core

import (
	"context"
	"html/template"
	"log/slog"
	"sync"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/i18n"
	"github.com/Simon-Martens/go-send/storage"
)

// App holds all global application state and dependencies
type App struct {
	DB         *storage.DB
	Config     *config.Config
	Template   *template.Template
	Manifest   Manifest
	Logger     *slog.Logger
	Translator *i18n.Translator
	DBLogger   *DBLogger

	// InitialAdminClaimURL is set when no users exist at startup
	// Used to redirect to the initial admin registration page
	InitialAdminClaimURL string

	// Track active cleanup goroutines with their cancel functions
	activeCleanups   map[string]context.CancelFunc
	activeCleanupsMu sync.RWMutex
}

// NewApp creates and initializes a new App instance
func NewApp(db *storage.DB, cfg *config.Config, tmpl *template.Template, manifest Manifest, translator *i18n.Translator, logger *slog.Logger, dbLogger *DBLogger) *App {
	return &App{
		DB:             db,
		Config:         cfg,
		Template:       tmpl,
		Manifest:       manifest,
		Translator:     translator,
		Logger:         logger,
		DBLogger:       dbLogger,
		activeCleanups: make(map[string]context.CancelFunc),
	}
}

// LogDB returns the underlying LogDB for migrations and direct access
func (a *App) LogDB() *storage.LogDB {
	return a.DBLogger.DB()
}

// ScheduleCleanup schedules a file for deletion at its expiration time.
// Only schedules if no cleanup is already active for this file.
// Returns true if a new goroutine was started.
func (a *App) ScheduleCleanup(fileID string, expiresAt int64) bool {
	a.activeCleanupsMu.Lock()
	if _, exists := a.activeCleanups[fileID]; exists {
		a.activeCleanupsMu.Unlock()
		return false
	}

	ctx, cancel := context.WithCancel(context.Background())
	a.activeCleanups[fileID] = cancel
	a.activeCleanupsMu.Unlock()

	go func(id string, exp int64) {
		duration := time.Until(time.Unix(exp, 0))

		// Wait for expiration or cancellation
		select {
		case <-time.After(duration):
			// Delete file from disk and database
			a.Logger.Info("Auto-deleting expired file", "file_id", id)
			storage.DeleteFile(a.Config.FileDir, id)
			a.DB.DeleteFileRecord(id)
		case <-ctx.Done():
			a.Logger.Debug("Cleanup cancelled for file", "file_id", id)
		}

		// Remove from active cleanups map
		a.activeCleanupsMu.Lock()
		delete(a.activeCleanups, id)
		a.activeCleanupsMu.Unlock()
	}(fileID, expiresAt)

	return true
}

// CancelCleanup cancels the cleanup goroutine for a file.
// Call this when a file is manually deleted.
func (a *App) CancelCleanup(fileID string) {
	a.activeCleanupsMu.Lock()
	if cancel, exists := a.activeCleanups[fileID]; exists {
		cancel()
		delete(a.activeCleanups, fileID)
	}
	a.activeCleanupsMu.Unlock()
}

// StartCleanupScheduler starts a background goroutine that periodically schedules
// cleanup tasks for files expiring soon
func (a *App) StartCleanupScheduler() {
	go func() {
		// Schedule on startup
		scheduleUpcomingCleanups := func() {
			files, err := a.DB.GetFilesExpiringWithin(config.CLEANUP_CHECK_INTERVAL)
			if err != nil {
				a.Logger.Error("Error querying upcoming expirations", "error", err)
				return
			}

			scheduled := 0
			for _, f := range files {
				if a.ScheduleCleanup(f.ID, f.ExpiresAt) {
					scheduled++
				}
			}
			if scheduled > 0 {
				a.Logger.Info("Scheduled cleanup goroutines for expiring files", "count", scheduled, "window", "1 hour")
			}
		}

		scheduleUpcomingCleanups()

		// Then run periodically
		ticker := time.NewTicker(config.CLEANUP_TICKER_INTERVAL)
		defer ticker.Stop()
		for range ticker.C {
			scheduleUpcomingCleanups()
		}
	}()
}
