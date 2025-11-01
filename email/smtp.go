package email

import (
	"crypto/tls"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/smtp"
	"strings"

	"github.com/Simon-Martens/go-send/config"
)

// loginAuth implements the LOGIN authentication mechanism (used by Office 365 and others)
type loginAuth struct {
	username string
	password string
}

func (a *loginAuth) Start(server *smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", []byte{}, nil
}

func (a *loginAuth) Next(fromServer []byte, more bool) ([]byte, error) {
	if more {
		switch string(fromServer) {
		case "Username:", "User Name\x00":
			return []byte(a.username), nil
		case "Password:", "Password\x00":
			return []byte(a.password), nil
		default:
			return nil, errors.New("unknown response from server")
		}
	}
	return nil, nil
}

// SMTPMailer sends emails via SMTP with mandatory TLS
type SMTPMailer struct {
	config config.MailConfig
	logger *slog.Logger
}

// NewSMTPMailer creates a new SMTP mailer
func NewSMTPMailer(cfg config.MailConfig, logger *slog.Logger) *SMTPMailer {
	return &SMTPMailer{
		config: cfg,
		logger: logger,
	}
}

// Send sends an email via SMTP with TLS
func (m *SMTPMailer) Send(to, subject, body string) error {
	// Construct the email message
	from := m.config.From
	if m.config.FromName != "" {
		from = fmt.Sprintf("%s <%s>", m.config.FromName, m.config.From)
	}

	msg := []byte(fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s",
		from,
		to,
		subject,
		body,
	))

	// Connect to the SMTP server
	addr := fmt.Sprintf("%s:%d", m.config.Host, m.config.Port)

	m.logger.Debug("Connecting to SMTP server", "host", m.config.Host, "port", m.config.Port)

	// Establish TCP connection
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		m.logger.Error("Failed to connect to SMTP server", "error", err, "addr", addr)
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()

	// Create SMTP client
	client, err := smtp.NewClient(conn, m.config.Host)
	if err != nil {
		m.logger.Error("Failed to create SMTP client", "error", err)
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()

	// Check if server supports STARTTLS
	if ok, _ := client.Extension("STARTTLS"); ok {
		m.logger.Debug("Starting TLS")

		tlsConfig := &tls.Config{
			ServerName: m.config.Host,
		}

		if err = client.StartTLS(tlsConfig); err != nil {
			m.logger.Error("Failed to start TLS", "error", err)
			return fmt.Errorf("failed to start TLS: %w", err)
		}
	} else {
		// TLS is mandatory - reject if not supported
		m.logger.Error("SMTP server does not support STARTTLS")
		return fmt.Errorf("SMTP server does not support STARTTLS")
	}

	// Authenticate if credentials are provided
	if m.config.Username != "" {
		// Use custom auth that allows any hostname (needed for Office 365)
		auth := &loginAuth{
			username: m.config.Username,
			password: m.config.Password,
		}

		if err = client.Auth(auth); err != nil {
			m.logger.Error("Failed to authenticate with SMTP server", "error", err, "username", m.config.Username)
			return fmt.Errorf("failed to authenticate: %w", err)
		}

		m.logger.Debug("SMTP authentication successful")
	}

	// Set sender
	if err = client.Mail(m.config.From); err != nil {
		m.logger.Error("Failed to set sender", "error", err, "from", m.config.From)
		return fmt.Errorf("failed to set sender: %w", err)
	}

	// Set recipient
	if err = client.Rcpt(to); err != nil {
		m.logger.Error("Failed to set recipient", "error", err, "to", to)
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send the email body
	w, err := client.Data()
	if err != nil {
		m.logger.Error("Failed to open data writer", "error", err)
		return fmt.Errorf("failed to open data writer: %w", err)
	}

	_, err = w.Write(msg)
	if err != nil {
		m.logger.Error("Failed to write email data", "error", err)
		return fmt.Errorf("failed to write email data: %w", err)
	}

	err = w.Close()
	if err != nil {
		m.logger.Error("Failed to close data writer", "error", err)
		return fmt.Errorf("failed to close data writer: %w", err)
	}

	// Quit
	if err = client.Quit(); err != nil {
		// Log but don't return error - email was sent successfully
		m.logger.Warn("Failed to quit SMTP session cleanly", "error", err)
	}

	// Mask password in log
	maskedUser := m.config.Username
	if maskedUser != "" && strings.Contains(maskedUser, "@") {
		parts := strings.Split(maskedUser, "@")
		maskedUser = parts[0][:1] + "***@" + parts[1]
	}

	m.logger.Info("Email sent successfully",
		"to", to,
		"subject", subject,
		"smtp_host", m.config.Host,
		"smtp_user", maskedUser,
	)

	return nil
}
