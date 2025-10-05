package storage

import (
	"database/sql"
	"errors"
	"time"
)

var (
	ErrAdminNotFound   = errors.New("admin not found")
	ErrSessionNotFound = errors.New("session not found")
	ErrSessionExpired  = errors.New("session expired")
	ErrLinkNotFound    = errors.New("auth link not found")
	ErrLinkExpired     = errors.New("auth link expired")
	ErrLinkDepleted    = errors.New("auth link depleted")
)

type Admin struct {
	ID           int64
	Username     string
	PasswordHash string
	CreatedAt    int64
}

func (d *DB) GetAdminByID(id int64) (*Admin, error) {
	admin := &Admin{}
	row := d.db.QueryRow(`SELECT id, username, password_hash, created_at FROM admins WHERE id = ?`, id)
	if err := row.Scan(&admin.ID, &admin.Username, &admin.PasswordHash, &admin.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrAdminNotFound
		}
		return nil, err
	}
	return admin, nil
}

func (d *DB) GetAdminByUsername(username string) (*Admin, error) {
	admin := &Admin{}
	row := d.db.QueryRow(`SELECT id, username, password_hash, created_at FROM admins WHERE username = ?`, username)
	if err := row.Scan(&admin.ID, &admin.Username, &admin.PasswordHash, &admin.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrAdminNotFound
		}
		return nil, err
	}
	return admin, nil
}

func (d *DB) ListAdmins() ([]Admin, error) {
	rows, err := d.db.Query(`SELECT id, username, created_at FROM admins ORDER BY username ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var admins []Admin
	for rows.Next() {
		var admin Admin
		if err := rows.Scan(&admin.ID, &admin.Username, &admin.CreatedAt); err != nil {
			return nil, err
		}
		admins = append(admins, admin)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return admins, nil
}

type Session struct {
	ID        int64
	TokenHash string
	UserType  string
	AdminID   sql.NullInt64
	LinkID    sql.NullInt64
	ExpiresAt int64
	CreatedAt int64
}

type AuthLink struct {
	ID        int64
	TokenHash string
	ExpiresAt sql.NullInt64
	MaxUses   int
	UseCount  int
	CreatedAt int64
	CreatedBy sql.NullInt64
	Username  sql.NullString
}

func (d *DB) GetPrimaryAdmin() (*Admin, error) {
	row := d.db.QueryRow(`SELECT id, username, password_hash, created_at FROM admins ORDER BY id ASC LIMIT 1`)
	admin := &Admin{}
	if err := row.Scan(&admin.ID, &admin.Username, &admin.PasswordHash, &admin.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrAdminNotFound
		}
		return nil, err
	}
	return admin, nil
}

func (d *DB) CreateSession(session *Session) (int64, error) {
	res, err := d.db.Exec(
		`INSERT INTO sessions (token_hash, user_type, admin_id, link_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
		session.TokenHash,
		session.UserType,
		nullableInt64(session.AdminID),
		nullableInt64(session.LinkID),
		session.ExpiresAt,
		session.CreatedAt,
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func nullableInt64(n sql.NullInt64) interface{} {
	if n.Valid {
		return n.Int64
	}
	return nil
}

func nullableString(s sql.NullString) interface{} {
	if s.Valid {
		return s.String
	}
	return nil
}

func (d *DB) GetSessionByHash(hash string) (*Session, error) {
	session := &Session{}
	var adminID sql.NullInt64
	var linkID sql.NullInt64

	err := d.db.QueryRow(
		`SELECT id, token_hash, user_type, admin_id, link_id, expires_at, created_at FROM sessions WHERE token_hash = ?`,
		hash,
	).Scan(
		&session.ID,
		&session.TokenHash,
		&session.UserType,
		&adminID,
		&linkID,
		&session.ExpiresAt,
		&session.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrSessionNotFound
		}
		return nil, err
	}

	session.AdminID = adminID
	session.LinkID = linkID

	if session.ExpiresAt > 0 && session.ExpiresAt <= time.Now().Unix() {
		return session, ErrSessionExpired
	}

	return session, nil
}

func (d *DB) DeleteSessionByID(id int64) error {
	_, err := d.db.Exec(`DELETE FROM sessions WHERE id = ?`, id)
	return err
}

func (d *DB) CleanupExpiredSessions() error {
	_, err := d.db.Exec(`DELETE FROM sessions WHERE expires_at <= ?`, time.Now().Unix())
	return err
}

func (d *DB) CreateAuthLink(link *AuthLink) (int64, error) {
	res, err := d.db.Exec(
		`INSERT INTO auth_links (token_hash, expires_at, max_uses, use_count, created_at, created_by_admin_id, username) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		link.TokenHash,
		nullableInt64(link.ExpiresAt),
		link.MaxUses,
		link.UseCount,
		link.CreatedAt,
		nullableInt64(link.CreatedBy),
		nullableString(link.Username),
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (d *DB) ConsumeAuthLink(hash string) (*AuthLink, error) {
	tx, err := d.db.Begin()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	row := tx.QueryRow(`SELECT id, token_hash, expires_at, max_uses, use_count, created_at, created_by_admin_id, username FROM auth_links WHERE token_hash = ?`, hash)

	link := &AuthLink{}
	if err = row.Scan(
		&link.ID,
		&link.TokenHash,
		&link.ExpiresAt,
		&link.MaxUses,
		&link.UseCount,
		&link.CreatedAt,
		&link.CreatedBy,
		&link.Username,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrLinkNotFound
		}
		return nil, err
	}

	now := time.Now().Unix()
	if link.ExpiresAt.Valid && link.ExpiresAt.Int64 < now {
		return nil, ErrLinkExpired
	}
	if link.UseCount >= link.MaxUses {
		return nil, ErrLinkDepleted
	}

	_, err = tx.Exec(`UPDATE auth_links SET use_count = use_count + 1 WHERE id = ?`, link.ID)
	if err != nil {
		return nil, err
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	return link, nil
}

func (d *DB) CountAdmins() (int, error) {
	var count int
	err := d.db.QueryRow(`SELECT COUNT(*) FROM admins`).Scan(&count)
	return count, err
}

func (d *DB) GetAuthLinkByID(id int64) (*AuthLink, error) {
	link := &AuthLink{}
	row := d.db.QueryRow(`SELECT id, token_hash, expires_at, max_uses, use_count, created_at, created_by_admin_id, username FROM auth_links WHERE id = ?`, id)
	if err := row.Scan(
		&link.ID,
		&link.TokenHash,
		&link.ExpiresAt,
		&link.MaxUses,
		&link.UseCount,
		&link.CreatedAt,
		&link.CreatedBy,
		&link.Username,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrLinkNotFound
		}
		return nil, err
	}
	return link, nil
}
