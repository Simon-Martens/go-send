package email

import (
	"log/slog"
)

// LogMailer logs emails instead of sending them
// Useful for development and testing
type LogMailer struct {
	logger *slog.Logger
}

// NewLogMailer creates a new log-based mailer
func NewLogMailer(logger *slog.Logger) *LogMailer {
	return &LogMailer{
		logger: logger,
	}
}

// Send logs the email instead of sending it
func (m *LogMailer) Send(to, subject, body string) error {
	m.logger.Info("Email logged (not sent - MAIL_DRIVER=log)",
		"to", to,
		"subject", subject,
		"body", body,
	)
	return nil
}
