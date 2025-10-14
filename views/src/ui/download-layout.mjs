import { translateElement } from "../utils.mjs";

/**
 * <download-layout> - Complete download flow container
 *
 * Responsibilities:
 * - Encapsulates entire download state and UI
 * - Manages file-password, file-overview, file-downloading, file-finished child views
 * - Handles download lifecycle (password → overview → downloading → complete)
 * - Forwards events to parent <go-send> element for controller handling
 *
 * State machine:
 *   password → overview → downloading → finished
 *      ↓          ↓
 *    (retry)   (cancel)
 */
class DownloadLayoutElement extends HTMLElement {
  constructor() {
    super();

    // Current view state
    this.currentView = null; // 'password', 'overview', 'downloading', 'finished', 'error'
    this.currentViewElement = null;

    // File info from server + URL
    this.fileInfo = null;

    // App reference
    this.app = null;

    // Template mount tracking
    this._templateMounted = false;
    this._postMountFrame = null;

    // Bound event handlers
    this._boundHandlers = {
      passwordSubmit: this.handlePasswordSubmit.bind(this),
      downloadStart: this.handleDownloadStart.bind(this),
    };
    this._handlersBound = false;
  }

  connectedCallback() {
    // Mount template first (synchronous)
    if (!this._templateMounted) {
      const template = document.getElementById("download-layout");
      if (!template) {
        console.error("Template #download-layout not found");
        return;
      }

      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }

    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
    }

