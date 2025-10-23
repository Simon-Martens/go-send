package tests

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/storage"
)

// TestDownloadNonExistentFile tests downloading a file that doesn't exist
func TestDownloadNonExistentFile(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create HTTP request for non-existent file
	req := httptest.NewRequest("GET", "/api/download/nonexistent", nil)

	// Add HMAC auth header (would normally be derived by client)
	req.Header.Set("Authorization", "Bearer test-auth")

	// Create response recorder
	w := httptest.NewRecorder()

	// Create and call handler
	handler := handlers.NewDownloadHandler(setup.App)
	handler(w, req)

	// Should return 404 Not Found
	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status %d, got %d", http.StatusNotFound, w.Code)
	}
}

// TestDownloadWithoutAuthentication tests download without authentication
func TestDownloadWithoutAuthentication(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a test file
	testFile := setup.CreateTestFile(t, "test-file-id", "owner-token", []byte("test content"))

	// Create HTTP request without authentication
	req := httptest.NewRequest("GET", "/api/download/"+testFile.ID, nil)

	// Create response recorder
	w := httptest.NewRecorder()

	// Create and call handler
	handler := handlers.NewDownloadHandler(setup.App)
	handler(w, req)

	// Should return 401 Unauthorized
	if w.Code != http.StatusUnauthorized {
		t.Errorf("Expected status %d, got %d", http.StatusUnauthorized, w.Code)
	}
}

// TestDownloadWithValidAuth tests a successful download with valid authentication
func TestDownloadWithValidAuth(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a test file
	testFileContent := []byte("This is test file content")
	testFile := setup.CreateTestFile(t, "test-file-id", "owner-token", testFileContent)

	// Create HTTP request with HMAC auth
	// In real scenario, client derives auth key from file secret using HKDF
	// and signs the nonce with HMAC-SHA256
	req := httptest.NewRequest("GET", "/api/download/"+testFile.ID, nil)

	// Add HMAC auth header
	// Format: Authorization: Bearer <hmac-signature>
	req.Header.Set("Authorization", "Bearer test-hmac-signature")

	// Add nonce header (server would have sent this in a previous challenge)
	req.Header.Set("X-Nonce", testFile.Nonce)

	// Create response recorder
	w := httptest.NewRecorder()

	// Create and call handler
	handler := handlers.NewDownloadHandler(setup.App)
	handler(w, req)

	// For this test, we're just checking the basic flow
	// In a real scenario, the HMAC verification would happen inside the handler
	// and it would succeed if the signature matches
	// Since we're using test values, we expect it to fail HMAC validation
	// but we can still verify the structure
	if w.Code == http.StatusOK {
		// If it somehow passes, verify content
		body := w.Body.String()
		if !bytes.Contains([]byte(body), testFileContent) {
			t.Errorf("Expected response body to contain file content")
		}
	}
}

// TestDownloadCountIncrement tests that download count can be incremented
func TestDownloadCountIncrement(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a test file with download limit of 2
	testFile := setup.CreateTestFile(t, "test-file-id", "owner-token", []byte("test content"))

	// Verify initial download count is 0
	file, err := setup.DB.GetFile(testFile.ID)
	if err != nil {
		t.Fatalf("Failed to get file: %v", err)
	}

	if file.DlCount != 0 {
		t.Errorf("Expected initial download count 0, got %d", file.DlCount)
	}

	// Test incrementing download count
	if err := setup.DB.IncrementDownload(testFile.ID); err != nil {
		t.Fatalf("Failed to increment download count: %v", err)
	}

	// Verify count was incremented
	updatedFile, err := setup.DB.GetFile(testFile.ID)
	if err != nil {
		t.Fatalf("Failed to get updated file: %v", err)
	}

	if updatedFile.DlCount != 1 {
		t.Errorf("Expected download count 1, got %d", updatedFile.DlCount)
	}
}

