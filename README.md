# Send - Go Backend

A lightweight, self-hostable file sharing service with client-side encryption. This is a fork of [timvisee/send](https://gitlab.com/timvisee/send) with the Node.js backend replaced by a Go implementation.

## What Changed

This fork replaces the original Node.js/Express backend with a standalone Go server while keeping the original frontend completely intact. All encryption and decryption still happens in the browser using the Web Crypto API.

### Why Go?

- **Simpler deployment**: Single binary, no Node.js runtime required
- **Reduced dependencies**: No Redis, no external storage backends (S3/GCS)
- **Lower resource usage**: More efficient memory and CPU utilization
- **Easier maintenance**: Smaller codebase, fewer moving parts

### What Was Removed

- **Node.js server**: Replaced with Go (`goserver/`)
- **Redis**: Replaced with SQLite for metadata storage
- **S3/GCS storage**: Uses local filesystem only
- **Firefox Accounts (FxA)**: Authentication removed (was optional)
- **Sentry**: Error tracking removed (was optional)

### What Was Kept

- **Frontend**: 100% original Choo-based UI
- **Client-side encryption**: All crypto happens in browser
- **File sharing**: Upload, download, password protection
- **Compatible with ffsend**: CLI tool still works
- **Branding**: Mozilla branding already removed in timvisee's fork

## Architecture

```
┌─────────────────────────────────────────┐
│           Browser (Client)              │
│  ┌─────────────────────────────────┐   │
│  │  Choo Framework (UI)            │   │
│  │  WebCrypto API (Encryption)     │   │
│  │  - HKDF key derivation          │   │
│  │  - AES-GCM encryption           │   │
│  │  - HMAC authentication          │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ HTTPS/WebSocket
               │
┌──────────────▼──────────────────────────┐
│         Go Server (Backend)             │
│  ┌─────────────────────────────────┐   │
│  │  HTTP/WebSocket Handler         │   │
│  │  - Serves static assets         │   │
│  │  - Handles file upload/download │   │
│  │  - HMAC verification            │   │
│  │  - No access to encryption keys │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────┐  ┌────────────────┐   │
│  │   SQLite    │  │  Local FS      │   │
│  │  (metadata) │  │  (files)       │   │
│  └─────────────┘  └────────────────┘   │
└─────────────────────────────────────────┘
```

### How It Works

1. **Upload**: Client encrypts file in browser, sends encrypted blob via WebSocket to Go server
2. **Storage**: Go server stores encrypted file on local filesystem, metadata in SQLite
3. **Download**: Client requests file by ID, Go server verifies HMAC auth, streams encrypted file
4. **Decryption**: Client decrypts file in browser using secret key from URL fragment

**Security**: The secret key never leaves the browser and never touches the server. The server only stores encrypted blobs.

## Project Structure

```
send/
├── goserver/              # Go backend (NEW)
│   ├── main.go            # Server entry point
│   ├── config/            # Environment configuration
│   ├── handlers/          # HTTP/WebSocket handlers
│   │   ├── pages.go       # HTML rendering
│   │   ├── upload.go      # WebSocket upload
│   │   ├── download.go    # File download
│   │   ├── metadata.go    # File metadata API
│   │   └── config.go      # Config endpoint
│   ├── storage/           # Data layer
│   │   ├── db.go          # SQLite operations
│   │   └── files.go       # Filesystem operations
│   ├── auth/              # Authentication
│   │   └── hmac.go        # HMAC verification
│   └── templates/         # HTML templates
│       └── index.html     # Main page template
│
├── app/                   # Frontend (UNCHANGED)
│   ├── main.js            # Choo app entry point
│   ├── ui/                # UI components
│   ├── fileReceiver.js    # Download handling
│   ├── fileSender.js      # Upload handling
│   ├── keychain.js        # Crypto operations
│   └── api.js             # Backend API calls
│
├── dist/                  # Built frontend assets
│   ├── app.js             # Bundled JavaScript
│   ├── app.css            # Bundled CSS
│   └── manifest.json      # Asset manifest
│
├── assets/                # Static assets
├── public/                # Public files
└── build/                 # Build scripts
```

## Quick Start

### Prerequisites

- **Go 1.21+** (for backend)
- **Node.js 16+** (for frontend build only)
- **npm** (for frontend build only)

### Build Frontend

```bash
npm install
npm run build
```

This creates `dist/` with bundled assets.

### Copy Assets to Go Server

```bash
cp -r dist goserver/
```

### Run Go Server

```bash
cd goserver
go mod tidy
go run .
```

Server starts on http://localhost:8080

## Configuration

The Go server is configured via environment variables. All settings are optional with sensible defaults.

### Server Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Port to listen on |
| `BASE_URL` | (auto) | Base URL for download links (e.g., `https://send.example.com`) |
| `DETECT_BASE_URL` | `false` | Auto-detect base URL from request headers |
| `FILE_DIR` | `./uploads` | Directory for file storage |

### Upload/Download Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_FILE_SIZE` | `2684354560` | Maximum file size in bytes (2.5 GB) |
| `MAX_DOWNLOADS` | `100` | Maximum number of downloads per file |
| `MAX_EXPIRE_SECONDS` | `604800` | Maximum expiry time in seconds (7 days) |
| `MAX_FILES_PER_ARCHIVE` | `64` | Maximum files in an archive |
| `DOWNLOAD_COUNTS` | `1,2,3,4,5,20,50,100` | Download limit options (CSV) |
| `EXPIRE_TIMES_SECONDS` | `300,3600,86400,604800` | Expiry time options (CSV) |
| `DEFAULT_DOWNLOADS` | `1` | Default download limit |
| `DEFAULT_EXPIRE_SECONDS` | `86400` | Default expiry time (1 day) |

### Branding

| Variable | Default | Description |
|----------|---------|-------------|
| `UI_COLOR_PRIMARY` | `#0A84FF` | Primary UI color |
| `UI_COLOR_ACCENT` | `#003EAA` | Accent color (hover effects) |
| `UI_CUSTOM_CSS` | (empty) | URL to custom CSS file |
| `UI_CUSTOM_ASSETS_ICON` | (empty) | Custom logo icon |
| `UI_CUSTOM_ASSETS_WORDMARK` | (empty) | Custom wordmark/text logo |
| `CUSTOM_FOOTER_TEXT` | (empty) | Custom footer text |
| `CUSTOM_FOOTER_URL` | (empty) | Custom footer link URL |

See all branding options: `goserver/config/config.go`

### Example: Custom Configuration

```bash
export MAX_FILE_SIZE=5000000000          # 5 GB limit
export MAX_EXPIRE_SECONDS=2592000        # 30 days max
export UI_COLOR_PRIMARY=#FF6B35          # Orange theme
export BASE_URL=https://send.example.com
export PORT=3000

cd goserver && go run .
```

## Development

### Frontend Development

The frontend is built with:
- **Choo**: Lightweight framework
- **Webpack**: Module bundler
- **PostCSS**: CSS processing

To develop the frontend:

```bash
npm install
npm start  # Starts webpack dev server + Node.js proxy (for testing)
```

Or build for production:

```bash
npm run build
cp -r dist goserver/
```

### Backend Development

The Go server uses:
- **SQLite**: Metadata database (via mattn/go-sqlite3)
- **Gorilla WebSocket**: WebSocket support
- **Standard library**: HTTP server, routing

To develop the backend:

```bash
cd goserver
go run .  # Auto-recompiles on changes
```

### Database Schema

SQLite database: `goserver/send.db`

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,           -- 16-char hex ID
  owner_token TEXT NOT NULL,     -- Owner deletion token
  metadata TEXT NOT NULL,        -- Encrypted metadata (base64)
  auth_key TEXT NOT NULL,        -- HMAC auth key (base64)
  nonce TEXT NOT NULL,           -- Current nonce for auth
  dl_limit INTEGER NOT NULL,     -- Download limit
  dl_count INTEGER DEFAULT 0,    -- Current download count
  password INTEGER DEFAULT 0,    -- Has password (0/1)
  created_at INTEGER NOT NULL,   -- Unix timestamp
  expires_at INTEGER NOT NULL    -- Unix timestamp
);
```

## API Endpoints

### Upload
- `POST /api/ws` - WebSocket upload
  - Sends encrypted file chunks
  - Returns `{url, id, ownerToken}`

### Download
- `GET /download/:id` - Download page (HTML)
- `GET /api/metadata/:id` - Get file metadata (requires HMAC auth)
- `GET /api/download/:id` - Download file (requires HMAC auth)

### Management
- `POST /api/delete/:id` - Delete file (requires owner token)
- `POST /api/password/:id` - Set password (requires owner token)
- `GET /api/exists/:id` - Check if file exists
- `GET /api/info/:id` - Get file info (size, downloads)

### Config
- `GET /config` - Get server configuration (limits, options)

## Deployment

### Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY goserver/ .
RUN go mod download
RUN go build -o send-server .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/send-server .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/templates ./templates
EXPOSE 8080
CMD ["./send-server"]
```

