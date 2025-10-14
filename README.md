# Go-Send

A lightweight, self-hostable file sharing service with client-side encryption. This is a fork of [timvisee/send](https://gitlab.com/timvisee/send), which itself is a fork of Firefox Send.

**This is the feature-parity branch, that only reimplements the features of the original send. For new features, take a look at the main branch.**

This fork replaces the original Node.js/Express backend with a Go server, switches the frontend build system to ESBuild and cuts almost all of the frontend dependencies, including choo, instead relying on a combination of go templates and browser-native web components. All encryption and decryption still happens in the browser, and no encryption logic on the frontend was changed at all, except for a few conveniance changes.


### Why a reimplementation?

The original `send` has a lot of dependencies (1980 of them!) for a project that doesn't really do all that much. Also, the server still ran Node 16. Needless to say, maintaining and updating this to the newest version of its dependencies is a nearly impossible task; much less for a hobby developer like me, who wants to use this in production. Luckily, the server runtime as well as the ui handling is mostly decoupled from the frontend encryption and decryption logic; it used to be some server SSR and hydration; but the `choo` router that formerly Firefox Send used can be run in the browser alone. Which made the task of implementing a basic go server trivial.


### What is changed?

- ~Express server~: replaced with Go std lib server
- ~Redis~: Replaced with **SQLite** for metadata storage
- ~Firefox Accounts (FxA)~: Authentication removed (did not work in modern FF anyway). Also removed from the frontend entirely.
- ~Webpack~ removed, introduced **ESBuild**. We have a lot of fewer build features now. We build a lot faster now.
- ~Ployfills~: Removed almost all polyfills and support for IE and older Edge browsers. Target browsers are: Chrome 89+, Firefox 102+, Safari 14.1+, Edge 89+, which is a very modern selection, but they will be old pretty fast. CanIUse reports 95.74% user coverage.
- Templates: Moved header and footers to go templates, which may be overwritten by your custom template files.

### What remains to be reimplemented?

As of right now we have full feature parity on the frontend, but the backend is missing these two things:

- **S3 storage**: Local filesystem only as of right now
- Maybe **Sentry**: Better Error tracking than logging would be nice to have

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
