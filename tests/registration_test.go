package tests

import (
	"bytes"
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Simon-Martens/go-send/handlers"
	"github.com/Simon-Martens/go-send/storage"
)

// TestAdminRegistration tests the admin registration endpoint
func TestAdminRegistration(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Generate admin signup token
	adminToken := setup.CreateAdminSignupToken(t)

	// Generate test credentials
	publicKey, _, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("Failed to generate keys: %v", err)
	}

	encryptionKey := make([]byte, 32)
	if _, err := rand.Read(encryptionKey); err != nil {
		t.Fatalf("Failed to generate encryption key: %v", err)
	}

	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		t.Fatalf("Failed to generate salt: %v", err)
	}

	// Create registration request
	req := handlers.RegisterAdminRequest{
		Token:               adminToken,
		Name:                "Admin User",
		Email:               "admin@test.com",
		Salt:                base64.RawURLEncoding.EncodeToString(salt),
		PublicKey:           base64.RawURLEncoding.EncodeToString(publicKey),
		EncryptionPublicKey: base64.RawURLEncoding.EncodeToString(encryptionKey),
	}

	// Marshal request
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal request: %v", err)
	}

	// Create HTTP request
	httpReq := httptest.NewRequest("POST", "/register/admin", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler := handlers.NewRegisterAdminHandler(setup.App)
	handler(w, httpReq)

	// Check response
	if w.Code != http.StatusCreated {
		t.Errorf("Expected status %d, got %d: %s", http.StatusCreated, w.Code, w.Body.String())
	}

	// Verify response structure
	var resp handlers.RegisterAdminResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if resp.Email != "admin@test.com" {
		t.Errorf("Expected email 'admin@test.com', got '%s'", resp.Email)
	}

	if resp.Role != "admin" {
		t.Errorf("Expected role 'admin', got '%s'", resp.Role)
	}

	// Verify user was created in database
	users, err := setup.DB.ListUsers(nil)
	if err != nil {
		t.Fatalf("Failed to get users: %v", err)
	}

	if len(users) != 1 {
		t.Errorf("Expected 1 user in database, got %d", len(users))
	}

	if users[0].Email != "admin@test.com" {
		t.Errorf("Expected email 'admin@test.com', got '%s'", users[0].Email)
	}
}

// TestUserRegistration tests the user registration endpoint
func TestUserRegistration(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create admin user first
	admin := setup.CreateTestUser(t, "admin@test.com", "Admin", storage.RoleAdmin)

	// Generate user signup token
	userToken := setup.CreateUserSignupToken(t, admin.ID)

	// Generate test credentials
	publicKey, _, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("Failed to generate keys: %v", err)
	}

	encryptionKey := make([]byte, 32)
	if _, err := rand.Read(encryptionKey); err != nil {
		t.Fatalf("Failed to generate encryption key: %v", err)
	}

	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		t.Fatalf("Failed to generate salt: %v", err)
	}

	// Create registration request
	req := handlers.RegisterAdminRequest{
		Token:               userToken,
		Name:                "Regular User",
		Email:               "user@test.com",
		Salt:                base64.RawURLEncoding.EncodeToString(salt),
		PublicKey:           base64.RawURLEncoding.EncodeToString(publicKey),
		EncryptionPublicKey: base64.RawURLEncoding.EncodeToString(encryptionKey),
	}

	// Marshal request
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal request: %v", err)
	}

	// Create HTTP request
	httpReq := httptest.NewRequest("POST", "/register/user", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler := handlers.NewRegisterUserHandler(setup.App)
	handler(w, httpReq)

	// Check response
	if w.Code != http.StatusCreated {
		t.Errorf("Expected status %d, got %d: %s", http.StatusCreated, w.Code, w.Body.String())
	}

	// Verify response structure
	var resp handlers.RegisterAdminResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if resp.Email != "user@test.com" {
		t.Errorf("Expected email 'user@test.com', got '%s'", resp.Email)
	}

	if resp.Role != "user" {
		t.Errorf("Expected role 'user', got '%s'", resp.Role)
	}

	// Verify user was created in database
	users, err := setup.DB.ListUsers(nil)
	if err != nil {
		t.Fatalf("Failed to get users: %v", err)
	}

	if len(users) != 2 {
		t.Errorf("Expected 2 users in database, got %d", len(users))
	}
}

