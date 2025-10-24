package middleware

import (
	"bytes"
	"embed"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/Simon-Martens/go-send/config"
)

// staticCache holds cached static file data
type staticCache struct {
	mu    sync.RWMutex
	files map[string]*cachedFile
}

type cachedFile struct {
	data    []byte
	modTime time.Time
}

var cache = &staticCache{
	files: make(map[string]*cachedFile),
}

func ServeEmbeddedDistFile(w http.ResponseWriter, r *http.Request, distFS embed.FS) bool {
	path := config.EMBEDDED_DIST_PATH + r.URL.Path

	// Try to get from cache first
	cache.mu.RLock()
	cached, found := cache.files[path]
	cache.mu.RUnlock()

	if found {
		// Set aggressive cache headers for static assets
		setStaticCacheHeaders(w)
		http.ServeContent(w, r, filepath.Base(r.URL.Path), cached.modTime, bytes.NewReader(cached.data))
		return true
	}

	// Not in cache, read from embed.FS
	data, err := distFS.ReadFile(path)
	if err != nil {
		return false
	}

	// Store in cache
	cache.mu.Lock()
	cache.files[path] = &cachedFile{
		data:    data,
		modTime: time.Now(),
	}
	cache.mu.Unlock()

	// Set aggressive cache headers for static assets
	setStaticCacheHeaders(w)
	http.ServeContent(w, r, filepath.Base(r.URL.Path), time.Now(), bytes.NewReader(data))
	return true
}

func setStaticCacheHeaders(w http.ResponseWriter) {
	// Cache static assets for 14 days
	w.Header().Set("Cache-Control", "public, max-age=1209600, immutable")
}

func ServeUserStaticFile(w http.ResponseWriter, r *http.Request, baseDir, subdir string) bool {
	if baseDir == "" || subdir == "" {
		return false
	}

	relativePath := strings.TrimPrefix(r.URL.Path, "/")
	if relativePath == "" {
		return false
	}

	rootDir := filepath.Join(baseDir, subdir)
	fullPath := filepath.Join(rootDir, relativePath)
	if !strings.HasPrefix(fullPath, rootDir+string(os.PathSeparator)) && fullPath != rootDir {
		return false
	}

	// Check cache first
	cacheKey := "user:" + subdir + ":" + relativePath
	cache.mu.RLock()
	cached, found := cache.files[cacheKey]
	cache.mu.RUnlock()

	if found {
		setStaticCacheHeaders(w)
		http.ServeContent(w, r, filepath.Base(r.URL.Path), cached.modTime, bytes.NewReader(cached.data))
		return true
	}

	// Not in cache, read from disk
	info, err := os.Stat(fullPath)
	if err != nil || info.IsDir() {
		return false
	}

	data, err := os.ReadFile(fullPath)
	if err != nil {
		return false
	}

	// Store in cache
	cache.mu.Lock()
	cache.files[cacheKey] = &cachedFile{
		data:    data,
		modTime: info.ModTime(),
	}
	cache.mu.Unlock()

	setStaticCacheHeaders(w)
	http.ServeContent(w, r, filepath.Base(r.URL.Path), info.ModTime(), bytes.NewReader(data))
	return true
}

// PreCacheUserStaticFiles loads all user static files into memory on startup
func PreCacheUserStaticFiles(baseDir string, logger interface {
	Info(msg string, args ...interface{})
},
) {
	if baseDir == "" {
		return
	}

	subdirs := []string{config.USER_DIST_SUBDIR}

	for _, subdir := range subdirs {
		rootDir := filepath.Join(baseDir, subdir)
		if _, err := os.Stat(rootDir); os.IsNotExist(err) {
			continue
		}

		err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
			if err != nil || info.IsDir() {
				return err
			}

			relativePath, err := filepath.Rel(rootDir, path)
			if err != nil {
				return err
			}

			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			cacheKey := "user:" + subdir + ":" + relativePath
			cache.mu.Lock()
			cache.files[cacheKey] = &cachedFile{
				data:    data,
				modTime: info.ModTime(),
			}
			cache.mu.Unlock()

			logger.Info("Pre-cached user static file", "path", relativePath, "subdir", subdir)
			return nil
		})
		if err != nil {
			logger.Info("Failed to pre-cache user static files", "error", err)
		}
	}
}
