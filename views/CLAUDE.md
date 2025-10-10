# Claude Code Context: go-send New Frontend (views/)

## ⚠️ CRITICAL: Frontend Rewrite in Progress

**THIS IS AN ACTIVE FRONTEND REWRITE. DO NOT USE THE OLD CHOO-BASED FRONTEND AS A REFERENCE FOR ARCHITECTURE.**

We are **completely replacing** the legacy frontend (`../frontend/`) with a modern, minimal implementation that:

### 🚨 MANDATORY REQUIREMENTS

1. **NO BUILD SYSTEM (Vite/Webpack)** → Use **ESBuild** ONLY
   - Simple, fast bundling
   - No complex configuration
   - Direct ES module support

2. **NO FRONTEND FRAMEWORK (Choo)** → Use **Browser-Native Web Components**
   - NO Shadow DOM (incompatible with Tailwind)
   - Custom elements with `class extends HTMLElement`
   - Reactive updates via direct DOM manipulation

3. **NO CLIENT-SIDE ROUTING** → Use **Go Template `<template>` Elements**
   - Go templates (`templates/*.gohtml`) contain `<template>` elements for different views
   - JavaScript shows/hides templates based on application state
   - Server-side rendering of initial HTML structure

4. **Tailwind CSS** for styling
   - Use Tailwind utility classes throughout
   - No Shadow DOM to ensure Tailwind works correctly
   - Processed via ESBuild plugin or PostCSS

### What We're Keeping from `../frontend/`

The **business logic** and **crypto implementation** are sound. Reuse these JavaScript modules:

- **`api.js`** - HTTP/WebSocket API client for upload/download/metadata
- **`ece.js`** - Encrypted Content-Encoding (RFC 8188) implementation
- **`keychain.js`** - HKDF key derivation, auth key management
- **`fileSender.js`** - Upload orchestration with encryption
- **`fileReceiver.js`** - Download orchestration with decryption
- **`ownedFile.js`** - File metadata model
- **`archive.js`** - Archive/ZIP file handling
- **`storage.js`** - localStorage/IndexedDB abstraction
- **`locale.js`** - i18n localization logic
- **`qrcode.js`** - QR code generation
- **`capabilities.js`** - Browser feature detection
- **`streams.js`** - Stream transformation utilities
- **`utils.js`** - General utilities
- **`serviceWorker.js`** - Service worker for stream downloads

### What We're Replacing

- **Choo framework** → Web Components + vanilla JS
- **`routes.js`** → Template-based view switching
- **All `ui/*.js` files** → Rewritten as Web Components
- **Webpack** → ESBuild
- **`main.js`** → Simplified initialization without Choo

---

## Project Structure

```
views/
├── CLAUDE.md              # This file - FRONTEND REWRITE CONTEXT
├── templates/             # Go HTML templates (server-rendered)
│   ├── index.gohtml      # Main page with <template> elements for views
│   ├── footer.gohtml     # Footer component
│   ├── head.gohtml       # <head> with assets, CSP nonce
│   ├── body.gohtml       # <body> wrapper
│   ├── login.gohtml      # Login page (if auth enabled)
│   ├── account_*.gohtml  # Account management pages
│   └── README.md         # Template documentation
│
├── ES/                    # JavaScript modules (ESM) - BUSINESS LOGIC
│   ├── main.js           # Entry point (NO CHOO, init web components)
│   ├── api.mjs           # API client (KEEP FROM OLD FRONTEND)
│   ├── ece.js            # Encryption (KEEP)
│   ├── keychain.js       # Key derivation (KEEP)
│   ├── fileSender.js     # Upload logic (KEEP)
│   ├── fileReceiver.js   # Download logic (KEEP)
│   ├── archive.mjs       # Archive handling (KEEP)
│   ├── storage.js        # Storage abstraction (KEEP)
│   ├── locale.js         # i18n (KEEP)
│   ├── qrcode.js         # QR codes (KEEP)
│   ├── capabilities.js   # Feature detection (KEEP)
│   ├── streams.js        # Stream utils (KEEP)
│   ├── utils.js          # Utilities (KEEP)
│   ├── serviceWorker.js  # Service worker (KEEP)
│   ├── dragManager.js    # Drag-and-drop (KEEP, ADAPT)
│   ├── pasteManager.js   # Paste handler (KEEP, ADAPT)
│   ├── controller.js     # State management (REWRITE - NO CHOO)
│   ├── ownedFile.js      # File model (KEEP)
│   └── main.css          # Global CSS (minimal, mostly Tailwind)
│
├── components/            # Web Components (NEW - TO BE CREATED)
│   ├── upload-form.js    # File upload UI component
│   ├── download-view.js  # File download UI component
│   ├── file-list.js      # Uploaded files list
│   ├── expiry-options.js # Download limit/expiry selectors
│   ├── progress-bar.js   # Upload/download progress
│   ├── share-dialog.js   # Share link dialog
│   ├── password-dialog.js # Password protection UI
│   ├── qr-dialog.js      # QR code display
│   └── ...               # More components as needed
│
├── assets/                # Static assets (icons, images)
│   └── ...
│
├── assets_src/            # Source assets (SVG, etc.)
│   └── ...
│
├── common/                # Shared utilities
│   └── assets.js         # Asset path mapping
│
└── dist/                  # Build output (ESBuild) - GITIGNORED
    ├── bundle.js         # Bundled JS
    ├── bundle.css        # Bundled CSS (Tailwind + custom)
    └── manifest.json     # Asset manifest for cache busting
```