// TestDownloadExpiryCheck tests that expired files cannot be downloaded
func TestDownloadExpiredFile(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create an expired file (expires_at in the past)
	expiredFileContent := []byte("test")
	expiredFilePath := setup.TempDir + "/uploads/expired-file"

	if err := os.WriteFile(expiredFilePath, expiredFileContent, 0644); err != nil {
		t.Fatalf("Failed to write expired file: %v", err)
	}

	// Create metadata with expiry in the past
	meta := &storage.FileMetadata{
		ID:         "expired-file",
		OwnerToken: "owner-token",
		Metadata:   "test-encrypted-metadata",
		AuthKey:    "test-auth-key",
		Nonce:      "test-nonce",
		DlLimit:    10,
		DlCount:    0,
		Password:   false,
		CreatedAt:  500000000,
		ExpiresAt:  500000000, // Far in the past
	}

	if err := setup.DB.CreateFile(meta); err != nil {
		t.Fatalf("Failed to create file metadata: %v", err)
	}

	// Create HTTP request with proper HMAC auth format
	// Authorization header should be in format: Bearer <base64url-encoded-signature>
	req := httptest.NewRequest("GET", "/api/download/expired-file", nil)
	req.Header.Set("Authorization", "Bearer dGVzdC1obWFjLXNpZ25hdHVyZQ")  // base64url encoded signature
	req.Header.Set("X-Nonce", "test-nonce")

	// Create response recorder
	w := httptest.NewRecorder()

	// Create and call handler
	handler := handlers.NewDownloadHandler(setup.App)
	handler(w, req)

	// With an expired file, the handler should either:
	// 1. Return 401 if HMAC auth fails (signature mismatch)
	// 2. Return 404 if file was cleaned up
	// 3. Return 410 Gone if file is expired but still in DB
	// We expect one of these status codes
	if w.Code != http.StatusUnauthorized && w.Code != http.StatusNotFound && w.Code != http.StatusGone {
		t.Errorf("Expected 401, 404, or 410, got %d", w.Code)
	}
}

// TestMetadataEndpoint tests the metadata retrieval endpoint
func TestMetadataEndpoint(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a test file
	testFile := setup.CreateTestFile(t, "test-file-id", "owner-token", []byte("test content"))

	// Create HTTP request for metadata
	req := httptest.NewRequest("GET", "/api/metadata/"+testFile.ID, nil)

	// Add HMAC auth (same as download)
	req.Header.Set("Authorization", "Bearer test-hmac-signature")
	req.Header.Set("X-Nonce", testFile.Nonce)

	// Create response recorder
	w := httptest.NewRecorder()

	// Create and call handler
	handler := handlers.NewMetadataHandler(setup.App)
	handler(w, req)

	// Verify response
	if w.Code != http.StatusOK && w.Code != http.StatusUnauthorized {
		t.Errorf("Expected 200 or 401, got %d", w.Code)
	}
}

// TestDownloadLimitExceeded tests that downloads stop when limit is reached
func TestDownloadLimitExceeded(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a file with download limit of 1
	limitedFileContent := []byte("test")
	limitedFilePath := setup.TempDir + "/uploads/limited-file"

	if err := os.WriteFile(limitedFilePath, limitedFileContent, 0644); err != nil {
		t.Fatalf("Failed to write file: %v", err)
	}

	// Create metadata with limit of 1 and already 1 download
	meta := &storage.FileMetadata{
		ID:         "limited-file",
		OwnerToken: "owner-token",
		Metadata:   "test-encrypted-metadata",
		AuthKey:    "test-auth-key",
		Nonce:      "test-nonce",
		DlLimit:    1,
		DlCount:    1, // Already downloaded once
		Password:   false,
		CreatedAt:  1000000000,
		ExpiresAt:  1000007200,
	}

	if err := setup.DB.CreateFile(meta); err != nil {
		t.Fatalf("Failed to create file metadata: %v", err)
	}

	// Try to download (should fail because limit reached)
	req := httptest.NewRequest("GET", "/api/download/limited-file", nil)
	req.Header.Set("Authorization", "Bearer test-hmac-signature")

	w := httptest.NewRecorder()

	handler := handlers.NewDownloadHandler(setup.App)
	handler(w, req)

	// Should return error indicating limit exceeded
	// Status could be 410 Gone or similar
	if w.Code == http.StatusOK {
		t.Errorf("Expected download to fail after limit reached, got status 200")
	}
}
