package storage

import (
	"database/sql"
	"io"
	"os"
	"path/filepath"
	"time"
)

// FileMetadata represents a file record in the database
type FileMetadata struct {
	ID         string
	OwnerToken string
	Metadata   string // base64 encrypted metadata
	AuthKey    string // base64 auth verifier
	Nonce      string // base64 nonce
	DlLimit    int
	DlCount    int
	Password   bool
	CreatedAt  int64
	ExpiresAt  int64
	// Owner: who uploaded the file (has metadata access via owner token or session)
	OwnerUserID        *int64 // if uploaded by logged-in user
	OwnerAuthTokenID   *int64 // if uploaded by guest with auth link
	SecretCiphertext   string // master key encrypted for owner (if owner is a user)
	SecretEphemeralPub string // ephemeral public key for owner ECDH
	SecretNonce        string // nonce for owner key encryption
	SecretVersion      int
	// Recipient: who file is encrypted FOR (optional, always a user if set)
	RecipientUserID             *int64
	RecipientSecretCiphertext   string // master key encrypted for recipient
	RecipientSecretEphemeralPub string
	RecipientSecretNonce        string
	RecipientSecretVersion      int
}

// FileWithUserInfo represents a file with owner and recipient user information
type FileWithUserInfo struct {
	FileMetadata
	OwnerName      string
	OwnerEmail     string
	RecipientName  string
	RecipientEmail string
	AuthLinkLabel  string
}

// Database operations for files

func (d *DB) CreateFile(meta *FileMetadata) error {
	query := `
		INSERT INTO files (
			id, owner_token, metadata, auth_key, nonce,
			dl_limit, dl_count, password, created_at, expires_at,
			owner_user_id, owner_auth_token_id,
			secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version,
			recipient_user_id, recipient_secret_ciphertext, recipient_secret_ephemeral_pub,
			recipient_secret_nonce, recipient_secret_version
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	var ownerUserID interface{}
	if meta.OwnerUserID != nil {
		ownerUserID = *meta.OwnerUserID
	}

	var ownerAuthTokenID interface{}
	if meta.OwnerAuthTokenID != nil {
		ownerAuthTokenID = *meta.OwnerAuthTokenID
	}

	var recipientUserID interface{}
	if meta.RecipientUserID != nil {
		recipientUserID = *meta.RecipientUserID
	}

	_, err := d.db.Exec(
		query,
		meta.ID,
		meta.OwnerToken,
		meta.Metadata,
		meta.AuthKey,
		meta.Nonce,
		meta.DlLimit,
		meta.DlCount,
		boolToInt(meta.Password),
		meta.CreatedAt,
		meta.ExpiresAt,
		ownerUserID,
		ownerAuthTokenID,
		nullIfEmpty(meta.SecretCiphertext),
		nullIfEmpty(meta.SecretEphemeralPub),
		nullIfEmpty(meta.SecretNonce),
		meta.SecretVersion,
		recipientUserID,
		nullIfEmpty(meta.RecipientSecretCiphertext),
		nullIfEmpty(meta.RecipientSecretEphemeralPub),
		nullIfEmpty(meta.RecipientSecretNonce),
		meta.RecipientSecretVersion,
	)

	return err
}

func (d *DB) GetFile(id string) (*FileMetadata, error) {
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       owner_user_id, owner_auth_token_id,
		       secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version,
		       recipient_user_id, recipient_secret_ciphertext, recipient_secret_ephemeral_pub,
		       recipient_secret_nonce, recipient_secret_version
		FROM files
		WHERE id = ?
	`

	meta := &FileMetadata{}
	var password int
	var ownerUserID, ownerAuthTokenID sql.NullInt64
	var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
	var secretVersion sql.NullInt64
	var recipientUserID sql.NullInt64
	var recipientSecretCiphertext, recipientSecretEphemeralPub, recipientSecretNonce sql.NullString
	var recipientSecretVersion sql.NullInt64

	err := d.db.QueryRow(query, id).Scan(
		&meta.ID,
		&meta.OwnerToken,
		&meta.Metadata,
		&meta.AuthKey,
		&meta.Nonce,
		&meta.DlLimit,
		&meta.DlCount,
		&password,
		&meta.CreatedAt,
		&meta.ExpiresAt,
		&ownerUserID,
		&ownerAuthTokenID,
		&secretCiphertext,
		&secretEphemeralPub,
		&secretNonce,
		&secretVersion,
		&recipientUserID,
		&recipientSecretCiphertext,
		&recipientSecretEphemeralPub,
		&recipientSecretNonce,
		&recipientSecretVersion,
	)

	if err != nil {
		return nil, err
	}

	meta.Password = intToBool(password)

	if ownerUserID.Valid {
		val := ownerUserID.Int64
		meta.OwnerUserID = &val
	}
	if ownerAuthTokenID.Valid {
		val := ownerAuthTokenID.Int64
		meta.OwnerAuthTokenID = &val
	}
	if secretCiphertext.Valid {
		meta.SecretCiphertext = secretCiphertext.String
	}
	if secretEphemeralPub.Valid {
		meta.SecretEphemeralPub = secretEphemeralPub.String
	}
	if secretNonce.Valid {
		meta.SecretNonce = secretNonce.String
	}
	if secretVersion.Valid {
		meta.SecretVersion = int(secretVersion.Int64)
	}
	if recipientUserID.Valid {
		val := recipientUserID.Int64
		meta.RecipientUserID = &val
	}
	if recipientSecretCiphertext.Valid {
		meta.RecipientSecretCiphertext = recipientSecretCiphertext.String
	}
	if recipientSecretEphemeralPub.Valid {
		meta.RecipientSecretEphemeralPub = recipientSecretEphemeralPub.String
	}
	if recipientSecretNonce.Valid {
		meta.RecipientSecretNonce = recipientSecretNonce.String
	}
	if recipientSecretVersion.Valid {
		meta.RecipientSecretVersion = int(recipientSecretVersion.Int64)
	}

	return meta, nil
}

