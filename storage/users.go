package storage

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

// UserRole represents the role of a user in the system
type UserRole int

const (
	RoleAdmin UserRole = 0
	RoleUser  UserRole = 1
	RoleGuest UserRole = 2
)

// String returns the string representation of a UserRole
func (r UserRole) String() string {
	switch r {
	case RoleAdmin:
		return "admin"
	case RoleUser:
		return "user"
	case RoleGuest:
		return "guest"
	default:
		return "unknown"
	}
}

// IsValid checks if the role is valid
func (r UserRole) IsValid() bool {
	return r >= RoleAdmin && r <= RoleGuest
}

// User represents a user record in the database
type User struct {
	ID        int64            `json:"id"`
	Name      string           `json:"name"`
	Email     string           `json:"email"`
	Salt      string           `json:"salt"`
	PublicKey string           `json:"public_key"`
	Created   int64            `json:"created"`
	Updated   int64            `json:"updated"`
	Settings  json.RawMessage  `json:"settings"`
	Role      UserRole         `json:"role"`
	Active    bool             `json:"active"`
}

// Database operations for users

// CreateUser inserts a new user into the database
func (d *DB) CreateUser(user *User) error {
	now := time.Now().Unix()
	user.Created = now
	user.Updated = now

	// Ensure settings is at least an empty JSON object
	if len(user.Settings) == 0 {
		user.Settings = json.RawMessage("{}")
	}

	// Validate role
	if !user.Role.IsValid() {
		return fmt.Errorf("invalid role: %d", user.Role)
	}

	query := `
		INSERT INTO users (name, email, salt, public_key, created, updated, settings, role, active)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := d.db.Exec(
		query,
		user.Name,
		user.Email,
		user.Salt,
		user.PublicKey,
		user.Created,
		user.Updated,
		string(user.Settings),
		int(user.Role),
		boolToInt(user.Active),
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = id
	return nil
}

// GetUser retrieves a user by ID
func (d *DB) GetUser(id int64) (*User, error) {
	query := `
		SELECT id, name, email, salt, public_key, created, updated, settings, role, active
		FROM users
		WHERE id = ?
	`

	user := &User{}
	var settings string
	var role, active int

	err := d.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Salt,
		&user.PublicKey,
		&user.Created,
		&user.Updated,
		&settings,
		&role,
		&active,
	)
	if err != nil {
		return nil, err
	}

	user.Settings = json.RawMessage(settings)
	user.Role = UserRole(role)
	user.Active = intToBool(active)
	return user, nil
}

// GetUserByEmail retrieves a user by email address
func (d *DB) GetUserByEmail(email string) (*User, error) {
	query := `
		SELECT id, name, email, salt, public_key, created, updated, settings, role, active
		FROM users
		WHERE email = ?
	`

	user := &User{}
	var settings string
	var role, active int

	err := d.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Salt,
		&user.PublicKey,
		&user.Created,
		&user.Updated,
		&settings,
		&role,
		&active,
	)
	if err != nil {
		return nil, err
	}

	user.Settings = json.RawMessage(settings)
	user.Role = UserRole(role)
	user.Active = intToBool(active)
	return user, nil
}

// GetUserByName retrieves a user by name
func (d *DB) GetUserByName(name string) (*User, error) {
	query := `
		SELECT id, name, email, salt, public_key, created, updated, settings, role, active
		FROM users
		WHERE name = ?
	`

	user := &User{}
	var settings string
	var role, active int

	err := d.db.QueryRow(query, name).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Salt,
		&user.PublicKey,
		&user.Created,
		&user.Updated,
		&settings,
		&role,
		&active,
	)
	if err != nil {
		return nil, err
	}

	user.Settings = json.RawMessage(settings)
	user.Role = UserRole(role)
	user.Active = intToBool(active)
	return user, nil
}

// GetUserSaltByEmail retrieves only the salt for a user by email
// Useful for the login flow when the client needs the salt before key derivation
func (d *DB) GetUserSaltByEmail(email string) (string, error) {
	query := `SELECT salt FROM users WHERE email = ?`
	var salt string
	err := d.db.QueryRow(query, email).Scan(&salt)
	return salt, err
}

// GetUserSaltByName retrieves only the salt for a user by name
// Useful for the login flow when the client needs the salt before key derivation
func (d *DB) GetUserSaltByName(name string) (string, error) {
	query := `SELECT salt FROM users WHERE name = ?`
	var salt string
	err := d.db.QueryRow(query, name).Scan(&salt)
	return salt, err
}

// UpdateUser updates an existing user's information
func (d *DB) UpdateUser(user *User) error {
	user.Updated = time.Now().Unix()

	// Validate role
	if !user.Role.IsValid() {
		return fmt.Errorf("invalid role: %d", user.Role)
	}

	// Ensure settings is at least an empty JSON object
	if len(user.Settings) == 0 {
		user.Settings = json.RawMessage("{}")
	}

	query := `
		UPDATE users
		SET name = ?, email = ?, salt = ?, public_key = ?, updated = ?, settings = ?, role = ?, active = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(
		query,
		user.Name,
		user.Email,
		user.Salt,
		user.PublicKey,
		user.Updated,
		string(user.Settings),
		int(user.Role),
		boolToInt(user.Active),
		user.ID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// UpdateUserSettings updates only the settings field of a user
func (d *DB) UpdateUserSettings(id int64, settings json.RawMessage) error {
	query := `
		UPDATE users
		SET settings = ?, updated = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, string(settings), time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// UpdateUserRole updates only the role of a user
func (d *DB) UpdateUserRole(id int64, role UserRole) error {
	if !role.IsValid() {
		return fmt.Errorf("invalid role: %d", role)
	}

	query := `
		UPDATE users
		SET role = ?, updated = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, int(role), time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// DeactivateUser marks a user as inactive
func (d *DB) DeactivateUser(id int64) error {
	query := `
		UPDATE users
		SET active = 0, updated = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// ActivateUser marks a user as active
func (d *DB) ActivateUser(id int64) error {
	query := `
		UPDATE users
		SET active = 1, updated = ?
		WHERE id = ?
	`

	result, err := d.db.Exec(query, time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// DeleteUser removes a user from the database
func (d *DB) DeleteUser(id int64) error {
	query := `DELETE FROM users WHERE id = ?`
	result, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// UserExists checks if a user with the given ID exists
func (d *DB) UserExists(id int64) (bool, error) {
	query := `SELECT COUNT(*) FROM users WHERE id = ?`
	var count int
	err := d.db.QueryRow(query, id).Scan(&count)
	return count > 0, err
}

// EmailExists checks if a user with the given email exists
func (d *DB) EmailExists(email string) (bool, error) {
	query := `SELECT COUNT(*) FROM users WHERE email = ?`
	var count int
	err := d.db.QueryRow(query, email).Scan(&count)
	return count > 0, err
}

// ListUsers retrieves all users, optionally filtered by role
func (d *DB) ListUsers(role *UserRole) ([]*User, error) {
	var query string
	var args []interface{}

	if role != nil {
		if !role.IsValid() {
			return nil, fmt.Errorf("invalid role: %d", *role)
		}
		query = `
			SELECT id, name, email, salt, public_key, created, updated, settings, role, active
			FROM users
			WHERE role = ?
			ORDER BY created DESC
		`
		args = append(args, int(*role))
	} else {
		query = `
			SELECT id, name, email, salt, public_key, created, updated, settings, role, active
			FROM users
			ORDER BY created DESC
		`
	}

	rows, err := d.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		user := &User{}
		var settings string
		var role, active int

		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.Salt,
			&user.PublicKey,
			&user.Created,
			&user.Updated,
			&settings,
			&role,
			&active,
		)
		if err != nil {
			return nil, err
		}

		user.Settings = json.RawMessage(settings)
		user.Role = UserRole(role)
		user.Active = intToBool(active)
		users = append(users, user)
	}

	return users, rows.Err()
}

// CountUsers returns the total number of users, optionally filtered by role
func (d *DB) CountUsers(role *UserRole) (int, error) {
	var query string
	var args []interface{}

	if role != nil {
		if !role.IsValid() {
			return 0, fmt.Errorf("invalid role: %d", *role)
		}
		query = `SELECT COUNT(*) FROM users WHERE role = ?`
		args = append(args, int(*role))
	} else {
		query = `SELECT COUNT(*) FROM users`
	}

	var count int
	err := d.db.QueryRow(query, args...).Scan(&count)
	return count, err
}
