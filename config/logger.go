package config

import (
	"log/slog"
	"os"
)

// InitLogger initializes and returns a configured slog.Logger based on environment
func InitLogger(environment string) *slog.Logger {
	var level slog.Level
	var handler slog.Handler

	// Determine log level based on environment
	if environment == "development" {
		level = slog.LevelDebug
	} else {
		level = slog.LevelInfo
	}

	// Create handler options
	opts := &slog.HandlerOptions{
		Level: level,
	}

	// Use JSON handler for production, text handler for development
	if environment == "development" {
		handler = slog.NewTextHandler(os.Stdout, opts)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	}

	return slog.New(handler)
}
