package email

import (
	"fmt"
	"log/slog"

	"github.com/Simon-Martens/go-send/config"
)

// Mailer defines the interface for sending emails
type Mailer interface {
	Send(to, subject, body string) error
}

// NewMailer creates a new Mailer based on the configuration
// Returns an SMTP mailer for driver="smtp" or a Log mailer for driver="log"
func NewMailer(cfg *config.Config, logger *slog.Logger) (Mailer, error) {
	switch cfg.Mail.Driver {
	case "smtp":
		if cfg.Mail.Host == "" {
			return nil, fmt.Errorf("MAIL_HOST is required when MAIL_DRIVER=smtp")
		}
		return NewSMTPMailer(cfg.Mail, logger), nil
	case "log":
		return NewLogMailer(logger), nil
	default:
		return nil, fmt.Errorf("unknown mail driver: %s (supported: smtp, log)", cfg.Mail.Driver)
	}
}