func (d *DB) GetFilesByUserID(userID int64) ([]*FileMetadata, error) {
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       owner_user_id, owner_auth_token_id,
		       secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version,
		       recipient_user_id, recipient_secret_ciphertext, recipient_secret_ephemeral_pub,
		       recipient_secret_nonce, recipient_secret_version
		FROM files
		WHERE owner_user_id = ? OR recipient_user_id = ?
		ORDER BY created_at DESC
	`

	rows, err := d.db.Query(query, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRows(rows)
}

// GetFilesByUserIDWithInfo retrieves all files associated with a user (owner or recipient) with user and auth link information
func (d *DB) GetFilesByUserIDWithInfo(userID int64) ([]*FileWithUserInfo, error) {
	query := `
		SELECT f.id, f.owner_token, f.metadata, f.auth_key, f.nonce,
		       f.dl_limit, f.dl_count, f.password, f.created_at, f.expires_at,
		       f.owner_user_id, f.owner_auth_token_id,
		       f.secret_ciphertext, f.secret_ephemeral_pub, f.secret_nonce, f.secret_version,
		       f.recipient_user_id, f.recipient_secret_ciphertext, f.recipient_secret_ephemeral_pub,
		       f.recipient_secret_nonce, f.recipient_secret_version,
		       owner.name, owner.email,
		       recipient.name, recipient.email,
		       authlink.name
		FROM files f
		LEFT JOIN users owner ON f.owner_user_id = owner.id
		LEFT JOIN users recipient ON f.recipient_user_id = recipient.id
		LEFT JOIN authtokens authlink ON f.owner_auth_token_id = authlink.id
		WHERE f.owner_user_id = ? OR f.recipient_user_id = ?
		ORDER BY f.created_at DESC
	`

	rows, err := d.db.Query(query, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRowsWithInfoAndAuthLink(rows)
}

// GetInboxFiles retrieves all files where the user is the recipient (not expired)
func (d *DB) GetInboxFiles(userID int64) ([]*FileMetadata, error) {
	now := time.Now().Unix()
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       owner_user_id, owner_auth_token_id,
		       secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version,
		       recipient_user_id, recipient_secret_ciphertext, recipient_secret_ephemeral_pub,
		       recipient_secret_nonce, recipient_secret_version
		FROM files
		WHERE recipient_user_id = ? AND expires_at > ?
		ORDER BY created_at DESC
	`

	rows, err := d.db.Query(query, userID, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRows(rows)
}

// GetOutboxFiles retrieves all files where the user is the owner (not expired)
func (d *DB) GetOutboxFiles(userID int64) ([]*FileMetadata, error) {
	now := time.Now().Unix()
	query := `
		SELECT id, owner_token, metadata, auth_key, nonce,
		       dl_limit, dl_count, password, created_at, expires_at,
		       owner_user_id, owner_auth_token_id,
		       secret_ciphertext, secret_ephemeral_pub, secret_nonce, secret_version,
		       recipient_user_id, recipient_secret_ciphertext, recipient_secret_ephemeral_pub,
		       recipient_secret_nonce, recipient_secret_version
		FROM files
		WHERE owner_user_id = ? AND expires_at > ?
		ORDER BY created_at DESC
	`

	rows, err := d.db.Query(query, userID, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRows(rows)
}

// GetInboxFilesWithInfo retrieves inbox files with owner user information
func (d *DB) GetInboxFilesWithInfo(userID int64) ([]*FileWithUserInfo, error) {
	now := time.Now().Unix()
	query := `
		SELECT f.id, f.owner_token, f.metadata, f.auth_key, f.nonce,
		       f.dl_limit, f.dl_count, f.password, f.created_at, f.expires_at,
		       f.owner_user_id, f.owner_auth_token_id,
		       f.secret_ciphertext, f.secret_ephemeral_pub, f.secret_nonce, f.secret_version,
		       f.recipient_user_id, f.recipient_secret_ciphertext, f.recipient_secret_ephemeral_pub,
		       f.recipient_secret_nonce, f.recipient_secret_version,
		       owner.name, owner.email,
		       recipient.name, recipient.email
		FROM files f
		LEFT JOIN users owner ON f.owner_user_id = owner.id
		LEFT JOIN users recipient ON f.recipient_user_id = recipient.id
		WHERE f.recipient_user_id = ? AND f.expires_at > ?
		ORDER BY f.created_at DESC
	`

	rows, err := d.db.Query(query, userID, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRowsWithInfo(rows)
}

// GetOutboxFilesWithInfo retrieves outbox files with recipient user information
func (d *DB) GetOutboxFilesWithInfo(userID int64) ([]*FileWithUserInfo, error) {
	now := time.Now().Unix()
	query := `
		SELECT f.id, f.owner_token, f.metadata, f.auth_key, f.nonce,
		       f.dl_limit, f.dl_count, f.password, f.created_at, f.expires_at,
		       f.owner_user_id, f.owner_auth_token_id,
		       f.secret_ciphertext, f.secret_ephemeral_pub, f.secret_nonce, f.secret_version,
		       f.recipient_user_id, f.recipient_secret_ciphertext, f.recipient_secret_ephemeral_pub,
		       f.recipient_secret_nonce, f.recipient_secret_version,
		       owner.name, owner.email,
		       recipient.name, recipient.email
		FROM files f
		LEFT JOIN users owner ON f.owner_user_id = owner.id
		LEFT JOIN users recipient ON f.recipient_user_id = recipient.id
		WHERE f.owner_user_id = ? AND f.expires_at > ?
		ORDER BY f.created_at DESC
	`

	rows, err := d.db.Query(query, userID, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return d.scanFileRowsWithInfo(rows)
}

// GetFileWithInfo retrieves a single file with owner and recipient information
func (d *DB) GetFileWithInfo(fileID string) (*FileWithUserInfo, error) {
	query := `
		SELECT f.id, f.owner_token, f.metadata, f.auth_key, f.nonce,
		       f.dl_limit, f.dl_count, f.password, f.created_at, f.expires_at,
		       f.owner_user_id, f.owner_auth_token_id,
		       f.secret_ciphertext, f.secret_ephemeral_pub, f.secret_nonce, f.secret_version,
		       f.recipient_user_id, f.recipient_secret_ciphertext, f.recipient_secret_ephemeral_pub,
		       f.recipient_secret_nonce, f.recipient_secret_version,
		       owner.name, owner.email,
		       recipient.name, recipient.email
		FROM files f
		LEFT JOIN users owner ON f.owner_user_id = owner.id
		LEFT JOIN users recipient ON f.recipient_user_id = recipient.id
		WHERE f.id = ?
	`

	fileInfo := &FileWithUserInfo{}
	var password int
	var ownerUserID, ownerAuthTokenID sql.NullInt64
	var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
	var secretVersion sql.NullInt64
	var recipientUserID sql.NullInt64
	var recipientSecretCiphertext, recipientSecretEphemeralPub, recipientSecretNonce sql.NullString
	var recipientSecretVersion sql.NullInt64
	var ownerName, ownerEmail, recipientName, recipientEmail sql.NullString

	err := d.db.QueryRow(query, fileID).Scan(
		&fileInfo.ID,
		&fileInfo.OwnerToken,
		&fileInfo.Metadata,
		&fileInfo.AuthKey,
		&fileInfo.Nonce,
		&fileInfo.DlLimit,
		&fileInfo.DlCount,
		&password,
		&fileInfo.CreatedAt,
		&fileInfo.ExpiresAt,
		&ownerUserID,
		&ownerAuthTokenID,
		&secretCiphertext,
		&secretEphemeralPub,
		&secretNonce,
		&secretVersion,
		&recipientUserID,
		&recipientSecretCiphertext,
		&recipientSecretEphemeralPub,
		&recipientSecretNonce,
		&recipientSecretVersion,
		&ownerName,
		&ownerEmail,
		&recipientName,
		&recipientEmail,
	)

	if err != nil {
		return nil, err
	}

	fileInfo.Password = intToBool(password)

	if ownerUserID.Valid {
		val := ownerUserID.Int64
		fileInfo.OwnerUserID = &val
	}
	if ownerAuthTokenID.Valid {
		val := ownerAuthTokenID.Int64
		fileInfo.OwnerAuthTokenID = &val
	}
	if secretCiphertext.Valid {
		fileInfo.SecretCiphertext = secretCiphertext.String
	}
	if secretEphemeralPub.Valid {
		fileInfo.SecretEphemeralPub = secretEphemeralPub.String
	}
	if secretNonce.Valid {
		fileInfo.SecretNonce = secretNonce.String
	}
	if secretVersion.Valid {
		fileInfo.SecretVersion = int(secretVersion.Int64)
	}
	if recipientUserID.Valid {
		val := recipientUserID.Int64
		fileInfo.RecipientUserID = &val
	}
	if recipientSecretCiphertext.Valid {
		fileInfo.RecipientSecretCiphertext = recipientSecretCiphertext.String
	}
	if recipientSecretEphemeralPub.Valid {
		fileInfo.RecipientSecretEphemeralPub = recipientSecretEphemeralPub.String
	}
	if recipientSecretNonce.Valid {
		fileInfo.RecipientSecretNonce = recipientSecretNonce.String
	}
	if recipientSecretVersion.Valid {
		fileInfo.RecipientSecretVersion = int(recipientSecretVersion.Int64)
	}
	if ownerName.Valid {
		fileInfo.OwnerName = ownerName.String
	}
	if ownerEmail.Valid {
		fileInfo.OwnerEmail = ownerEmail.String
	}
	if recipientName.Valid {
		fileInfo.RecipientName = recipientName.String
	}
	if recipientEmail.Valid {
		fileInfo.RecipientEmail = recipientEmail.String
	}

	return fileInfo, nil
}

// scanFileRowsWithInfo scans file rows with user information
func (d *DB) scanFileRowsWithInfo(rows *sql.Rows) ([]*FileWithUserInfo, error) {
	var files []*FileWithUserInfo
	for rows.Next() {
		fileInfo := &FileWithUserInfo{}
		var password int
		var ownerUserID, ownerAuthTokenID sql.NullInt64
		var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
		var secretVersion sql.NullInt64
		var recipientUserID sql.NullInt64
		var recipientSecretCiphertext, recipientSecretEphemeralPub, recipientSecretNonce sql.NullString
		var recipientSecretVersion sql.NullInt64
		var ownerName, ownerEmail, recipientName, recipientEmail sql.NullString

		if err := rows.Scan(
			&fileInfo.ID,
			&fileInfo.OwnerToken,
			&fileInfo.Metadata,
			&fileInfo.AuthKey,
			&fileInfo.Nonce,
			&fileInfo.DlLimit,
			&fileInfo.DlCount,
			&password,
			&fileInfo.CreatedAt,
			&fileInfo.ExpiresAt,
			&ownerUserID,
			&ownerAuthTokenID,
			&secretCiphertext,
			&secretEphemeralPub,
			&secretNonce,
			&secretVersion,
			&recipientUserID,
			&recipientSecretCiphertext,
			&recipientSecretEphemeralPub,
			&recipientSecretNonce,
			&recipientSecretVersion,
			&ownerName,
			&ownerEmail,
			&recipientName,
			&recipientEmail,
		); err != nil {
			return nil, err
		}

		fileInfo.Password = intToBool(password)

		if ownerUserID.Valid {
			val := ownerUserID.Int64
			fileInfo.OwnerUserID = &val
		}
		if ownerAuthTokenID.Valid {
			val := ownerAuthTokenID.Int64
			fileInfo.OwnerAuthTokenID = &val
		}
		if secretCiphertext.Valid {
			fileInfo.SecretCiphertext = secretCiphertext.String
		}
		if secretEphemeralPub.Valid {
			fileInfo.SecretEphemeralPub = secretEphemeralPub.String
		}
		if secretNonce.Valid {
			fileInfo.SecretNonce = secretNonce.String
		}
		if secretVersion.Valid {
			fileInfo.SecretVersion = int(secretVersion.Int64)
		}
		if recipientUserID.Valid {
			val := recipientUserID.Int64
			fileInfo.RecipientUserID = &val
		}
		if recipientSecretCiphertext.Valid {
			fileInfo.RecipientSecretCiphertext = recipientSecretCiphertext.String
		}
		if recipientSecretEphemeralPub.Valid {
			fileInfo.RecipientSecretEphemeralPub = recipientSecretEphemeralPub.String
		}
		if recipientSecretNonce.Valid {
			fileInfo.RecipientSecretNonce = recipientSecretNonce.String
		}
		if recipientSecretVersion.Valid {
			fileInfo.RecipientSecretVersion = int(recipientSecretVersion.Int64)
		}
		if ownerName.Valid {
			fileInfo.OwnerName = ownerName.String
		}
		if ownerEmail.Valid {
			fileInfo.OwnerEmail = ownerEmail.String
		}
		if recipientName.Valid {
			fileInfo.RecipientName = recipientName.String
		}
		if recipientEmail.Valid {
			fileInfo.RecipientEmail = recipientEmail.String
		}

		files = append(files, fileInfo)
	}

	return files, rows.Err()
}

// scanFileRowsWithInfoAndAuthLink scans file rows with user and auth link information
func (d *DB) scanFileRowsWithInfoAndAuthLink(rows *sql.Rows) ([]*FileWithUserInfo, error) {
	var files []*FileWithUserInfo
	for rows.Next() {
		fileInfo := &FileWithUserInfo{}
		var password int
		var ownerUserID, ownerAuthTokenID sql.NullInt64
		var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
		var secretVersion sql.NullInt64
		var recipientUserID sql.NullInt64
		var recipientSecretCiphertext, recipientSecretEphemeralPub, recipientSecretNonce sql.NullString
		var recipientSecretVersion sql.NullInt64
		var ownerName, ownerEmail, recipientName, recipientEmail, authLinkLabel sql.NullString

		if err := rows.Scan(
			&fileInfo.ID,
			&fileInfo.OwnerToken,
			&fileInfo.Metadata,
			&fileInfo.AuthKey,
			&fileInfo.Nonce,
			&fileInfo.DlLimit,
			&fileInfo.DlCount,
			&password,
			&fileInfo.CreatedAt,
			&fileInfo.ExpiresAt,
			&ownerUserID,
			&ownerAuthTokenID,
			&secretCiphertext,
			&secretEphemeralPub,
			&secretNonce,
			&secretVersion,
			&recipientUserID,
			&recipientSecretCiphertext,
			&recipientSecretEphemeralPub,
			&recipientSecretNonce,
			&recipientSecretVersion,
			&ownerName,
			&ownerEmail,
			&recipientName,
			&recipientEmail,
			&authLinkLabel,
		); err != nil {
			return nil, err
		}

		fileInfo.Password = intToBool(password)

		if ownerUserID.Valid {
			val := ownerUserID.Int64
			fileInfo.OwnerUserID = &val
		}
		if ownerAuthTokenID.Valid {
			val := ownerAuthTokenID.Int64
			fileInfo.OwnerAuthTokenID = &val
		}
		if secretCiphertext.Valid {
			fileInfo.SecretCiphertext = secretCiphertext.String
		}
		if secretEphemeralPub.Valid {
			fileInfo.SecretEphemeralPub = secretEphemeralPub.String
		}
		if secretNonce.Valid {
			fileInfo.SecretNonce = secretNonce.String
		}
		if secretVersion.Valid {
			fileInfo.SecretVersion = int(secretVersion.Int64)
		}
		if recipientUserID.Valid {
			val := recipientUserID.Int64
			fileInfo.RecipientUserID = &val
		}
		if recipientSecretCiphertext.Valid {
			fileInfo.RecipientSecretCiphertext = recipientSecretCiphertext.String
		}
		if recipientSecretEphemeralPub.Valid {
			fileInfo.RecipientSecretEphemeralPub = recipientSecretEphemeralPub.String
		}
		if recipientSecretNonce.Valid {
			fileInfo.RecipientSecretNonce = recipientSecretNonce.String
		}
		if recipientSecretVersion.Valid {
			fileInfo.RecipientSecretVersion = int(recipientSecretVersion.Int64)
		}
		if ownerName.Valid {
			fileInfo.OwnerName = ownerName.String
		}
		if ownerEmail.Valid {
			fileInfo.OwnerEmail = ownerEmail.String
		}
		if recipientName.Valid {
			fileInfo.RecipientName = recipientName.String
		}
		if recipientEmail.Valid {
			fileInfo.RecipientEmail = recipientEmail.String
		}
		if authLinkLabel.Valid {
			fileInfo.AuthLinkLabel = authLinkLabel.String
		}

		files = append(files, fileInfo)
	}

	return files, rows.Err()
}

// scanFileRows is a helper to scan multiple file rows (extracted for reuse)
func (d *DB) scanFileRows(rows *sql.Rows) ([]*FileMetadata, error) {
	var files []*FileMetadata
	for rows.Next() {
		meta := &FileMetadata{}
		var password int
		var ownerUserID, ownerAuthTokenID sql.NullInt64
		var secretCiphertext, secretEphemeralPub, secretNonce sql.NullString
		var secretVersion sql.NullInt64
		var recipientUserID sql.NullInt64
		var recipientSecretCiphertext, recipientSecretEphemeralPub, recipientSecretNonce sql.NullString
		var recipientSecretVersion sql.NullInt64

		if err := rows.Scan(
			&meta.ID,
			&meta.OwnerToken,
			&meta.Metadata,
			&meta.AuthKey,
			&meta.Nonce,
			&meta.DlLimit,
			&meta.DlCount,
			&password,
			&meta.CreatedAt,
			&meta.ExpiresAt,
			&ownerUserID,
			&ownerAuthTokenID,
			&secretCiphertext,
			&secretEphemeralPub,
			&secretNonce,
			&secretVersion,
			&recipientUserID,
			&recipientSecretCiphertext,
			&recipientSecretEphemeralPub,
			&recipientSecretNonce,
			&recipientSecretVersion,
		); err != nil {
			return nil, err
		}

		meta.Password = intToBool(password)

		if ownerUserID.Valid {
			val := ownerUserID.Int64
			meta.OwnerUserID = &val
		}
		if ownerAuthTokenID.Valid {
			val := ownerAuthTokenID.Int64
			meta.OwnerAuthTokenID = &val
		}
		if secretCiphertext.Valid {
			meta.SecretCiphertext = secretCiphertext.String
		}
		if secretEphemeralPub.Valid {
			meta.SecretEphemeralPub = secretEphemeralPub.String
		}
		if secretNonce.Valid {
			meta.SecretNonce = secretNonce.String
		}
		if secretVersion.Valid {
			meta.SecretVersion = int(secretVersion.Int64)
		}
		if recipientUserID.Valid {
			val := recipientUserID.Int64
			meta.RecipientUserID = &val
		}
		if recipientSecretCiphertext.Valid {
			meta.RecipientSecretCiphertext = recipientSecretCiphertext.String
		}
		if recipientSecretEphemeralPub.Valid {
			meta.RecipientSecretEphemeralPub = recipientSecretEphemeralPub.String
		}
		if recipientSecretNonce.Valid {
			meta.RecipientSecretNonce = recipientSecretNonce.String
		}
		if recipientSecretVersion.Valid {
			meta.RecipientSecretVersion = int(recipientSecretVersion.Int64)
		}

		files = append(files, meta)
	}

	return files, rows.Err()
}

// ClearUserOwnership removes the user association from all files where user is owner or recipient.
func (d *DB) ClearUserOwnership(userID int64) error {
	// Clear owner reference
	_, err := d.db.Exec(`UPDATE files SET owner_user_id = NULL WHERE owner_user_id = ?`, userID)
	if err != nil {
		return err
	}

	// Clear recipient reference
	_, err = d.db.Exec(`UPDATE files SET recipient_user_id = NULL WHERE recipient_user_id = ?`, userID)
	return err
}

// DeleteFilesByUser removes all files owned by the specified user, including disk data.
func (d *DB) DeleteFilesByUser(userID int64) error {
	rows, err := d.db.Query(`SELECT id FROM files WHERE owner_user_id = ?`, userID)
	if err != nil {
		return err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return err
	}

	for _, id := range ids {
		DeleteFile(d.fileDir, id) // best effort
	}

	_, err = d.db.Exec(`DELETE FROM files WHERE owner_user_id = ?`, userID)
	return err
}

func (d *DB) UpdateNonce(id, nonce string) error {
	query := `UPDATE files SET nonce = ? WHERE id = ?`
	_, err := d.db.Exec(query, nonce, id)
	return err
}

func (d *DB) IncrementDownload(id string) error {
	query := `UPDATE files SET dl_count = dl_count + 1 WHERE id = ?`
	_, err := d.db.Exec(query, id)
	return err
}

func (d *DB) DeleteFileRecord(id string) error {
	query := `DELETE FROM files WHERE id = ?`
	_, err := d.db.Exec(query, id)
	return err
}

func (d *DB) SetPassword(id, authKey string) error {
	query := `UPDATE files SET auth_key = ?, password = 1 WHERE id = ?`
	_, err := d.db.Exec(query, authKey, id)
	return err
}

func (d *DB) Exists(id string) (bool, error) {
	query := `SELECT COUNT(*) FROM files WHERE id = ?`
	var count int
	err := d.db.QueryRow(query, id).Scan(&count)
	return count > 0, err
}

func (d *DB) CleanupExpired() error {
	now := time.Now().Unix()

	// First, get all expired file IDs
	query := `SELECT id FROM files WHERE expires_at < ?`
	rows, err := d.db.Query(query, now)
	if err != nil {
		return err
	}
	defer rows.Close()

	var expiredIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		expiredIDs = append(expiredIDs, id)
	}

	// Delete files from disk
	for _, id := range expiredIDs {
		DeleteFile(d.fileDir, id) // Ignore errors, file might already be deleted
	}

	// Delete database entries
	deleteQuery := `DELETE FROM files WHERE expires_at < ?`
	_, err = d.db.Exec(deleteQuery, now)
	return err
}

// GetFilesExpiringWithin returns file IDs and expiration times for files expiring within the given duration
func (d *DB) GetFilesExpiringWithin(duration time.Duration) ([]struct {
	ID        string
	ExpiresAt int64
}, error) {
	now := time.Now().Unix()
	until := now + int64(duration.Seconds())

	query := `SELECT id, expires_at FROM files WHERE expires_at > ? AND expires_at <= ?`
	rows, err := d.db.Query(query, now, until)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []struct {
		ID        string
		ExpiresAt int64
	}
	for rows.Next() {
		var f struct {
			ID        string
			ExpiresAt int64
		}
		if err := rows.Scan(&f.ID, &f.ExpiresAt); err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return files, rows.Err()
}

// Helper functions

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}

func intToBool(i int) bool {
	return i != 0
}

func nullIfEmpty(s string) interface{} {
	if s == "" {
		return nil
	}
	return s
}

// Filesystem operations for files

// SaveFile saves uploaded data to disk
func SaveFile(fileDir, id string, data io.Reader) error {
	filePath := filepath.Join(fileDir, id)
	f, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = io.Copy(f, data)
	return err
}

// GetFileSize returns the size of a file
func GetFileSize(fileDir, id string) (int64, error) {
	filePath := filepath.Join(fileDir, id)
	info, err := os.Stat(filePath)
	if err != nil {
		return 0, err
	}
	return info.Size(), nil
}

// OpenFile opens a file for reading
func OpenFile(fileDir, id string) (*os.File, error) {
	filePath := filepath.Join(fileDir, id)
	return os.Open(filePath)
}

// DeleteFile deletes a file from disk
func DeleteFile(fileDir, id string) error {
	filePath := filepath.Join(fileDir, id)
	return os.Remove(filePath)
}

// FileExists checks if a file exists on disk
func FileExists(fileDir, id string) bool {
	filePath := filepath.Join(fileDir, id)
	_, err := os.Stat(filePath)
	return err == nil
}
