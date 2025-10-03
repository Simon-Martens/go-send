# Go-Send

A lightweight, self-hostable file sharing service with client-side encryption. This is a fork of [timvisee/send](https://gitlab.com/timvisee/send) with the Node.js backend replaced by a Go implementation.

This fork replaces the original Node.js/Express backend with a Go server, keeping the original frontend completely as it was (nor now). All encryption and decryption still happens in the browser, and no encryption logic on the frontend was changed at all.

### Why reimplement the backend?

The original `send` has a lot of dependencies (1980 of them!) for a project that doesn't really do all that much. Also, the server still runs on Node 16. Needless to say, maintaining and updating this to the newest version of its dependencies is a nearly impossible task; much less for a hobby developer like me, who wants to use this in production. Luckily, the server runtime is mostly decoupled from the frontend; it used to be some server SSR and hydration; but the `choo` router htat formaerly Firefox Send used can be run in a browser alone. Which made the task of implementing a basic go server trivial.


### So what's the plan?

The plan is to ultimate replace client side rounting (choo) with server-side routing, ~replace rimraf & webpack with vite~ (Done!) and use go templates as far as possible. Through the nature of this project, a lot of browser stuff is and will be still needed.


### What is changed?

- **Express server**: replaced with Go
- **Redis**: Replaced with **SQLite** for metadata storage
- ~Firefox Accounts (FxA)~: Authentication removed (did not work in modern FF anyway)
- ~Webpack~ removed, introduced **Vite**. We have a lot of fewer build features now


### What will be Reimplemented?

- **S3 storage**: Local filesystem only as of right now
- Maybe **Sentry**: Better Error tracking than logging would be nice to have


Almost all frontend code is still original Choo-based UI. This will be subject to change since our reimplementation of the backend might help us to implement a handful of new frontend features. Also, I might move header and footers to go templates, which may be overwritten by your custom template files.

The compatibility with `ffsend` is kept as of right now.


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

See all branding options: `config/config.go`


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
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/templates ./templates
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
