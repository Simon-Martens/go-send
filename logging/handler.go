package logging

import (
	stdcontext "context"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/Simon-Martens/go-send/context"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/storage"
)

// DualHandler is a custom slog.Handler that writes to both stdout and database
type DualHandler struct {
	stdout slog.Handler
	app    *core.App
}

// NewDualHandler creates a new DualHandler
func NewDualHandler(stdout slog.Handler, app *core.App) *DualHandler {
	return &DualHandler{
		stdout: stdout,
		app:    app,
	}
}

// Enabled reports whether the handler handles records at the given level
func (h *DualHandler) Enabled(ctx stdcontext.Context, level slog.Level) bool {
	return h.stdout.Enabled(ctx, level)
}

// Handle processes a log record
func (h *DualHandler) Handle(ctx stdcontext.Context, r slog.Record) error {
	// Always write to stdout first
	if err := h.stdout.Handle(ctx, r); err != nil {
		return err
	}

	// Only write to database for INFO level and above
	if r.Level < slog.LevelInfo {
		return nil
	}

	// Try to extract request from context (set by middleware)
	req, _ := ctx.Value(context.RequestContextKey).(*http.Request)
	statusCode, _ := ctx.Value(context.StatusCodeContextKey).(int)

	// If no request in context, skip database logging
	// This means the log came from outside an HTTP request context
	if req == nil {
		return nil
	}

	// Build error JSON from log record attributes
	errorData := make(map[string]interface{})
	errorData["level"] = r.Level.String()
	errorData["message"] = r.Message

	// Collect all attributes
	r.Attrs(func(a slog.Attr) bool {
		errorData[a.Key] = a.Value.Any()
		return true
	})

	errorJSON, err := json.Marshal(errorData)
	if err != nil {
		errorJSON = json.RawMessage(`{"error": "failed to marshal log attributes"}`)
	}

	// Get request data
	reqData := storage.NewRequestData(req)

	// Create log entry
	entry := &core.LogEntry{
		Request:     req,
		Method:      req.Method,
		URL:         req.URL.Path,
		StatusCode:  statusCode,
		RequestData: reqData.ToJSON(),
		UserID:      nil, // TODO: Extract from context when auth is implemented
		Error:       json.RawMessage(errorJSON),
		Timestamp:   time.Now().Unix(),
	}

	// Send to channel (non-blocking if channel is full, we drop the log)
	select {
	case h.app.LogRequestChan <- entry:
		// Successfully queued
	default:
		// Channel full, log is dropped
		// This prevents blocking the application if DB writes are slow
	}

	return nil
}

// WithAttrs returns a new Handler with additional attributes
func (h *DualHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &DualHandler{
		stdout: h.stdout.WithAttrs(attrs),
		app:    h.app,
	}
}

// WithGroup returns a new Handler with a group
func (h *DualHandler) WithGroup(name string) slog.Handler {
	return &DualHandler{
		stdout: h.stdout.WithGroup(name),
		app:    h.app,
	}
}
