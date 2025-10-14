# Claude Code Context: go-send Frontend (views/)

## Project Overview

This directory contains the **new frontend** for go-send, a self-hostable file sharing service with client-side encryption. This is a complete rewrite of the legacy Choo-based frontend (`../frontend_deprecated/`) using modern, minimal technologies.

### Core Philosophy

- **No framework overhead** - Use native Web APIs and browser capabilities
- **Simple build process** - ESBuild only, no complex tooling
- **Server-side structure** - Go templates provide HTML structure, JavaScript adds interactivity
- **Client-side security** - All encryption happens in the browser; server never sees keys

### Technology Stack

- **Build**: ESBuild (bundling + minification)
- **Styling**: Tailwind CSS 4.x via PostCSS
- **Templates**: Go HTML templates (`.gohtml`)
- **JavaScript**: ES Modules (`.mjs`)
- **No framework**: Vanilla JavaScript with Web Components (in progress)

---

## Project Structure

```
views/
├── src/                    # JavaScript source files (ES Modules)
│   ├── main.mjs           # Entry point - app initialization
│   ├── styles.css         # Tailwind CSS entry point
│   │
│   ├── api.mjs            # HTTP/WebSocket API client
│   ├── ece.mjs            # Encrypted Content-Encoding (RFC 8188)
│   ├── keychain.mjs       # HKDF key derivation, auth keys
│   ├── fileSender.mjs     # Upload orchestration + encryption
│   ├── fileReceiver.mjs   # Download orchestration + decryption
│   │
│   ├── archive.mjs        # Archive/ZIP handling
│   ├── storage.mjs        # localStorage/IndexedDB abstraction
│   ├── locale.mjs         # i18n localization
│   ├── qrcode.mjs         # QR code generation
│   ├── capabilities.mjs   # Browser feature detection
│   ├── streams.mjs        # Stream transformation utilities
│   ├── utils.mjs          # General utilities
│   ├── controller.mjs     # Application state management
│   ├── ownedFile.mjs      # File metadata model
│   ├── serviceWorker.mjs  # Service worker for stream downloads
│   ├── zip.mjs            # ZIP file operations
│   └── utils-worker.mjs   # Web Worker utilities
│
├── templates/              # Go HTML templates (server-rendered)
│   ├── index.gohtml       # Main page template
│   ├── head.gohtml        # HTML <head> with assets, CSP nonce
│   ├── body.gohtml        # <body> wrapper
│   ├── footer.gohtml      # Footer component
│   ├── _app.gohtml        # App container (used by index)
│   ├── _footer.gohtml     # Footer partial
│   ├── login.gohtml       # Login page (if auth enabled)
│   ├── account_*.gohtml   # Account management pages
│   └── README.md          # Template documentation
│
├── assets/                 # Static assets (icons, images)
├── assets_src/             # Source assets (SVG, etc.)
│
├── public/                 # Additional static files
│   └── inter.css          # Inter font CSS
│
├── locales/                 # Localization files, get build into dist/
│
├── dist/                   # Build output (gitignored)
│   ├── main.*.js          # Bundled JavaScript (with hash)
│   ├── main.*.css         # Bundled CSS (with hash)
│   ├── styles.*.css       # Additional styles (with hash)
│   └── manifest.json      # Asset manifest for Go server
│
├── scripts/                # Build and dev scripts
│   └── dev.mjs            # Development watch script
│
├── esbuild.config.mjs      # ESBuild configuration
├── postcss.config.mjs      # PostCSS configuration (Tailwind)
├── package.json            # Node dependencies and scripts
└── CLAUDE.md              # This file
```

---

## Architecture

### 1. Server-Side Rendering (Go Templates)

Go templates (`templates/*.gohtml`) provide the initial HTML structure. The server:
- Renders the base HTML with CSP nonces
- Injects asset URLs with cache-busting hashes from `dist/manifest.json`
- Provides initial configuration via `window.LIMITS`, `window.DEFAULTS`, `window.WEB_UI`, `window.PREFS`

**Example template usage:**
```html
<!-- templates/index.gohtml -->
<!DOCTYPE html>
<html>
  {{template "head.gohtml" .}}
  <body>
    {{template "body.gohtml" .}}
  </body>
</html>
```

### 2. JavaScript Architecture

**Entry Point (`src/main.mjs`):**
- Detects browser capabilities
- Registers service worker (if supported)
- Loads translations
- Initializes `window.initialState` with app configuration

**Core Modules (Business Logic):**
These modules contain the critical encryption and file transfer logic from the original Firefox Send implementation. **DO NOT rewrite these** - they have been thoroughly tested and audited:

- `api.mjs` - Backend communication
- `ece.mjs` - Encryption/decryption (RFC 8188)
- `keychain.mjs` - HKDF key derivation
- `fileSender.mjs` - Upload with encryption
- `fileReceiver.mjs` - Download with decryption
- `controller.mjs` - Application state
- `serviceworker.mjs` - Service worker for streaming downloads

