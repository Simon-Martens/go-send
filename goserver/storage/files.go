package storage

import (
	"io"
	"os"
	"path/filepath"
)

const uploadsDir = "./uploads"

func init() {
	os.MkdirAll(uploadsDir, 0755)
}

// SaveFile saves uploaded data to disk
func SaveFile(id string, data io.Reader) error {
	filePath := filepath.Join(uploadsDir, id)
	f, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = io.Copy(f, data)
	return err
}

// GetFileSize returns the size of a file
func GetFileSize(id string) (int64, error) {
	filePath := filepath.Join(uploadsDir, id)
	info, err := os.Stat(filePath)
	if err != nil {
		return 0, err
	}
	return info.Size(), nil
}

// OpenFile opens a file for reading
func OpenFile(id string) (*os.File, error) {
	filePath := filepath.Join(uploadsDir, id)
	return os.Open(filePath)
}

// DeleteFile deletes a file from disk
func DeleteFile(id string) error {
	filePath := filepath.Join(uploadsDir, id)
	return os.Remove(filePath)
}

// FileExists checks if a file exists on disk
func FileExists(id string) bool {
	filePath := filepath.Join(uploadsDir, id)
	_, err := os.Stat(filePath)
	return err == nil
}
