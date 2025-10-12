package server

import (
	"embed"
	"net/http"
	"os"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/server/middleware"
)

// ApplyMiddleware wraps the handler with all middleware in the correct order
func ApplyMiddleware(handler http.Handler, cfg *config.Config) http.Handler {
	isDev := os.Getenv("ENV") == "development"

	handler = middleware.SecurityHeaders(isDev)(handler)
	handler = middleware.CSP(isDev, cfg.BaseURL)(handler)
	handler = middleware.LimitRequestBody(config.MAX_REQUEST_BODY_SIZE)(handler)
	// handler = middleware.RateLimit(config.RATE_LIMIT_REQUESTS_PER_SECOND, config.RATE_LIMIT_BURST_SIZE)(handler)

	return handler
}

func New(app *core.App, distFS embed.FS) *http.Server {
	routes := SetupRoutes(app, distFS)
	handler := ApplyMiddleware(routes, app.Config)

	return &http.Server{
		Addr:              ":" + app.Config.Port,
		Handler:           handler,
		ReadTimeout:       config.SERVER_READ_TIMEOUT,
		WriteTimeout:      config.SERVER_WRITE_TIMEOUT,
		IdleTimeout:       config.SERVER_IDLE_TIMEOUT,
		ReadHeaderTimeout: config.SERVER_READ_HEADER_TIMEOUT,
		MaxHeaderBytes:    config.MAX_HEADER_BYTES,
	}
}

func Start(server *http.Server, app *core.App) error {
	app.Logger.Info("HTTP server listening", "address", server.Addr)
	return server.ListenAndServe()
}
