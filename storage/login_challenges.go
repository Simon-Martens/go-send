package storage

import "time"

// LoginChallenge represents a single login challenge nonce
type LoginChallenge struct {
	ID      int64  `json:"id"`
	UserID  int64  `json:"user_id"`
	Nonce   string `json:"nonce"`
	Expires int64  `json:"expires"`
	Used    bool   `json:"used"`
	Created int64  `json:"created"`
}

// CreateLoginChallenge stores a new login challenge for a user
func (d *DB) CreateLoginChallenge(userID int64, nonce string, ttl time.Duration) (*LoginChallenge, error) {
	now := time.Now().Unix()
	challenge := &LoginChallenge{
		UserID:  userID,
		Nonce:   nonce,
		Expires: now + int64(ttl.Seconds()),
		Used:    false,
		Created: now,
	}

	query := `
		INSERT INTO login_challenges (user_id, nonce, expires, used, created)
		VALUES (?, ?, ?, 0, ?)
	`

	result, err := d.db.Exec(query, challenge.UserID, challenge.Nonce, challenge.Expires, challenge.Created)
	if err != nil {
		return nil, err
	}

	if id, err := result.LastInsertId(); err == nil {
		challenge.ID = id
	}

	return challenge, nil
}

// GetLoginChallenge fetches a challenge by ID
func (d *DB) GetLoginChallenge(id int64) (*LoginChallenge, error) {
	query := `
		SELECT id, user_id, nonce, expires, used, created
		FROM login_challenges
		WHERE id = ?
	`

	row := d.db.QueryRow(query, id)
	challenge := &LoginChallenge{}
	var used int

	if err := row.Scan(&challenge.ID, &challenge.UserID, &challenge.Nonce, &challenge.Expires, &used, &challenge.Created); err != nil {
		return nil, err
	}

	challenge.Used = used == 1
	return challenge, nil
}

// MarkLoginChallengeUsed marks a challenge as consumed
func (d *DB) MarkLoginChallengeUsed(id int64) error {
	query := `
		UPDATE login_challenges
		SET used = 1
		WHERE id = ?
	`
	_, err := d.db.Exec(query, id)
	return err
}

// CleanupExpiredChallenges removes expired challenges to keep the table small
func (d *DB) CleanupExpiredChallenges(now time.Time) error {
	query := `
		DELETE FROM login_challenges WHERE expires <= ?
	`
	_, err := d.db.Exec(query, now.Unix())
	return err
}