// TestRegistrationWithInvalidToken tests registration with an invalid token
func TestRegistrationWithInvalidToken(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Generate test credentials
	publicKey, _, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("Failed to generate keys: %v", err)
	}

	encryptionKey := make([]byte, 32)
	if _, err := rand.Read(encryptionKey); err != nil {
		t.Fatalf("Failed to generate encryption key: %v", err)
	}

	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		t.Fatalf("Failed to generate salt: %v", err)
	}

	// Create registration request with invalid token
	req := handlers.RegisterAdminRequest{
		Token:               "invalid-token",
		Name:                "Test User",
		Email:               "test@test.com",
		Salt:                base64.RawURLEncoding.EncodeToString(salt),
		PublicKey:           base64.RawURLEncoding.EncodeToString(publicKey),
		EncryptionPublicKey: base64.RawURLEncoding.EncodeToString(encryptionKey),
	}

	// Marshal request
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal request: %v", err)
	}

	// Create HTTP request
	httpReq := httptest.NewRequest("POST", "/register/admin", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler := handlers.NewRegisterAdminHandler(setup.App)
	handler(w, httpReq)

	// Should return 401 Unauthorized
	if w.Code != http.StatusUnauthorized {
		t.Errorf("Expected status %d, got %d", http.StatusUnauthorized, w.Code)
	}
}

// TestRegistrationWithDuplicateEmail tests registration with duplicate email
func TestRegistrationWithDuplicateEmail(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	// Create a user first
	setup.CreateTestUser(t, "duplicate@test.com", "User 1", storage.RoleUser)

	// Generate admin signup token
	adminToken := setup.CreateAdminSignupToken(t)

	// Generate test credentials
	publicKey, _, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("Failed to generate keys: %v", err)
	}

	encryptionKey := make([]byte, 32)
	if _, err := rand.Read(encryptionKey); err != nil {
		t.Fatalf("Failed to generate encryption key: %v", err)
	}

	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		t.Fatalf("Failed to generate salt: %v", err)
	}

	// Try to register with duplicate email
	req := handlers.RegisterAdminRequest{
		Token:               adminToken,
		Name:                "User 2",
		Email:               "duplicate@test.com", // Same email
		Salt:                base64.RawURLEncoding.EncodeToString(salt),
		PublicKey:           base64.RawURLEncoding.EncodeToString(publicKey),
		EncryptionPublicKey: base64.RawURLEncoding.EncodeToString(encryptionKey),
	}

	// Marshal request
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal request: %v", err)
	}

	// Create HTTP request
	httpReq := httptest.NewRequest("POST", "/register/admin", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler := handlers.NewRegisterAdminHandler(setup.App)
	handler(w, httpReq)

	// Should return 409 Conflict
	if w.Code != http.StatusConflict {
		t.Errorf("Expected status %d, got %d", http.StatusConflict, w.Code)
	}
}

// TestRegistrationWithMissingFields tests registration with missing required fields
func TestRegistrationWithMissingFields(t *testing.T) {
	setup := NewTestSetup(t)
	defer setup.Teardown()

	adminToken := setup.CreateAdminSignupToken(t)

	// Create registration request with missing email
	req := handlers.RegisterAdminRequest{
		Token:               adminToken,
		Name:                "Test User",
		Email:               "", // Missing email
		Salt:                "dGVzdC1zYWx0",
		PublicKey:           "dGVzdC1wdWJsaWMta2V5Yw",
		EncryptionPublicKey: "dGVzdC1lbmMta2V5c2V0c2U",
	}

	// Marshal request
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal request: %v", err)
	}

	// Create HTTP request
	httpReq := httptest.NewRequest("POST", "/register/admin", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler := handlers.NewRegisterAdminHandler(setup.App)
	handler(w, httpReq)

	// Should return 400 Bad Request
	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status %d, got %d", http.StatusBadRequest, w.Code)
	}
}
