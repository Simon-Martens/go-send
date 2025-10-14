# Go-Send

A lightweight, self-hostable file sharing service with client-side encryption, with the capacity to use this as a file sending/recieving solution in an organization. All decryption and encryption happens in the browser with no secrets stored on the server. A user management feature allows guarding against unauthorized uploads; users can derive public key from their password, allowing guests to encrypt files specifically for them.

Originally a fork of [timvisee/send](https://gitlab.com/timvisee/send), which itself was a fork of Firefox Send.

**This is the main development branch, that adds a bunch of functionality around the original send. For feature parity with the original, look at the firefox-send-parity branch.**


### What is changed from the original?

- ~Express server~: replaced with Go std lib server
- ~Redis~: Replaced with **SQLite** for metadata storage
- ~Firefox Accounts (FxA)~: Authentication removed (did not work in modern FF anyway). Also removed from the frontend entirely.
- ~Webpack~ removed, introduced **ESBuild**. We build in mere milliseconds now.
- ~Ployfills~: Removed almost all polyfills and support for IE and older Edge browsers. Target browsers are: Chrome 89+, Firefox 102+, Safari 14.1+, Edge 89+, which is a very modern selection, but they will be old pretty fast. CanIUse reports 95.74% user coverage.
- Templates: Moved header and footers to go templates, which may be overwritten by your custom template files.
- Upload guard. Added a login to guard the upload page, if `UPLOAD_GUARD` is set to true. The default user/pw is admin/admin. No admin registration and deltion yet.
- Generate Upload links: Admins can generate upload links that allow guests to upload files, when `ALLOW_ACCESS_LINKS` is set.

The compatibility with `ffsend` is kept as of right now, as long as the `UPLOAD_GUARD` is set to false.


## Quick Start

### Prerequisites

- **Go 1.24+** (for backend)

The frontend come pre-bundled in dist/, but in case you want to build it yourself, you need to have Node.js 16+ installed.

### Build Frontend (Optional -> an up-to-date pre-build package is included)

```bash
cd frontend
npm install
npm run build
```

This creates `dist/` with bundled assets.


### Run Go Server

```bash
go mod tidy
go run .
```

Or use `air` to run the server in a live-reloading environment.

Server starts on http://localhost:8080, if not otherwise configured.


## Configuration

The Go server is configured via environment variables. All settings are optional with sensible defaults.

### Server Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Port to listen on |
| `BASE_URL` | (auto) | Base URL for download links (e.g., `https://send.example.com`) |
| `DETECT_BASE_URL` | `false` | Auto-detect base URL from request headers |
| `FILE_DIR` | `./uploads` | Directory for file storage |
| `USER_FRONTEND_DIR` | `./userfrontend` | Directory for custom templates and static files |

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
| `UI_CUSTOM_ASSETS_ICON` | (empty) | Custom logo icon |
| `UI_CUSTOM_ASSETS_WORDMARK` | (empty) | Custom wordmark/text logo |
| `CUSTOM_FOOTER_TEXT` | (empty) | Custom footer text |
| `CUSTOM_FOOTER_URL` | (empty) | Custom footer link URL |

See all branding options: `config/config.go`

### Upload Guard

| Variable | Default | Description |
|----------|---------|-------------|
| `UPLOAD_GUARD` | `true` | Enable upload guard |
| `ALLOW_ACCESS_LINKS` | `admin` | Enable guest upload links generation |


## Custom Frontend Assets & Templates

Static assets embedded from `frontend/dist/` are always served. To customize or override them without rebuilding the binary, create a matching structure under `userfrontend/dist/`. Files placed there take precedence over the embedded versions, while any missing files continue to fall back to the embedded bundle.

Additional standalone assets (for example `robots.txt` or custom CSS) can be placed in `userfrontend/public/` and are served from the root path as-is.

Set `USER_FRONTEND_DIR` to point to a different overrides directory if needed.

There's also a `userfrontend/templates/` directory, which is used to override the default templates. Look into `frontend/templates/` to see what can be overwitten. No matter what you do, include the `{{ template "_appheader" . }}` and `{{ template "_app" . }}` in you own template files to embed the apps header scripts, fonts and css and the app itself. Take a look at `handlers/templatedata.go`, there's quite some data passed to the templates you can use.


## API Endpoints implemented

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
COPY . .
RUN go mod download
RUN go build -o send-server .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/send-server .
COPY --from=builder /app/frontend ./frontend
EXPOSE 8080
CMD ["./send-server"]
```

Build and run:

```bash
docker build -t send-go .
docker run -p 8080:8080 -v $(pwd)/data:/root/uploads send-go
```


## Security

### Threat Model

**Server compromise**

Files are stored encrypted, the required links for decryption are generated and stored browser-side.


**Network interception**

Files are client-side encrypted and decrypted, please use TLS behind a reverse proxy.


**Client-side attacks**

Partly out of scope, partly this probably most needs an audit, since we have 3 moderate and 7 low vulnerablities still reported by `npm`


### Authentication Flow

1. Client derives auth key from secret using HKDF
2. Server generates random nonce
3. Client signs nonce with auth key (HMAC-SHA256)
4. Server verifies signature
5. Server rotates nonce on each request


## License

All code under frontend/ is licensed under the [Mozilla Public License Version 2.0](LICENSE), while the backend is licensed under the [GNU General Public License v3.0](LICENSE.backend).

Original project by Mozilla, forked by timvisee.


## Acknowledgments

- **Mozilla**: Original Firefox Send project
- **timvisee**: Community fork maintainer
- **Choo framework**: Frontend framework
- **ffsend**: CLI client compatibility