---

## Architecture Overview

### 1. Go Templates (`templates/*.gohtml`)

Server renders HTML structure with embedded `<template>` elements for different views:

```html
<!-- templates/index.gohtml -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/{{.CSS}}">
</head>
<body>
  <main id="app">
    <!-- Upload view -->
    <template id="upload-view">
      <upload-form></upload-form>
      <file-list></file-list>
    </template>

    <!-- Download view -->
    <template id="download-view">
      <download-view file-id="{{.FileID}}"></download-view>
    </template>

    <!-- Error view -->
    <template id="error-view">
      <div class="error">...</div>
    </template>
  </main>

  <script type="module" src="/{{.JS}}"></script>
</body>
</html>
```

**Key Points:**
- Go templates provide initial HTML structure
- `<template>` elements are inert until activated by JS
- No client-side routing library needed
- CSP nonce: `{{.Nonce}}` for inline scripts/styles

### 2. Web Components (`components/*.js`)

Custom elements for UI components WITHOUT Shadow DOM:

```javascript
// components/upload-form.js
export class UploadForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <input type="file" multiple class="hidden" id="file-input">
        <button class="btn-primary" onclick="this.previousElementSibling.click()">
          Select Files
        </button>
      </div>
    `;

    this.querySelector('#file-input').addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('files-selected', {
        detail: { files: e.target.files },
        bubbles: true
      }));
    });
  }
}

customElements.define('upload-form', UploadForm);
```

**Why No Shadow DOM?**
- Tailwind classes need to reach component internals
- Simpler debugging (everything in main DOM tree)
- Better accessibility (easier to inspect/test)

### 3. Application State (`ES/controller.js`)

Simple state management without Choo:

```javascript
// ES/controller.js
export class AppController {
  constructor() {
    this.state = {
      view: 'upload',
      archive: new Archive(),
      transfer: null,
      capabilities: {},
      translate: () => {},
    };
    this.listeners = new Set();
  }