**Support Modules:**
- `archive.mjs` - Manages file collections
- `storage.mjs` - Browser storage abstraction
- `locale.mjs` - i18n support
- `utils.mjs` - Helper functions

**UI**
- `src/ui/` - Web components and their logic

### 3. Build Process (ESBuild)

- DO NOT RUN ANY CODE TO DEBUG OR TEST
- ONLY THE USER BUILDS AND RUNS THE CODE
- THE USER REPORTS THE BUGS AND ISSUES DURING RUNNING AND BUILDING


**What happens during build:**
1. ESBuild bundles `src/main.mjs` → `dist/main.[hash].js`
2. PostCSS processes `src/styles.css` with Tailwind → `dist/main.[hash].css`
3. Assets are copied with cache-busting hashes
4. `dist/manifest.json` is generated with file mappings

**ESBuild Configuration (`esbuild.config.mjs`):**
- Entry: `src/main.mjs`, `src/styles.css`
- Output: `dist/` with hash-based filenames
- Plugins: PostCSS for Tailwind processing
- Minification and sourcemaps in production

### 4. Styling (Tailwind CSS 4.x)

Tailwind utilities are used throughout the project:
- Entry point: `src/styles.css`
- Processed via PostCSS plugin
- No Shadow DOM (so Tailwind classes work everywhere)

---

## Development Workflow

- DO NOT RUN ANY CODE TO DEBUG OR TEST
- ONLY THE USER BUILDS AND RUNS THE CODE
- THE USER REPORTS THE BUGS AND ISSUES DURING RUNNING AND BUILDING

### Adding New Features

**Add a new module:**
1. Create `src/my-module.mjs` or `src/ui/my-component.mjs`
2. Export functions/classes
3. Import in `src/main.mjs` or where neeeded

**Add styles:**
1. Add Tailwind utilities directly in templates
2. For custom CSS, add to `src/styles.css`
3. For managing dark/ligt mode colors, add to `src/colors.css`

---

## Current Status

### ✅ Completed

- ESBuild + PostCSS + Tailwind build pipeline
- Core business logic modules migrated (api, ece, keychain, fileSender, fileReceiver)
- Go template structure
- Asset management with cache busting
- Service worker setup
- Localization framework

### 🚧 In Progress

- UI implementation in `templates/_app.gohtml`
- Upload/download UI in `templates/_app.gohtml`
- Web Components implementation in `src/ui/`
- View switching logic in `src/ui/`
- File list management
- Share dialogs

### ❌ Not Started

- Drag-and-drop UI (logic exists in `dragManager.mjs.old`)
- Paste handling UI (logic exists in `pasteManager.mjs.old`)
- QR code display component
- Password protection UI
- Progress indicators
- Error handling UI
- Accessibility improvements

---

## Important Notes


### DO

- Keep crypto logic intact (api, ece, keychain, fileSender, fileReceiver)
- Use ES Modules (`.mjs` extension)
- Use Tailwind utility classes for styling
- Use Go templates for HTML structure
- Use <template> tag for partials, mount them in web componewnt classes
- Mount templates early, derfer all other logic duriunc connectedCallback and constructor
- Split UI handling logic from business logic in `src/ui/` and `src/`


### DON'T

- DONT Put HTML in web component classes
- DONT Rewrite or "improve" the encryption modules
- DONT Add any dependencies w/o user consent
- DONT Add client side routes w/o user consent
- DONT Use Shadow DOM introduces complexity
- DONT Create further build configurations w/o asking

---

## Key Files Reference

### Must Understand

- `src/main.mjs` - Application initialization
- `src/controller.mjs` - Controller, controls the app state
- `src/api.mjs` - Backend API client
- `src/ece.mjs` - Encryption implementation
- `src/serviceworker.mjs` - Service worker for streaming downloads
- `templates/index.gohtml` and `templates/_app.gohtml` - Main template
- `esbuild.config.mjs` - Build configuration

### For Upload Flow

1. User selects files → UI (to be built)
2. `archive.mjs` - Creates file collection
3. `fileSender.mjs` - Orchestrates upload
4. `ece.mjs` - Encrypts file chunks
5. `api.mjs` - WebSocket upload to server

### For Download Flow

1. User opens download link → `templates/index.gohtml`
2. `api.mjs` - Fetches encrypted metadata
3. `keychain.mjs` - Derives decryption key from URL fragment
4. `fileReceiver.mjs` - Orchestrates download
5. `ece.mjs` - Decrypts file chunks
6. Browser downloads decrypted file

---

## Resources

- **Old Frontend**: `../frontend_deprecated/` (reference for logic only, not architecture)
- **Backend**: `../` (Go server that serves this frontend)
- **Templates**: `templates/README.md`
- **Tailwind CSS**: https://tailwindcss.com/docs
- **ESBuild**: https://esbuild.github.io/
- **Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- **RFC 8188 (ECE)**: https://tools.ietf.org/html/rfc8188

---

**Last Updated**: 2025-10-10
**Status**: Early Development - Core Infrastructure Complete, UI Implementation Pending