    // Schedule async initialization
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);
      this.app = this.closest("go-send");

      // Bind event listeners
      if (!this._handlersBound) {
        this.addEventListener("password-submit", this._boundHandlers.passwordSubmit);
        this.addEventListener("download-start", this._boundHandlers.downloadStart);
        this._handlersBound = true;
      }

      // Initialize fileInfo from server data
      this.initializeFileInfo();

      // Determine initial view
      if (!this.fileInfo) {
        this.showErrorView("File not found");
        return;
      }

      if (this.fileInfo.requiresPassword && !this.fileInfo.password) {
        this.showPasswordView();
      } else {
        // No password required or password already set → fetch metadata immediately
        this.dispatchMetadataRequest();
      }
    });
  }

  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }

    if (this._handlersBound) {
      this.removeEventListener("password-submit", this._boundHandlers.passwordSubmit);
      this.removeEventListener("download-start", this._boundHandlers.downloadStart);
      this._handlersBound = false;
    }
  }

  /**
   * Initialize fileInfo from URL params and downloadMetadata global
   */
  initializeFileInfo() {
    /* global downloadMetadata */
    const meta = window.downloadMetadata;

    // Check if metadata exists and file wasn't 404
    if (!meta || meta.status === 404) {
      this.fileInfo = null;
      return;
    }

    // Parse URL to extract file ID and secret key
    const { id, key } = this.parseURL();
    if (!id || !key) {
      console.error("[download-layout] Invalid URL: missing file ID or secret key");
      this.fileInfo = null;
      return;
    }

    // Get full URL (needed for password-based key derivation)
    // Strip any url parameters between fileId and secretKey
    const fileInfoUrl = window.location.href.replace(/\?.+#/, '#');

    // Create fileInfo object
    this.fileInfo = {
      id,
      secretKey: key,
      nonce: meta.nonce,
      requiresPassword: meta.pwd || false,
      password: null,
      url: fileInfoUrl, // Required for password authentication
      // These will be filled after metadata fetch:
      name: null,
      type: null,
      size: null,
      manifest: null,
      iv: null,
    };

    console.log("[download-layout] Initialized fileInfo:", {
      id: this.fileInfo.id,
      requiresPassword: this.fileInfo.requiresPassword,
    });
  }

  /**
   * Parse URL to extract file ID from pathname and secret key from fragment
   * Supports both /{fileId} and /download/{fileId} formats
   */
  parseURL() {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Extract file ID from pathname
    // Matches: /abc123 or /download/abc123
    const match = pathname.match(/\/(?:download\/)?([0-9a-fA-F]{10,16})/);
    const id = match ? match[1] : null;

    // Extract secret key from hash (remove leading #)
    const key = hash ? hash.substring(1) : null;

    return { id, key };
  }

  /**
   * Dispatch metadata-request event to controller
   * Controller will create FileReceiver and fetch metadata
   */
  dispatchMetadataRequest() {
    const event = new CustomEvent("metadata-request", {
      detail: { fileInfo: this.fileInfo },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Event Handlers (internal to layout)
   */

  handlePasswordSubmit(event) {
    const { password } = event.detail;
    console.log("[download-layout] Password submitted");

    // Stop event from bubbling (we'll handle it ourselves)
    event.stopPropagation();

    // Update fileInfo with password
    this.fileInfo.password = password;

    // Dispatch metadata request with updated fileInfo
    // Controller will validate password and fetch metadata
    this.dispatchMetadataRequest();
  }

  handleDownloadStart(event) {
    console.log("[download-layout] Download start requested");

    // Show downloading view immediately
    this.showDownloadingView();

    // Bubble event to controller
    // Controller will handle actual download via FileReceiver
  }

  /**
   * Public Methods (called by controller)
   */

  /**
   * Show password entry view
   */
  showPasswordView(errorMessage = null) {
    this._switchView("password", "file-password-view", (viewElement) => {
      if (errorMessage && typeof viewElement.setError === "function") {
        viewElement.setError(errorMessage);
      }
    });
  }

  /**
   * Show file overview view (after successful metadata fetch)
   */
  showOverviewView(fileInfo) {
    // Update our fileInfo with metadata from controller
    if (fileInfo) {
      this.fileInfo = { ...this.fileInfo, ...fileInfo };
    }

    this._switchView("overview", "file-overview-view", (viewElement) => {
      if (typeof viewElement.setFileInfo === "function") {
        viewElement.setFileInfo(this.fileInfo);
      }
    });
  }

  /**
   * Show downloading progress view
   */
  showDownloadingView() {
    this._switchView("downloading", "file-downloading-view", (viewElement) => {
      // Set file info if available
      if (this.fileInfo && typeof viewElement.setFileInfo === "function") {
        viewElement.setFileInfo(this.fileInfo.name || "File", this.fileInfo.size || 0);
      }
    });
  }

  /**
   * Show download complete view
   */
  showFinishedView() {
    this._switchView("finished", "file-finished-view");
  }

  /**
   * Show error view
   */
  showErrorView(errorMessage) {
    this._switchView("error", "file-error-view", (viewElement) => {
      if (typeof viewElement.setError === "function") {
        viewElement.setError(errorMessage);
      } else {
        // Fallback: just show text
        viewElement.textContent = errorMessage;
      }
    });
  }

  /**
   * Update download progress (called by controller during download)
   */
  updateProgress(ratio, bytesDownloaded, totalBytes) {
    if (this.currentView === "downloading" && this.currentViewElement) {
      if (typeof this.currentViewElement.updateProgress === "function") {
        this.currentViewElement.updateProgress(ratio, bytesDownloaded, totalBytes);
      }
    }
  }

  /**
   * Internal: Switch to a different view
   */
  _switchView(viewName, customElementTag, configCallback = null) {
    const container = this.querySelector("#download-content");
    if (!container) {
      console.error("[download-layout] Container #download-content not found");
      return;
    }

    // Clear existing view
    container.innerHTML = "";

    // Create new view element
    const viewElement = document.createElement(customElementTag);
    container.appendChild(viewElement);

    this.currentView = viewName;
    this.currentViewElement = viewElement;

    // Configure view if callback provided
    if (configCallback) {
      configCallback(viewElement);
    }

    console.log(`[download-layout] Switched to view: ${viewName}`);
  }
}

// Register the custom element
customElements.define("download-layout", DownloadLayoutElement);
