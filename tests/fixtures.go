package tests

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"html/template"
	"log/slog"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/Simon-Martens/go-send/config"
	"github.com/Simon-Martens/go-send/core"
	"github.com/Simon-Martens/go-send/migrations"
	"github.com/Simon-Martens/go-send/storage"
)

// TestSetup holds the test database and application state
type TestSetup struct {
	App           *core.App
	DB            *storage.DB
	TempDir       string
	Logger        *slog.Logger
	DBLogger      *core.DBLogger
	CleanupFuncs  []func() error
}

// NewTestSetup initializes a test database and app instance
// It creates a temporary SQLite database for testing
func NewTestSetup(t *testing.T) *TestSetup {
	// Create temporary directory for test files
	tempDir, err := os.MkdirTemp("", "go-send-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}

	// Create subdirectories
	uploadDir := filepath.Join(tempDir, "uploads")
	dbDir := filepath.Join(tempDir, "db")
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		t.Fatalf("Failed to create upload directory: %v", err)
	}
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		t.Fatalf("Failed to create db directory: %v", err)
	}

	// Set up logger
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		Level: slog.LevelDebug,
	}))

	// Initialize test database
	dbPath := filepath.Join(dbDir, "test.db")
	db, err := storage.NewDB(dbPath, uploadDir)
	if err != nil {
		t.Fatalf("Failed to create test database: %v", err)
	}

	// Initialize DBLogger
	logDBPath := filepath.Join(dbDir, "test-logs.db")
	dbLogger, err := core.NewDBLogger(logDBPath, logger)
	if err != nil {
		t.Fatalf("Failed to create DBLogger: %v", err)
	}

	// Load default config
	cfg := &config.Config{
		Port:                  "3000",
		BaseURL:               "http://localhost:3000",
		FileDir:               uploadDir,
		MaxFileSize:           2684354560, // 2.5GB
		MaxExpireSeconds:      604800,     // 7 days
		MaxDownloads:          100,
		DefaultDownloads:      100,
		DefaultExpireSeconds:  3600, // 1 hour
		Environment:           "test",
		UseUserManagement:     true,
		UploadGuard:           false,
		AllowAccessLinks:      true,
	}

	// Create minimal templates
	tmpl, err := template.New("index.html").Parse("<html><body>Test</body></html>")
	if err != nil {
		t.Fatalf("Failed to create templates: %v", err)
	}

	// Create app instance
	app := core.NewApp(db, cfg, tmpl, core.Manifest{}, logger, dbLogger)

	// Run migrations to create database schema
	if err := migrations.RunPending(app); err != nil {
		t.Fatalf("Failed to run migrations: %v", err)
	}

	setup := &TestSetup{
		App:      app,
		DB:       db,
		TempDir:  tempDir,
		Logger:   logger,
		DBLogger: dbLogger,
	}

	// Add cleanup function
	setup.AddCleanup(func() error {
		if err := dbLogger.Close(); err != nil {
			t.Logf("Error closing DBLogger: %v", err)
		}
		if err := db.Close(); err != nil {
			t.Logf("Error closing database: %v", err)
		}
		return os.RemoveAll(tempDir)
	})

	return setup
}

// AddCleanup adds a cleanup function to be called when Teardown is called
func (ts *TestSetup) AddCleanup(f func() error) {
	ts.CleanupFuncs = append(ts.CleanupFuncs, f)
}

// Teardown cleans up all test resources
func (ts *TestSetup) Teardown() {
	for i := len(ts.CleanupFuncs) - 1; i >= 0; i-- {
		if err := ts.CleanupFuncs[i](); err != nil {
			ts.Logger.Error("Cleanup error", "error", err)
		}
	}
}

// CreateAdminSignupToken generates an admin signup token for testing
func (ts *TestSetup) CreateAdminSignupToken(t *testing.T) string {
	token, _, err := ts.DB.GenerateInitialAdminToken(0)
	if err != nil {
		t.Fatalf("Failed to generate admin token: %v", err)
	}
	return token
}

// CreateUserSignupToken generates a user signup token for testing
// createdByUserID is the user who creates the token (use admin user ID)
func (ts *TestSetup) CreateUserSignupToken(t *testing.T, createdByUserID int64) string {
	token, _, err := ts.DB.GenerateSignupToken(
		createdByUserID,
		storage.TokenTypeUserSignup,
		24*time.Hour,  // 24 hour TTL
		1,  // 1 use (single use token)
	)
	if err != nil {
		t.Fatalf("Failed to generate user token: %v", err)
	}
	return token
}

// CreateTestUser creates a user with deterministic keys for testing
func (ts *TestSetup) CreateTestUser(t *testing.T, email, name string, role storage.UserRole) *storage.User {
	// Generate deterministic keys based on email (for testing)
	// In production, the client generates these
	publicKey, _, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("Failed to generate public key: %v", err)
	}

	// Generate X25519 encryption key (32 bytes)
	encryptionKey := make([]byte, 32)
	if _, err := rand.Read(encryptionKey); err != nil {
		t.Fatalf("Failed to generate encryption key: %v", err)
	}

	// Generate salt (16 bytes)
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		t.Fatalf("Failed to generate salt: %v", err)
	}

	user := &storage.User{
		Name:                name,
		Email:               email,
		Salt:                base64.RawURLEncoding.EncodeToString(salt),
		PublicKey:           base64.RawURLEncoding.EncodeToString(publicKey),
		EncryptionPublicKey: base64.RawURLEncoding.EncodeToString(encryptionKey),
		Role:                role,
		Active:              true,
	}

	if err := ts.DB.CreateUser(user); err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	return user
}

// CreateUploadToken creates an upload token for guest uploads
func (ts *TestSetup) CreateUploadToken(t *testing.T, createdByUserID int64) string {
	token, _, err := ts.DB.GenerateGuestUploadToken(
		createdByUserID,
		storage.TokenTypeGeneralGuestUpload,
		"test-upload-link",
		"",
	)
	if err != nil {
		t.Fatalf("Failed to generate upload token: %v", err)
	}
	return token
}

// CreateSpecificUploadToken creates an upload token for uploading to a specific user
func (ts *TestSetup) CreateSpecificUploadToken(t *testing.T, createdByUserID int64) string {
	token, _, err := ts.DB.GenerateGuestUploadToken(
		createdByUserID,
		storage.TokenTypeSpecificGuestUpload,
		"test-specific-upload-link",
		"",
	)
	if err != nil {
		t.Fatalf("Failed to generate specific upload token: %v", err)
	}
	return token
}

// CreateTestFile creates a test file in the database
// Returns the file metadata
func (ts *TestSetup) CreateTestFile(t *testing.T, fileID string, ownerToken string, data []byte) *storage.FileMetadata {
	// Write file to disk
	filePath := filepath.Join(ts.App.Config.FileDir, fileID)
	if err := os.WriteFile(filePath, data, 0644); err != nil {
		t.Fatalf("Failed to write test file: %v", err)
	}

	// Create metadata
	meta := &storage.FileMetadata{
		ID:         fileID,
		OwnerToken: ownerToken,
		Metadata:   "test-encrypted-metadata",
		AuthKey:    "test-auth-key",
		Nonce:      "test-nonce",
		DlLimit:    10,
		DlCount:    0,
		Password:   false,
		CreatedAt:  1000000000,
		ExpiresAt:  1000007200, // 2 hours later
	}

	if err := ts.DB.CreateFile(meta); err != nil {
		t.Fatalf("Failed to create file metadata: %v", err)
	}

	// Track file for cleanup
	ts.AddCleanup(func() error {
		return os.Remove(filePath)
	})

	return meta
}