Build and run:

```bash
docker build -t send-go .
docker run -p 8080:8080 -v $(pwd)/data:/root/uploads send-go
```

### Systemd Service

Create `/etc/systemd/system/send.service`:

```ini
[Unit]
Description=Send File Sharing Service
After=network.target

[Service]
Type=simple
User=send
WorkingDirectory=/opt/send
ExecStart=/opt/send/send-server
Restart=on-failure
Environment="PORT=8080"
Environment="BASE_URL=https://send.example.com"
Environment="MAX_FILE_SIZE=5000000000"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable send
sudo systemctl start send
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name send.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    client_max_body_size 5G;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Clients

- **Web**: Built-in web interface
- **CLI**: [ffsend](https://github.com/timvisee/ffsend) - Compatible with this server
- **Android/iOS**: Original apps in `android/` and `ios/` directories (native apps, not web wrappers)

## Security

### Threat Model

- **Server compromise**: Files remain encrypted, keys never touch server
- **Network interception**: Use HTTPS/TLS (files are already encrypted)
- **Client-side attacks**: Out of scope (XSS, malicious JS)

### Authentication Flow

1. Client derives auth key from secret using HKDF
2. Server generates random nonce
3. Client signs nonce with auth key (HMAC-SHA256)
4. Server verifies signature
5. Server rotates nonce on each request

All authentication uses base64url encoding without padding.

## Migration from Node.js Version

If you're running the original Node.js version:

1. **Export data**: Files and metadata are not compatible
2. **Inform users**: All existing links will break
3. **Deploy Go version**: Fresh start with new database
4. **Update DNS**: Point to new server

There is no automated migration path. This is a clean rewrite.

## Contributing

Contributions welcome! Areas of interest:

- [ ] Automated tests
- [ ] Prometheus metrics
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] Cleanup of expired files
- [ ] Docker Compose setup

## License

[Mozilla Public License Version 2.0](LICENSE)

Original project by Mozilla, forked by timvisee, Go backend by contributors.

## Acknowledgments

- **Mozilla**: Original Firefox Send project
- **timvisee**: Community fork maintainer
- **Choo framework**: Frontend framework
- **ffsend**: CLI client compatibility

---

**Original docs**: [docs/](docs/) (Note: Most docs refer to Node.js version)

**Questions?**: Check [docs/faq.md](docs/faq.md) for general Send questions
