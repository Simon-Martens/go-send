# Go-Send

A lightweight, self-hostable file sharing service with client-side encryption and business-ready user management. All encryption and decryption happens in the browser with no secrets stored on the server. It can easily handle a hundred users or more.

Originally a fork of [timvisee/send](https://gitlab.com/timvisee/send), which itself was a fork of Firefox Send.

**This is the main development branch with extended features. For feature parity with the original Firefox Send, see the `firefox-send-parity` branch.**

## Features

### Core Functionality
- **Client-Side Encryption**: All files are encrypted in the browser using Web Crypto API (AES-GCM)
- **Zero-Knowledge Architecture**: Server never has access to decryption keys
- **HMAC Authentication**: Challenge-response authentication with nonce rotation
- **WebSocket Upload**: Efficient streaming uploads with progress tracking
- **SQLite Storage**: Lightweight, embedded database (no Redis required)
- **Automatic Cleanup**: Scheduled deletion of expired files

### User Management
- **Role-Based Access**: Admin and User roles with different permissions
- **Session Management**: Secure, HttpOnly session cookies
- **Password-Based Authentication**: PBKDF2 key derivation with server-side password hashing
- **Public Key Cryptography**: Users can derive public keys from passwords for end-to-end encrypted file sharing
- **Account Management**: Profile editing, session clearing, account deactivation

### Upload Control
- **Upload Guard**: Require authentication for uploads (optional)
- **Guest Upload Tickets**: Generate one-time or limited-use upload links for guests
- **User-Specific Tickets**: Upload links that lock recipients to specific users
- **Recipient-Based Sharing**: Encrypt files for specific users (they can decrypt with their password-derived key)
- **Upload Limits**: Configurable file size, download counts, and expiry times

### File Management
- **Password Protection**: Add password protection to individual files
- **Download Limits**: Automatic deletion after N downloads
- **Expiry Times**: Files auto-delete after specified duration
- **File Metadata**: Track owner, recipients, download counts, creation time
- **Inbox/Outbox**: Users can view files they've sent and received

### Customization
- **Custom Branding**: Configure colors, logos, wordmarks, favicons
- **Custom Templates**: Override Go templates for full UI control
- **Custom Static Files**: Add robots.txt, CSS, images without recompiling
- **Custom Footer**: Add custom text and links to footer
- **Localization**: Support for custom locale selection

### Admin Features
- **User Management**: Create, edit, deactivate users
- **Signup Link Generation**: Create time-limited, usage-limited signup tokens
- **Upload Link Management**: View and manage guest upload tickets
- **Activity Logs**: View file operations and user actions
- **Initial Setup**: Automatic one-time admin token generation on first run

### API Features
- **RESTful API**: JSON-based API for all operations
- **ffsend Compatibility**: Works with the `ffsend` CLI client (when `UPLOAD_GUARD=false`)
- **Public API**: File info, existence checks, metadata retrieval
- **Authenticated API**: User profiles, file lists, admin operations

## What Changed from Original Firefox Send?

- ✅ **Express → Go std lib**: Native Go HTTP server (no Node.js runtime)
- ✅ **Redis → SQLite**: Embedded database, no external dependencies
- ✅ **Webpack → ESBuild**: Build in milliseconds instead of minutes
- ✅ **Removed Firefox Accounts**: Replaced with password-based user system
- ✅ **Removed Polyfills**: Target modern browsers (95%+ coverage)
- ✅ **Added User Management**: Multi-user support with roles
- ✅ **Added Upload Guard**: Protect against anonymous uploads
- ✅ **Added Guest Tickets**: Allow controlled guest access
- ✅ **Added Recipient Encryption**: End-to-end encrypted sharing between users

## Quick Start

### Prerequisites

- **Go 1.24+** (for backend)
- **Node.js 16+** (optional, for rebuilding frontend)

The frontend comes pre-bundled in `views/dist/`.

### Run Server

```bash
go mod tidy
go run .
```

Or use `air` for live-reloading development:

```bash
air
```

Server starts on **http://localhost:8080** by default.

On first run, the server will generate an initial admin token:

```
═══════════════════════════════════════════════════════════════════════
⚠️  NO USERS REGISTERED - INITIAL ADMIN SETUP REQUIRED
═══════════════════════════════════════════════════════════════════════
Create your first administrator account using this one-time link:
http://localhost:8080/auth/claim/abc123xyz...
═══════════════════════════════════════════════════════════════════════
```

Visit the URL to create the first admin account.

### Build Frontend (Optional)

```bash
cd views
npm install
npm run build
```

This creates `views/dist/` with bundled assets.

## Configuration

All configuration is done via **environment variables** with sensible defaults.

### Server Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP server port |
| `BASE_URL` | (empty) | Base URL for download links (e.g., `https://send.example.com`) |
| `DETECT_BASE_URL` | `true` | Auto-detect base URL from request headers |
| `FILE_DIR` | `./data/uploads` | Directory for encrypted file storage |
| `USER_FRONTEND_DIR` | `./userfrontend` | Directory for custom templates and static files |
| `SEND_ENV` | `development` | Environment: `development` or `production` |

### Upload/Download Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_FILE_SIZE` | `2684354560` | Maximum file size in bytes (2.5 GB) |
| `MAX_FILES_PER_ARCHIVE` | `64` | Maximum files per archive upload |
| `MAX_DOWNLOADS` | `1000` | Maximum allowed download limit |
| `MAX_EXPIRE_SECONDS` | `2592000` | Maximum expiry time in seconds (30 days) |
| `DEFAULT_DOWNLOADS` | `5` | Default download limit |
| `DEFAULT_EXPIRE_SECONDS` | `259200` | Default expiry time in seconds (3 days) |
| `DOWNLOAD_COUNTS` | `1,2,3,4,5,10,20,50,100,500,1000` | Download limit options (CSV) |
| `EXPIRE_TIMES_SECONDS` | `900,7200,28800,86400,259200,604800,1209600,2592000` | Expiry time options in seconds (CSV) |

**Note**: CSV values for times in seconds:
- `900` = 15 minutes
- `7200` = 2 hours
- `28800` = 8 hours
- `86400` = 1 day
- `259200` = 3 days
- `604800` = 7 days
- `1209600` = 14 days
- `2592000` = 30 days

### Authentication & Access Control

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_UPLOAD_GUARD` | `true` | Require authentication for uploads |
| `USE_USER_MGMT` | `true` | Enable user management system |
| `USE_ACCESS_LINKS` | `true` | Allow generation of guest upload tickets |

**Note**: Setting `USE_UPLOAD_GUARD=true` automatically enables `USE_USER_MGMT`.

### Branding - Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `UI_COLOR_PRIMARY` | `#0A84FF` | Primary UI color (buttons, links) |
| `UI_COLOR_ACCENT` | `#003EAA` | Accent color (hover effects) |

### Branding - Custom Assets

All asset paths are URLs or paths to image files.

| Variable | Default | Description |
|----------|---------|-------------|
| `UI_CUSTOM_ASSETS_ICON` | (empty) | Main logo icon |
| `UI_CUSTOM_ASSETS_WORDMARK` | (empty) | Text logo / wordmark |
| `UI_CUSTOM_ASSETS_ANDROID_CHROME_192PX` | (empty) | Android Chrome icon 192x192 |
| `UI_CUSTOM_ASSETS_ANDROID_CHROME_512PX` | (empty) | Android Chrome icon 512x512 |
| `UI_CUSTOM_ASSETS_APPLE_TOUCH_ICON` | (empty) | Apple touch icon |
| `UI_CUSTOM_ASSETS_FAVICON_16PX` | (empty) | Favicon 16x16 |
| `UI_CUSTOM_ASSETS_FAVICON_32PX` | (empty) | Favicon 32x32 |
| `UI_CUSTOM_ASSETS_SAFARI_PINNED_TAB` | (empty) | Safari pinned tab icon |
| `UI_CUSTOM_ASSETS_FACEBOOK` | (empty) | Facebook Open Graph image |
| `UI_CUSTOM_ASSETS_TWITTER` | (empty) | Twitter Card image |

### Footer Customization

| Variable | Default | Description |
|----------|---------|-------------|
| `CUSTOM_FOOTER_TEXT` | (empty) | Custom footer text |
| `CUSTOM_FOOTER_URL` | (empty) | Custom footer link URL |
| `SEND_FOOTER_DMCA_URL` | (empty) | DMCA/Legal link URL |
| `FOOTER_SOURCE_URL` | `https://github.com/Simon-Martens/go-send` | Source code link URL |

### Localization

| Variable | Default | Description |
|----------|---------|-------------|
| `CUSTOM_LOCALE` | (empty) | Force specific locale (e.g., `en`, `de`, `fr`) |

## Custom Frontend Assets & Templates

### Directory Structure

```
userfrontend/
├── dist/              # Override bundled frontend assets
│   ├── main.js       # Replace main JavaScript bundle
│   ├── main.css      # Replace main CSS bundle
│   └── ...           # Any other dist files
├── public/            # Additional static files served from root
│   ├── robots.txt
│   ├── custom.css
│   └── ...
└── templates/         # Override Go templates
    ├── index.gohtml
    ├── 403.gohtml
    └── ...
```

### How It Works

1. **Override Embedded Assets**: Files in `userfrontend/dist/` replace matching files from the embedded `views/dist/`
2. **Add Static Files**: Files in `userfrontend/public/` are served from the root path `/`
3. **Custom Templates**: Files in `userfrontend/templates/` override embedded templates from `views/templates/`

### Template Requirements

When creating custom templates, you **must** include:

```html
{{ template "_appheader" . }}  <!-- App header, fonts, CSS -->
{{ template "_app" . }}         <!-- Main application -->
```

See `views/templates/` for examples. Template data is defined in `handlers/templatedata.go`.

### Example: Custom Styling

```bash
mkdir -p userfrontend/public
echo "body { background: #1a1a1a; }" > userfrontend/public/custom.css
```

Reference in your custom `userfrontend/templates/index.gohtml`:

```html
<link rel="stylesheet" href="/custom.css">
```

## API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/config` | GET | Get server configuration (limits, options) |
| `/api/exists/:id` | GET | Check if file exists |
| `/api/info/:id` | GET | Get file info (size, downloads remaining) |

### File Operations

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/ws` | WebSocket | Optional* | Upload file via WebSocket |
| `/api/metadata/:id` | GET | HMAC | Get encrypted file metadata |
| `/api/download/:id` | GET | HMAC | Download encrypted file |
| `/api/delete/:id` | POST | Owner Token | Delete file |
| `/api/password/:id` | POST | Owner Token | Set password protection |

*Requires authentication if `USE_UPLOAD_GUARD=true`

### User Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users` | GET | User/Guest | List users (for recipient selection) |
| `/api/users/:id` | GET | User/Guest | Get user details |
| `/api/me/profile` | GET/PUT | User | Get/update user profile |
| `/api/me/files` | GET | User | Get user's files (inbox/outbox) |
| `/api/me/clear-sessions` | POST | User | Clear all other sessions |
| `/api/me/deactivate` | POST | User | Deactivate account |
| `/api/passwordreset` | POST | User | Request password reset |
| `/api/logs` | GET | User | View activity logs |

### Upload Links (User)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/upload-links` | GET/POST | User | List/create upload tickets |
| `/api/upload-links/:id` | GET/PUT/DELETE | User | Manage upload ticket |

### Admin Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/admin/users` | GET/POST | Admin | List/create users |
| `/api/admin/users/:id` | GET/PUT/DELETE | Admin | Manage user |
| `/api/admin/signup-links` | GET/POST | Admin | List/create signup tokens |

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/challenge` | POST | Get login challenge (nonce) |
| `/auth/login` | POST | Submit login response |
| `/auth/claim/:token` | GET | Claim signup/upload token |
| `/logout` | POST | Log out current session |
| `/register/admin/:token` | GET/POST | Register admin account |
| `/register/user/:token` | GET/POST | Register user account |

### HTML Pages

| Endpoint | Description |
|----------|-------------|
| `/` | Upload page |
| `/download/:id` | Download page |
| `/settings` | User settings page |
| `/help` | Help page |
| `/error` | Error page |

## Deployment

### Docker (Recommended)

**Dockerfile:**

```dockerfile
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o send-server .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/send-server .
COPY --from=builder /app/views ./views

# Create data directory for SQLite and uploads
RUN mkdir -p /root/data/uploads

EXPOSE 8080

CMD ["./send-server"]
```

**Build and run:**

```bash
docker build -t go-send .
docker run -d \
  -p 8080:8080 \
  -v $(pwd)/data:/root/data \
  -e BASE_URL=https://send.example.com \
  -e USE_UPLOAD_GUARD=true \
  go-send
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name send.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Increase timeouts for large file uploads
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }
}
```

### Systemd Service

**`/etc/systemd/system/go-send.service`:**

```ini
[Unit]
Description=Go-Send File Sharing Service
After=network.target

