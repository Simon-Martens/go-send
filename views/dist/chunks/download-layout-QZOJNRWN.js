import {
  translateElement
} from "./chunk-XWMZRMIJ.js";

// src/ui/download-layout.mjs
var DownloadLayoutElement = class extends HTMLElement {
  constructor() {
    super();
    this.currentView = null;
    this.currentViewElement = null;
    this.fileInfo = null;
    this.app = null;
    this._templateMounted = false;
    this._postMountFrame = null;
    this._boundHandlers = {
      passwordSubmit: this.handlePasswordSubmit.bind(this),
      downloadStart: this.handleDownloadStart.bind(this)
    };
    this._handlersBound = false;
  }
  connectedCallback() {
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
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }
      translateElement(this);
      this.app = this.closest("go-send");
      if (!this._handlersBound) {
        this.addEventListener("password-submit", this._boundHandlers.passwordSubmit);
        this.addEventListener("download-start", this._boundHandlers.downloadStart);
        this._handlersBound = true;
      }
      this.initializeFileInfo();
      if (!this.fileInfo) {
        this.showErrorView("File not found");
        return;
      }
      if (this.fileInfo.requiresPassword && !this.fileInfo.password) {
        this.showPasswordView();
      } else {
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
    const meta = window.downloadMetadata;
    if (!meta || meta.status === 404) {
      this.fileInfo = null;
      return;
    }
    const { id, key } = this.parseURL();
    if (!id || !key) {
      console.error("[download-layout] Invalid URL: missing file ID or secret key");
      this.fileInfo = null;
      return;
    }
    const fileInfoUrl = window.location.href.replace(/\?.+#/, "#");
    this.fileInfo = {
      id,
      secretKey: key,
      nonce: meta.nonce,
      requiresPassword: meta.pwd || false,
      password: null,
      url: fileInfoUrl,
      // Required for password authentication
      // These will be filled after metadata fetch:
      name: null,
      type: null,
      size: null,
      manifest: null,
      iv: null
    };
    console.log("[download-layout] Initialized fileInfo:", {
      id: this.fileInfo.id,
      requiresPassword: this.fileInfo.requiresPassword
    });
  }
  /**
   * Parse URL to extract file ID from pathname and secret key from fragment
   * Supports both /{fileId} and /download/{fileId} formats
   */
  parseURL() {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const match = pathname.match(/\/(?:download\/)?([0-9a-fA-F]{10,16})/);
    const id = match ? match[1] : null;
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
      bubbles: true
    });
    this.dispatchEvent(event);
  }
  /**
   * Event Handlers (internal to layout)
   */
  handlePasswordSubmit(event) {
    const { password } = event.detail;
    console.log("[download-layout] Password submitted");
    event.stopPropagation();
    this.fileInfo.password = password;
    this.dispatchMetadataRequest();
  }
  handleDownloadStart(event) {
    console.log("[download-layout] Download start requested");
    this.showDownloadingView();
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
    container.innerHTML = "";
    const viewElement = document.createElement(customElementTag);
    container.appendChild(viewElement);
    this.currentView = viewName;
    this.currentViewElement = viewElement;
    if (configCallback) {
      configCallback(viewElement);
    }
    console.log(`[download-layout] Switched to view: ${viewName}`);
  }
};
customElements.define("download-layout", DownloadLayoutElement);
//# sourceMappingURL=download-layout-QZOJNRWN.js.map
