package storage

import (
	"io"
	"os"
	"path/filepath"
)

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
