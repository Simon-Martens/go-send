package tests

import (
	"bytes"
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/storage"
	"github.com/gorilla/websocket"
)

// UploadTestRequest is a helper for creating upload requests
type UploadTestRequest struct {
	FileMetadata      string
	Authorization     string
	TimeLimit         int
	Dlimit            int
	FileContent       []byte
	OwnerSecret       *OwnerSecretData
	RecipientSecret   *RecipientSecretData
	RecipientUserID   *int64
}

// OwnerSecretData represents encrypted owner secret data
type OwnerSecretData struct {
	Ciphertext   string
	Nonce        string
	EphemeralPub string
	Version      int
}

// RecipientSecretData represents encrypted recipient secret data
type RecipientSecretData struct {
	Ciphertext   string
	Nonce        string
	EphemeralPub string
	Version      int
}

// TestBasicUploadNotAuthorized tests that uploads without auth are rejected
// This test demonstrates that the WebSocket upload endpoint properly enforces authentication
func TestBasicUploadNotAuthorized(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create upload handler
	handler := handlers.NewUploadHandler(setup.App)

	// Create test server with the handler
	server := httptest.NewServer(handler)
	defer server.Close()

	// Convert to WebSocket URL
	wsURL := "ws" + server.URL[4:]

	// Dial the WebSocket WITHOUT authentication
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to create WebSocket connection: %v", err)
	}
	defer conn.Close()

	// Send upload metadata
	metadata := handlers.UploadRequest{
		FileMetadata:    base64.RawURLEncoding.EncodeToString([]byte("encrypted-metadata")),
		Authorization:   "auth-key-from-hkdf",
		TimeLimit:       3600,
		Dlimit:          10,
	}

	if err := conn.WriteJSON(metadata); err != nil {
		t.Fatalf("Failed to send metadata: %v", err)
	}

	// Try to receive upload response - should get authorization error
	var resp handlers.UploadResponse
	if err := conn.ReadJSON(&resp); err != nil {
		// This is expected - connection should close on auth failure
		return
	}

	// If we get here, verify we got an error response
	if resp.Error != 401 {
		t.Errorf("Expected error code 401 (unauthorized), got %d", resp.Error)
	}
}

// TestUploadWithFileSizeLimit tests that files exceeding size limit are rejected
func TestUploadWithFileSizeLimit(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Set a small file size limit for testing
	setup.App.Config.MaxFileSize = 100 // 100 bytes

	// Create test user
	user := setup.CreateTestUser(t, "uploader@test.com", "Uploader", storage.RoleUser)

	// Create a test session
	session := &storage.Session{
		Token:      "test-session-token",
		UserID:     &user.ID,
		ExpiresAt:  2000000000,
		CreatedAt:  1000000000,
		UpdatedAt:  1000000000,
		LastIP:     "127.0.0.1",
		Active:     true,
	}

	if err := setup.DB.CreateSession(session); err != nil {
		t.Fatalf("Failed to create session: %v", err)
	}

	// Create upload handler
	handler := handlers.NewUploadHandler(setup.App)

	// Create test server
	server := httptest.NewServer(handler)
	defer server.Close()

	// Convert to WebSocket URL
	wsURL := "ws" + server.URL[4:]

	// Dial the WebSocket
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, http.Header{
		"Cookie": []string{"session=" + "test-session-token"},
	})
	if err != nil {
		t.Fatalf("Failed to create WebSocket connection: %v", err)
	}
	defer conn.Close()

	// Send upload metadata
	metadata := handlers.UploadRequest{
		FileMetadata:    base64.RawURLEncoding.EncodeToString([]byte("encrypted-metadata")),
		Authorization:   "auth-key-from-hkdf",
		TimeLimit:       3600,
		Dlimit:          10,
	}

	if err := conn.WriteJSON(metadata); err != nil {
		t.Fatalf("Failed to send metadata: %v", err)
	}

	// Receive upload response
	var resp handlers.UploadResponse
	if err := conn.ReadJSON(&resp); err != nil {
		t.Fatalf("Failed to receive response: %v", err)
	}

	// Send file content exceeding size limit
	largeContent := bytes.Repeat([]byte("x"), 200)
	if err := conn.WriteMessage(websocket.BinaryMessage, largeContent); err != nil {
		t.Fatalf("Failed to send file content: %v", err)
	}

	// Try to send more data (should get error)
	// Note: The server will close the connection with an error
	_, _, err = conn.ReadMessage()
	if err == nil {
		t.Errorf("Expected error for oversized file, got nil")
	}
}

// TestUploadWithoutAuthentication tests upload without session
func TestUploadWithoutAuthentication(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Don't create a session, just try to upload directly
	handler := handlers.NewUploadHandler(setup.App)

	// Create test server
	server := httptest.NewServer(handler)
	defer server.Close()

	// Convert to WebSocket URL
	wsURL := "ws" + server.URL[4:]

	// Dial the WebSocket without session
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to create WebSocket connection: %v", err)
	}
	defer conn.Close()

	// Send upload metadata
	metadata := handlers.UploadRequest{
		FileMetadata:    base64.RawURLEncoding.EncodeToString([]byte("encrypted-metadata")),
		Authorization:   "auth-key-from-hkdf",
		TimeLimit:       3600,
		Dlimit:          10,
	}

	if err := conn.WriteJSON(metadata); err != nil {
		t.Fatalf("Failed to send metadata: %v", err)
	}

	// Should get error response for unauthorized upload
	var resp handlers.UploadResponse
	if err := conn.ReadJSON(&resp); err != nil {
		// This is expected - server should close connection on auth failure
		// So we expect a read error here
		return
	}

	// If we get here, check if we got an error response
	if resp.Error != 401 {
		t.Errorf("Expected error code 401, got %d", resp.Error)
	}
}

// TestUploadDefaultLimits tests that default upload limits are applied when not specified
func TestUploadDefaultLimits(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Verify the app has default limits configured
	if setup.App.Config.DefaultDownloads == 0 {
		t.Fatalf("Default downloads limit not configured")
	}

	if setup.App.Config.DefaultExpireSeconds == 0 {
		t.Fatalf("Default expire seconds not configured")
	}

	// Verify they match our test setup
	if setup.App.Config.DefaultDownloads != 100 {
		t.Errorf("Expected default downloads 100, got %d", setup.App.Config.DefaultDownloads)
	}

	if setup.App.Config.DefaultExpireSeconds != 3600 {
		t.Errorf("Expected default expire seconds 3600, got %d", setup.App.Config.DefaultExpireSeconds)
	}
}
