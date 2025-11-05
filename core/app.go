package core

import (
	"context"
	"html/template"
	"log/slog"
	"sync"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/storage"
)

// Mailer defines the interface for sending emails
// This is defined here to avoid circular imports
type Mailer interface {
	Send(to, subject, body string) error
}

// App holds all global application state and dependencies
type App struct {
	DB       *storage.DB
	Config   *config.Config
	Template *template.Template
	Manifest Manifest
	Logger   *slog.Logger
	DBLogger *DBLogger
	Mailer   Mailer

	// InitialAdminClaimURL is set when no users exist at startup
	// Used to redirect to the initial admin registration page
	InitialAdminClaimURL string

	// Track active cleanup goroutines with their cancel functions
	activeCleanups   map[string]context.CancelFunc
	activeCleanupsMu sync.RWMutex
}

// NewApp creates and initializes a new App instance
func NewApp(db *storage.DB, cfg *config.Config, tmpl *template.Template, manifest Manifest, logger *slog.Logger, dbLogger *DBLogger, mailer Mailer) *App {
	return &App{
		DB:             db,
		Config:         cfg,
		Template:       tmpl,
		Manifest:       manifest,
		Logger:         logger,
		DBLogger:       dbLogger,
		Mailer:         mailer,
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

			// Log the automatic deletion due to time limit
			a.DBLogger.LogSystemFileOp(id, "deletion", 0, a.DB, "deletion_type", "time_limit")

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

// SendEmailAsync sends an email asynchronously in a separate goroutine with retry logic
// This method returns immediately and does not block the caller
// Retries up to 3 times with intervals: 4s, 30s, 2min
// Any errors during sending are logged but do not propagate to the caller
func (a *App) SendEmailAsync(to, subject, body string) {
	go func() {
		const maxRetries = 3
		retryDelays := []time.Duration{
			4 * time.Second,
			30 * time.Second,
			2 * time.Minute,
		}
		var lastErr error

		for attempt := 1; attempt <= maxRetries; attempt++ {
			err := a.Mailer.Send(to, subject, body)
			if err == nil {
				// Success
				if attempt > 1 {
					a.Logger.Info("Email sent successfully after retry",
						"to", to,
						"subject", subject,
						"attempt", attempt,
					)
				}
				return
			}

			lastErr = err

			if attempt < maxRetries {
				waitDuration := retryDelays[attempt-1]
				a.Logger.Warn("Failed to send email, will retry",
					"to", to,
					"subject", subject,
					"attempt", attempt,
					"max_attempts", maxRetries,
					"retry_in", waitDuration,
					"error", err,
				)
				time.Sleep(waitDuration)
			}
		}

		// All retries failed
		a.Logger.Error("Failed to send email after all retries",
			"to", to,
			"subject", subject,
			"attempts", maxRetries,
			"error", lastErr,
		)
	}()
}
