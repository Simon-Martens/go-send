package storage

import (
	"encoding/json"
	"fmt"
	"time"
)

// FileSecretUpdate captures the newly wrapped owner secret for a file.
type FileSecretUpdate struct {
	ID           string
	Ciphertext   string
	Nonce        string
	EphemeralPub string
	Version      int
}

// UpdateUserCredentialsAndSecrets updates the user's public keys/salt and associated file secrets atomically.
func (d *DB) UpdateUserCredentialsAndSecrets(userID int64, salt, publicKey, encryptionPublicKey string, settings json.RawMessage, files []FileSecretUpdate) error {
	tx, err := d.db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	if len(settings) == 0 {
		settings = json.RawMessage("{}")
	}

	now := time.Now().Unix()
	if _, err = tx.Exec(
		`UPDATE users SET salt = ?, public_key = ?, encryption_public_key = ?, updated = ?, settings = ? WHERE id = ?`,
		salt,
		publicKey,
		encryptionPublicKey,
		now,
		string(settings),
		userID,
	); err != nil {
		return err
	}

	for _, file := range files {
		if file.ID == "" {
			return fmt.Errorf("file id cannot be empty")
		}
		res, execErr := tx.Exec(
			`UPDATE files SET secret_ciphertext = ?, secret_nonce = ?, secret_ephemeral_pub = ?, secret_version = ? WHERE id = ? AND user_id = ?`,
			nullIfEmpty(file.Ciphertext),
			nullIfEmpty(file.Nonce),
			nullIfEmpty(file.EphemeralPub),
			file.Version,
			file.ID,
			userID,
		)
		if execErr != nil {
			return execErr
		}
		rows, rowsErr := res.RowsAffected()
		if rowsErr != nil {
			return rowsErr
		}
		if rows == 0 {
			return fmt.Errorf("file %s not found or not owned by user", file.ID)
		}
	}

	err = tx.Commit()
	return err
}
