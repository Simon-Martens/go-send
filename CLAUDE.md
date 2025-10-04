# Claude Code Context: go-send

## Project Overview

**go-send** is a lightweight, self-hostable file sharing service with client-side encryption. This is a Go reimplementation of the backend for [timvisee/send](https://gitlab.com/timvisee/send), which was originally Firefox Send by Mozilla.

### Key Goals
- Replace the Node.js/Express backend (1980+ dependencies) with a minimal Go server
- Replace Redis with SQLite for metadata storage
- Keep the original frontend (Choo framework) temporarily, with plans to modernize
- Maintain compatibility with the `ffsend` CLI client
- Ensure all encryption/decryption happens client-side using Web Crypto API

### Security Model
- **Files stored encrypted**: Server cannot decrypt files; encryption keys stay in the browser
- **HMAC-based authentication**: Clients derive auth keys from secrets using HKDF, sign nonces with HMAC-SHA256
- **No user accounts**: Files are identified by random IDs with owner tokens for management

### Customization (Templates & Static Files)

You can override templates and add custom static files without recompiling the server:

**Directory Structure:**
```
userfrontend/
├── dist/              # Drop-in replacements for bundled frontend assets
├── templates/
│   └── index.html     # Override main template
└── public/
    ├── custom.css     # Add custom CSS
    ├── logo.png       # Add custom images
    └── ...            # Any static files
```

**How it works:**
- **Templates**: Place `.html` files in `userfrontend/templates/` to override embedded templates
  - Must include at least `index.html` to be used
  - Supports multiple template fragments for future use
  - Falls back to embedded templates if not found

- **Bundled Assets**: Drop files in `userfrontend/dist/` to replace items from the embedded `frontend/dist/`
  - Ideal for swapping `app.js`, `app.css`, icons, or other build outputs
  - Missing files automatically fall back to the embedded bundle

- **Static Files**: Place files in `userfrontend/public/` to serve at base URL `/`
  - Perfect for additional assets like `robots.txt`, images, or extra CSS
  - Served after `dist/`, so naming collisions prefer the `dist/` copy

**Example:**
```bash
# Create custom frontend directories
mkdir -p userfrontend/dist userfrontend/templates userfrontend/public

# Copy embedded template to customize
cp frontend/templates/index.html userfrontend/templates/

# Add custom CSS
echo "body { background: red; }" > userfrontend/public/custom.css

# Reference in your custom template
# <link rel="stylesheet" href="/custom.css">

# Start server (automatically loads from userfrontend/)
./send-server
```

Configure location with `USER_FRONTEND_DIR` environment variable.

## Project Structure

```
/
├── main.go                 # Entry point, HTTP server setup, routing
├── go.mod/go.sum          # Go dependencies
├── send.db                # SQLite database (runtime, gitignored)
├── auth/                  # HMAC authentication logic
│   └── hmac.go           # Nonce generation, signature verification
├── config/                # Configuration management
│   └── config.go         # Environment variable parsing, defaults
├── handlers/              # HTTP request handlers
│   ├── upload.go         # WebSocket upload endpoint
│   ├── download.go       # File download endpoint
│   ├── metadata.go       # Metadata retrieval (requires auth)
│   ├── pages.go          # HTML page rendering
│   ├── config.go         # Server config endpoint
│   └── ...               # Delete, password, exists, info handlers
├── middleware/            # HTTP middleware
│   ├── security.go       # Security headers (HSTS, X-Frame-Options, etc.)
│   ├── ratelimit.go      # Token bucket rate limiting
│   ├── concurrency.go    # Concurrent upload limiting
│   └── context.go        # Request context helpers
├── storage/               # Data persistence
│   ├── db.go             # SQLite operations (CRUD for file metadata)
│   └── files.go          # Filesystem operations (save/delete encrypted files)
├── templates/             # HTML templates
│   └── index.html        # Base template with manifest injection
├── frontend/              # Original Choo-based frontend
│   ├── app/              # JavaScript application code
│   ├── dist/             # Built assets (embedded in Go binary)
│   ├── webpack.config.js # Build configuration
│   └── package.json      # Node dependencies
├── locale/                # Localization support
└── uploads/               # Encrypted file storage (runtime, gitignored)
```

## Key Files and Concepts

### main.go:210
- Embeds `templates/` and `frontend/dist/` into the Go binary using `//go:embed`
- Initializes SQLite database on startup
- Sets up periodic cleanup of expired files (hourly)
- Configures middleware stack: security headers, CSP, rate limiting, request body limits
- Routes API endpoints and serves static assets
- HTTP server with generous timeouts (10 min read/write for large file transfers)

### storage/db.go:195
- **FileMetadata schema**: ID, OwnerToken, encrypted Metadata blob, AuthKey, Nonce, download limits/counts, timestamps
- **CleanupExpired**: Deletes both database records and files on disk for expired uploads
- **Nonce rotation**: Updates nonce on each authenticated request to prevent replay attacks

### handlers/upload.go
- WebSocket-based upload for streaming large files
- Validates file size against `MAX_FILE_SIZE` config
- Generates random file ID and owner token
- Stores encrypted file chunks to disk via `storage.SaveFile`
- Returns `{url, id, ownerToken}` to client

### handlers/download.go & metadata.go
- Both require HMAC authentication derived from the file's secret
- `metadata.go`: Returns encrypted metadata blob to browser for decryption
- `download.go`: Streams encrypted file, increments download count, auto-deletes if limit reached

### config/config.go:153
- All configuration via environment variables with sensible defaults
- Supports branding (colors, custom CSS, logos), limits, footer customization
- Use `getEnv`, `getEnvInt`, `getEnvBool`, `getEnvIntArray` helpers for parsing

### auth/hmac.go
- Implements challenge-response authentication:
  1. Server generates random nonce
  2. Client signs nonce with HKDF-derived auth key using HMAC-SHA256
  3. Server verifies signature
  4. Nonce rotated after successful auth to prevent replays

## Development Workflow

### Running Locally
```bash
# Start development server (assumes frontend/dist/ exists)
go run .

# Or with environment overrides
PORT=3000 MAX_FILE_SIZE=5368709120 go run .
```

### Building Frontend
```bash
cd frontend
npm install
npm run build  # Outputs to frontend/dist/
```

### Common Tasks

**Add a new API endpoint:**
1. Create handler function in `handlers/` (e.g., `NewMyHandler(db *storage.DB) func(w, r)`)
2. Register route in `main.go` (e.g., `mux.HandleFunc("/api/my-endpoint", handlers.NewMyHandler(db))`)
3. Add authentication if needed (see `metadata.go` for HMAC auth pattern)

**Add a new config option:**
1. Add field to `Config` struct in `config/config.go`
2. Load from environment in `Load()` function
3. Pass to handlers via constructor or embed in request context
4. Update README.md configuration table

**Add middleware:**
1. Create in `middleware/` following pattern: `func MyMiddleware(...) func(http.Handler) http.Handler`
2. Apply in `main.go` by wrapping `handler` (order matters!)

**Database schema changes:**
1. Modify schema in `storage/NewDB()` (use `IF NOT EXISTS` for idempotency)
2. Update `FileMetadata` struct if needed
3. Adjust CRUD functions in `storage/db.go`
4. No migration system yet - consider manual migrations for production

## Code Conventions

- **Error handling**: Return errors to caller; log at top-level handlers
- **HTTP status codes**: Use semantic codes (400 for client errors, 500 for server errors)
- **Base64 encoding**: Use base64url without padding (compatible with browser `btoa`/`atob`)
- **Timeouts**: Be generous (10 min) for upload/download operations
- **Security**: Always set `Content-Security-Policy`, validate input sizes, use HTTPS in production

## Frontend Integration

- **Choo framework**: Client-side routing via `frontend/app/routes.js`
- **Webpack bundling**: Generates `manifest.json` for cache-busted filenames
- **Template injection**: `templates/index.html` uses Go templates to inject `{{.ManifestJS}}`, `{{.ManifestCSS}}`, config
- **API contract**: Frontend expects specific JSON shapes (see `handlers/` for response structures)
- **WebSocket upload**: Frontend uses `api.js` to chunk files and stream via WebSocket
- **Client-side crypto**: All encryption uses Web Crypto API (AES-GCM for files, HKDF for key derivation)

## Future Plans

- Replace Choo with server-side routing (Go templates)
- Replace Webpack with Vite
- Possibly re-add S3/GCS storage backend
- Improve frontend (modern framework, better UX)

## Dependencies

### Go (minimal)
- `github.com/mattn/go-sqlite3` - SQLite driver
- `golang.org/x/time/rate` - Rate limiting (token bucket)
- `github.com/gorilla/websocket` - WebSocket support (if used for uploads)

### Frontend (legacy, to be replaced)
- Node.js 16+ (for building)
- Choo framework, Webpack, many transitive dependencies

## Testing & Deployment

- **Docker**: See `README.md` for Dockerfile example (multi-stage build)
- **Health checks**: `/__heartbeat__` (checks DB), `/__lbheartbeat__` (always OK)
- **Compatibility**: Should work with `ffsend` CLI client out of the box

## Tips for Claude Code

- When adding features, check if the frontend needs changes (usually in `frontend/app/`)
- Most backend work involves handlers and middleware - database schema is simple and stable
- Config is extensive; check `config.go` before adding new env vars
- Security is critical: never store decryption keys, always validate HMAC, be paranoid about CSP
- The cleanup goroutine in `main.go` runs hourly; consider it when adding time-based features