  setState(updates) {
    Object.assign(this.state, updates);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  showView(viewName) {
    const app = document.getElementById('app');
    const template = document.getElementById(`${viewName}-view`);
    if (!template) return;

    const clone = template.content.cloneNode(true);
    app.innerHTML = '';
    app.appendChild(clone);

    this.setState({ view: viewName });
  }
}
```

### 4. Entry Point (`ES/main.js`)

Initialize app without Choo:

```javascript
// ES/main.js
import { AppController } from './controller.js';
import { getCapabilities } from './capabilities.js';
import { getTranslator } from './locale.js';
import './components/upload-form.js';
import './components/download-view.js';
// ... import all components

(async function init() {
  const capabilities = await getCapabilities();
  const translate = await getTranslator(navigator.language);

  window.app = new AppController();
  window.app.setState({
    capabilities,
    translate,
    LIMITS: window.LIMITS,
    DEFAULTS: window.DEFAULTS,
  });

  // Initial view based on URL
  const path = window.location.pathname;
  if (path.includes('/download/')) {
    window.app.showView('download');
  } else {
    window.app.showView('upload');
  }
})();
```

### 5. Build Process (ESBuild)

Simple `esbuild.config.js`:

```javascript
import esbuild from 'esbuild';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

esbuild.build({
  entryPoints: ['ES/main.js', 'ES/main.css'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: 'dist',
  plugins: [
    {
      name: 'postcss',
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
          const css = await fs.readFile(args.path, 'utf8');
          const result = await postcss([tailwindcss, autoprefixer]).process(css, {
            from: args.path
          });
          return { contents: result.css, loader: 'css' };
        });
      }
    }
  ]
}).catch(() => process.exit(1));
```

---

## Key Differences from Old Frontend

| Old (`../frontend/`) | New (`views/`) |
|----------------------|----------------|
| Choo framework | Vanilla JS + Web Components |
| Client-side routing | Template-based view switching |
| Webpack | ESBuild |
| `ui/*.js` Choo components | `components/*.js` Web Components |
| `routes.js` | Go templates with `<template>` elements |
| Complex build | Simple build |
| Shadow DOM (no Tailwind) | No Shadow DOM (Tailwind-friendly) |

---

## Development Workflow

### Running the App

```bash
# Build frontend
cd views
npm install
npm run build  # Runs ESBuild

# Start Go server (from project root)
cd ..
go run .
```

### Building Frontend Only

```bash
cd views
npm run build        # Production build
npm run dev          # Watch mode for development
```

### Adding a New Component

1. Create `components/my-component.js`
2. Define custom element (NO Shadow DOM)
3. Use Tailwind classes for styling
4. Import in `ES/main.js`
5. Use in Go template: `<my-component></my-component>`

### Adding a New View

1. Add `<template id="my-view">` to `templates/index.gohtml`
2. Call `window.app.showView('my-view')` from JS
3. Populate with web components

---

## Critical Implementation Notes

### ✅ DO

- Use Web Components without Shadow DOM
- Keep crypto/upload/download logic from old frontend
- Use Tailwind utility classes everywhere
- Use `<template>` elements in Go templates
- Use ESBuild for bundling
- Dispatch custom events for component communication
- Use `window.app` for global state

### ❌ DON'T

- Import Choo or any frontend framework
- Use Shadow DOM (breaks Tailwind)
- Use client-side routing libraries
- Create a complex build system
- Rewrite crypto logic (keep it!)
- Use `document.write()` or `innerHTML` for untrusted data

---

## Security Considerations

- **CSP Nonce**: Use `{{.Nonce}}` in Go templates for inline scripts
- **XSS Prevention**: Sanitize user input before rendering
- **Client-Side Encryption**: All encryption MUST happen in browser
- **No Secrets in JS**: Server never sees decryption keys
- **HTTPS Only**: Enforce HTTPS in production

---

## Reference Files (from `../frontend/`)

When implementing new features, refer to these old frontend files for **logic only** (not architecture):

- **Upload flow**: `../frontend/app/fileSender.js`
- **Download flow**: `../frontend/app/fileReceiver.js`
- **Encryption**: `../frontend/app/ece.js`
- **API calls**: `../frontend/app/api.js`
- **UI components**: `../frontend/app/ui/*.js` (for BEHAVIOR, not structure)

**DO NOT copy the Choo-based architecture. Only extract the core logic.**

---

## Status of Migration

### ✅ Completed
- Directory structure created
- Core JS modules copied (api, ece, keychain, etc.)
- Go templates set up

### 🚧 In Progress
- Web Components implementation
- ESBuild configuration
- Tailwind integration
- View switching logic

### ❌ Not Started
- Testing framework
- CI/CD for frontend builds
- Accessibility audit
- Localization integration with new components

---

## Questions? Check These First

1. **"Should I use a framework?"** → NO. Web Components only.
2. **"Can I use Shadow DOM?"** → NO. Tailwind won't work.
3. **"Should I use Vite?"** → NO. ESBuild only.
4. **"Can I rewrite the crypto logic?"** → NO. Keep it from old frontend.
5. **"How do I add routing?"** → Use `window.app.showView()` + templates.

---

## Contact & Resources

- **Old Frontend**: `../frontend/` (logic reference only)
- **Backend**: `../` (main Go server)
- **Templates Docs**: `templates/README.md`
- **Web Components**: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- **Tailwind**: https://tailwindcss.com/docs
- **ESBuild**: https://esbuild.github.io/

---

**Last Updated**: 2025-10-10
**Status**: Active Development - Frontend Rewrite Phase