[Service]
Type=simple
User=send
WorkingDirectory=/opt/go-send
ExecStart=/opt/go-send/send-server
Restart=on-failure
RestartSec=5s

# Environment variables
Environment="PORT=8080"
Environment="BASE_URL=https://send.example.com"
Environment="USE_UPLOAD_GUARD=true"
Environment="FILE_DIR=/var/lib/go-send/uploads"

[Install]
WantedBy=multi-user.target
```

**Enable and start:**

```bash
sudo systemctl enable go-send
sudo systemctl start go-send
```

## Security

### Threat Model

**Server Compromise**
- Files are stored encrypted with keys never sent to the server
- Download URLs contain the decryption key in the fragment (never sent to server)
- HMAC authentication prevents unauthorized downloads even with database access

**Network Interception**
- Files are client-side encrypted before upload
- **Always use TLS/HTTPS** in production via reverse proxy
- HSTS headers enforced in production mode

**Client-Side Attacks**
- XSS protection via Content Security Policy (CSP)
- HttpOnly session cookies prevent JavaScript access
- CSRF protection on state-changing operations
- Subresource Integrity (SRI) for external resources

### Authentication Flow

1. Client derives auth key from file secret using HKDF-SHA256
2. Server generates random nonce (16 bytes)
3. Client computes HMAC-SHA256 of nonce with auth key
4. Client sends signature in `Authorization: send-v1 <signature>` header
5. Server verifies HMAC signature
6. Server rotates nonce on each successful request (prevents replay attacks)

### Encryption Details

- **File Encryption**: AES-GCM with 256-bit keys
- **Key Derivation**: HKDF-SHA256 from random secret
- **Recipient Encryption**: ECDH (X25519) + AES-GCM
- **Password Hashing**: Argon2id (server-side)
- **Password Key Derivation**: PBKDF2-SHA256 (client-side)

## Development

### Project Structure

```
.
├── main.go                  # Entry point
├── config/                  # Configuration management
├── server/                  # HTTP server and routing
├── handlers/                # HTTP request handlers
├── middleware/              # HTTP middleware
├── storage/                 # Database operations
├── auth/                    # HMAC authentication
├── core/                    # Core application logic
├── migrations/              # Database migrations
├── views/                   # Frontend (embedded)
│   ├── src/                # Frontend source code
│   ├── dist/               # Built frontend (embedded)
│   └── templates/          # Go templates
└── userfrontend/            # User overrides (gitignored)
```

### Running Tests

```bash
go test ./...
```

### Database Migrations

Migrations are automatically run on startup. See `migrations/` directory.

### Live Reload Development

Use [air](https://github.com/cosmtrek/air):

```bash
go install github.com/cosmtrek/air@latest
air
```

## License

- **Backend** (`*.go`): [GNU General Public License v3.0](LICENSE.backend)
- **Frontend** (`views/`): [Mozilla Public License Version 2.0](LICENSE)

Original project by Mozilla, forked by timvisee.

## Acknowledgments

- **Mozilla**: Original Firefox Send project
- **timvisee**: Community fork maintainer
- **Contributors**: All community contributors to Send and go-send

## Support

- **Issues**: [GitHub Issues](https://github.com/Simon-Martens/go-send/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Simon-Martens/go-send/discussions)
- **Documentation**: See `CLAUDE.md` for developer context

## Compatibility

- **Browsers**: Chrome 89+, Firefox 102+, Safari 14.1+, Edge 89+ (95%+ user coverage)
- **CLI**: Compatible with `ffsend` when `USE_UPLOAD_GUARD=false`
- **API**: RESTful JSON API with HMAC authentication
