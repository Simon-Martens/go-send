import FileReceiver from "./fileReceiver";
import FileSender from "./fileSender";
// import copyDialog from "./ui/copyDialog";
// import okDialog from "./ui/okDialog";
// import shareDialog from "./ui/shareDialog";
import { bytes } from "./utils";
import { copyToClipboard, delay, openLinksInNewTab, percent, setTranslate, locale } from "./utils";
import getCapabilities from "./capabilities.mjs";
import storage from "./storage.mjs";
import { getTranslator } from "./locale.mjs";
import Archive from "./archive.mjs";
import { setupProgressIndicators } from "./faviconProgress.mjs";

/**
 * Controller - Handles business logic for the application
 *
 * This class initializes application state and listens to events
 * from the <go-send> custom element to orchestrate file uploads,
 * downloads, and state management.
 *
 * Usage:
 *   const controller = new Controller(goSendElement);
 *   await controller.ready;  // Wait for state initialization
 *   controller.hookupHandlers();  // in connectedCallback
 *   controller.destroyHandlers(); // in disconnectedCallback
 */
export class Controller {
  constructor(rootElement) {
    this.root = rootElement;
    this.state = null;

    // Bind event handlers so they maintain 'this' context
    this.handleAddFiles = this.handleAddFiles.bind(this);
    this.handleRemoveUpload = this.handleRemoveUpload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleUpdateOptions = this.handleUpdateOptions.bind(this);

    // Download handlers
    this.handleMetadataRequest = this.handleMetadataRequest.bind(this);
    this.handleDownloadStart = this.handleDownloadStart.bind(this);

    // Track intervals for cleanup
    this.intervals = [];

    // Track last render time for countdown timer optimization
    this.lastRender = 0;

    // Setup favicon/title progress indicators
    this.progressIndicators = setupProgressIndicators();

    // Start async initialization immediately
    this.ready = this.initialize();
  }

  /**
   * Initialize application state asynchronously
   * - Check browser capabilities (crypto, service worker)
   * - Register service worker if supported
   * - Load translations
   * - Create initial state object
   * - Expose state globally for debugging
   */
  async initialize() {
    /* global DEFAULTS LIMITS WEB_UI PREFS */

    // Check capabilities
    const capabilities = await getCapabilities();
    if (!capabilities.crypto && window.location.pathname !== "/unsupported/crypto") {
      window.location.assign("/unsupported/crypto");
      throw new Error("Crypto not supported");
    }

    // Register service worker
    if (capabilities.serviceWorker) {
      try {
        await navigator.serviceWorker.register("/serviceWorker.js");
        await navigator.serviceWorker.ready;
        console.log("[Controller] Service Worker registered");
      } catch (e) {
        console.warn("[Controller] Service Worker registration failed:", e);
        capabilities.streamDownload = false;
      }
    }

    // Load translations
    const translate = await getTranslator(locale());
    setTranslate(translate);
    window.translate = translate; // Make globally available for components

    // Create state object
    this.state = {
      LIMITS,
      DEFAULTS,
      WEB_UI,
      PREFS,
      archive: new Archive([], DEFAULTS.EXPIRE_SECONDS, DEFAULTS.DOWNLOADS),
      capabilities,
      translate,
      storage,
      transfer: null,
      fileInfo: null,
      locale: locale(),
    };

    // Expose globally for debugging and external access
    window.appState = this.state;

    console.log("[Controller] Initialization complete");
    return this.state;
  }

  /**
   * Initialize upload view - check for existing files
   * Called when upload-layout is first shown
   */
  async initializeUploadView() {
    console.log("[Controller] Initializing upload view");
    await this.checkFiles();
  }

  /**
   * Attach event listeners to the root element
   * Call this in connectedCallback()
   */
  hookupHandlers() {
    this.root.addEventListener("addfiles", this.handleAddFiles);
    this.root.addEventListener("removeupload", this.handleRemoveUpload);
    this.root.addEventListener("upload", this.handleUpload);
    this.root.addEventListener("cancel", this.handleCancel);
    this.root.addEventListener("delete", this.handleDelete);
    this.root.addEventListener("copy", this.handleCopy);
    this.root.addEventListener("share", this.handleShare);
    this.root.addEventListener("updateoptions", this.handleUpdateOptions);

    // Download handlers
    this.root.addEventListener("metadata-request", this.handleMetadataRequest);
    this.root.addEventListener("download-start", this.handleDownloadStart);

    // Set up periodic tasks (like in old controller)

    // Poll for file info updates (download counts, expiration) every 2 minutes
    this.intervals.push(
      setInterval(() => this.checkFiles(), 2 * 60 * 1000)
    );

    // Re-render file list every minute to update countdown timers ("expires in X minutes")
    this.intervals.push(
      setInterval(() => this.rerenderCountdowns(), 60 * 1000)
    );

    console.log("[Controller] Event handlers attached");
  }

  /**
   * Remove event listeners and clean up intervals
   * Call this in disconnectedCallback()
   */
  destroyHandlers() {
    this.root.removeEventListener("addfiles", this.handleAddFiles);
    this.root.removeEventListener("removeupload", this.handleRemoveUpload);
    this.root.removeEventListener("upload", this.handleUpload);
    this.root.removeEventListener("cancel", this.handleCancel);
    this.root.removeEventListener("delete", this.handleDelete);
    this.root.removeEventListener("copy", this.handleCopy);
    this.root.removeEventListener("share", this.handleShare);
    this.root.removeEventListener("updateoptions", this.handleUpdateOptions);

    // Download handlers
    this.root.removeEventListener("metadata-request", this.handleMetadataRequest);
    this.root.removeEventListener("download-start", this.handleDownloadStart);

    // Clear intervals
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];

    console.log("[Controller] Event handlers destroyed");
  }

  /**
   * Event Handlers
   */

  async handleAddFiles(event) {
    const { files } = event.detail;

    if (files.length < 1) {
      return;
    }

    console.log("[Controller] Adding files:", files);

    const maxSize = this.state.LIMITS.MAX_FILE_SIZE;
    try {
      this.state.archive.addFiles(
        files,
        maxSize,
        this.state.LIMITS.MAX_FILES_PER_ARCHIVE,
      );

      this._showUploadAreaError(null);

      if (
        this.root.currentLayout &&
        typeof this.root.currentLayout.refreshArchiveState === "function"
      ) {
        this.root.currentLayout.refreshArchiveState();
      }
    } catch (e) {
      console.error("[Controller] Error adding files:", e);
      this._handleAddFilesError(e);
    }
  }

  handleRemoveUpload(event) {
    const { file } = event.detail;

    console.log("[Controller] Removing upload:", file);

    this.state.archive.remove(file);
    if (this.state.archive.numFiles === 0) {
      this.state.archive.clear();
    }

    this._showUploadAreaError(null);

    if (
      this.root.currentLayout &&
      typeof this.root.currentLayout.refreshArchiveState === "function"
    ) {
      this.root.currentLayout.refreshArchiveState();
    }
  }

  handleUpdateOptions(event) {
    const { timeLimit, downloadLimit, password, archiveName } = event.detail;
    const archive = this.state.archive;

    if (!archive) {
      return;
    }

    if (typeof timeLimit === "number" && !Number.isNaN(timeLimit)) {
      archive.timeLimit = timeLimit;
    }

    if (typeof downloadLimit === "number" && !Number.isNaN(downloadLimit)) {
      archive.dlimit = downloadLimit;
    }

    if (password !== undefined) {
      archive.password = password ? password : null;
    }

    if (archiveName !== undefined) {
      archive.customArchiveName = archiveName ? archiveName : null;
    }

    console.log("[Controller] Updated archive options", {
      timeLimit: archive.timeLimit,
      downloadLimit: archive.dlimit,
      password: archive.password ? "***" : null,
    });

  }

  async handleUpload(event) {
    console.log("[Controller] Starting upload");

    if (this.state.storage.files.length >= this.state.LIMITS.MAX_ARCHIVES_PER_USER) {
      console.warn("[Controller] Too many archives");
      // TODO: Show error dialog
      return;
    }

    const archive = this.state.archive;
    const sender = new FileSender();

    sender.addEventListener("progress", () => this.updateProgress());
    sender.addEventListener("encrypting", () => this.render());
    sender.addEventListener("complete", () => this.render());

    this.state.transfer = sender;
    this.state.uploading = true;
    this.render();

    if (
      this.root.currentLayout &&
      typeof this.root.currentLayout.refreshArchiveState === "function"
    ) {
      this.root.currentLayout.refreshArchiveState();
    }

    const links = openLinksInNewTab();
    await delay(200);

    try {
      const ownedFile = await sender.upload(archive);
      this.state.storage.totalUploads += 1;
      this.progressIndicators.reset();

      this.state.storage.addFile(ownedFile);

      // TODO: Handle password
      if (archive.password) {
        await this.handlePassword({ password: archive.password, file: ownedFile });
      }

      // TODO: Show share dialog
      console.log("[Controller] Upload complete:", ownedFile);

      // Reset upload state after successful upload
      this.state.uploading = false;
      this.state.transfer = null;

      // Clear the archive for next upload
      archive.clear();
      await this.state.storage.merge();

      // Update the layout to show complete view
      if (this.root.currentLayout && this.root.currentLayout.setUploadComplete) {
        this.root.currentLayout.setUploadComplete(ownedFile);
      }

    } catch (err) {
      if (err.message === "0") {
        // Cancelled, do nothing
        console.log("[Controller] Upload cancelled");

        // Reset state for cancel
        openLinksInNewTab(links, false);
        archive.clear();
        this.state.uploading = false;
        this.state.transfer = null;
        await this.state.storage.merge();
        this.render();

        if (
          this.root.currentLayout &&
          typeof this.root.currentLayout.refreshArchiveState === "function"
        ) {
          this.root.currentLayout.refreshArchiveState();
        }
      } else {
        console.error("[Controller] Upload error:", err);

        // Reset upload state but keep archive for retry
        this.state.uploading = false;
        this.state.transfer = null;
        this.render();

        // Show error after state is reset
        this._showUploadError(err.message || "An error occurred during upload");
      }
    }
  }

  handleCancel(event) {
    console.log("[Controller] Cancelling upload");

    if (this.state.transfer) {
      this.state.transfer.cancel();
      this.progressIndicators.reset();
    }

    if (
      this.root.currentLayout &&
      typeof this.root.currentLayout.refreshArchiveState === "function"
    ) {
      this.root.currentLayout.refreshArchiveState();
    }
  }

  async handleDelete(event) {
    const { ownedFile } = event.detail;

    console.log("[Controller] Deleting file:", ownedFile);

    try {
      this.state.storage.remove(ownedFile.id);
      await ownedFile.del();

      // Update UI: refresh upload list
      if (
        this.root.currentLayout &&
        typeof this.root.currentLayout.refreshUploadList === "function"
      ) {
        this.root.currentLayout.refreshUploadList();
      }
    } catch (e) {
      console.error("[Controller] Error deleting file:", e);
    }
  }

  handleCopy(event) {
    const { url } = event.detail;

    console.log("[Controller] Copying to clipboard:", url);
    copyToClipboard(url);
  }

  handleShare(event) {
    const { url, name } = event.detail;

    console.log("[Controller] Sharing:", { url, name });

    // Use native share API if available
    if (navigator.share) {
      navigator.share({
        title: name,
        url: url
      }).catch(err => console.log("[Controller] Share cancelled:", err));
    } else {
      // Fallback to copy
      this.handleCopy({ detail: { url } });
    }
  }

  /**
   * Helper Methods
   */

  async handlePassword({ password, file }) {
    try {
      this.state.settingPassword = true;
      this.render();
      await file.setPassword(password);
      this.state.storage.writeFile(file);
      await delay(1000);
    } catch (err) {
      console.error("[Controller] Error setting password:", err);
      this.state.passwordSetError = err;
    } finally {
      this.state.settingPassword = false;
    }
    this.render();
  }

  updateProgress() {
    if (!this.state.transfer) return;

    const ratio = this.state.transfer.progressRatio;

    // Update layout if it has progress methods
    if (this.root.currentLayout && this.root.currentLayout.updateProgress) {
      const bytesUploaded = this.state.transfer.progress[0];
      const totalBytes = this.state.transfer.progress[1];
      this.root.currentLayout.updateProgress(ratio, bytesUploaded, totalBytes);
    }

    // Update favicon and title (if window not focused)
    this.progressIndicators.update(ratio);
  }

  /**
   * Check for file updates (download counts, expiration, etc.)
   * Called periodically and on initial load
   */
  async checkFiles() {
    const changes = await this.state.storage.merge();

    // Re-render if download counts changed OR files expired/removed
    if (changes.downloadCount || changes.outgoing) {
      this.render();
    }
  }

  /**
   * Re-render the upload list to update countdown timers
   * Called every minute to update "expires in X minutes" displays
   */
  rerenderCountdowns() {
    // Only re-render if:
    // 1. We have files to show
    // 2. User is on upload view
    // 3. Haven't rendered in the last 30 seconds
    const now = Date.now();
    const hasFiles = this.state.storage && this.state.storage.files.length > 0;
    const isUploadView = this.root.currentLayout && this.root.currentLayout.tagName === 'UPLOAD-LAYOUT';
    const needsUpdate = now - this.lastRender > 30000;

    if (hasFiles && isUploadView && needsUpdate) {
      console.log("[Controller] Updating countdown timers");
      this.render();
    }
  }

  render() {
    // Update last render time
    this.lastRender = Date.now();

    // Refresh upload list if on upload layout
    const layout = this.root.currentLayout;
    if (layout && layout.tagName === 'UPLOAD-LAYOUT' && typeof layout.refreshUploadList === 'function') {
      layout.refreshUploadList();
    }

    console.log("[Controller] Render requested");
  }

  _translate(key, fallback, params) {
    const translator = this.state.translate || window.translate;
    if (typeof translator === "function") {
      try {
        const value = translator(key, params);
        if (value) {
          return value;
        }
      } catch (err) {
        // ignore missing translation key
      }
    }
    return fallback;
  }

  _handleAddFilesError(error) {
    let message = "";

    if (error && error.message === "tooManyFiles") {
      message = this._translate(
        "tooManyFiles",
        `Too many files (max ${this.state.LIMITS.MAX_FILES_PER_ARCHIVE})`,
        {
          count: this.state.LIMITS.MAX_FILES_PER_ARCHIVE,
          size: bytes(this.state.LIMITS.MAX_FILE_SIZE),
        },
      );
    } else if (error && error.message === "fileTooBig") {
      message = this._translate(
        "fileTooBig",
        `That file is too big (max ${bytes(this.state.LIMITS.MAX_FILE_SIZE)})`,
        {
          size: bytes(this.state.LIMITS.MAX_FILE_SIZE),
        },
      );
    }

    if (message) {
      this._showUploadAreaError(message);
    } else {
      this._showUploadAreaError(null);
    }
  }

  _showUploadAreaError(message) {
    const layout = this.root.currentLayout;
    if (!layout || !layout.uploadArea) {
      return;
    }

    if (message && typeof layout.uploadArea.showError === "function") {
      layout.uploadArea.showError(message);
    } else if (!message) {
      if (typeof layout.uploadArea.clearError === "function") {
        layout.uploadArea.clearError();
      } else if (typeof layout.uploadArea.showError === "function") {
        layout.uploadArea.showError(null);
      }
    }
  }

  _showUploadError(message) {
    const layout = this.root.currentLayout;
    if (!layout || !layout.uploadArea) {
      return;
    }

    if (typeof layout.uploadArea.showErrorView === "function") {
      layout.uploadArea.showErrorView(message);
    }
  }

  /**
   * Download Event Handlers
   */

  /**
   * Handle metadata-request event from download-layout
   * Creates FileReceiver and fetches file metadata
   */
  async handleMetadataRequest(event) {
    const { fileInfo } = event.detail;
    console.log("[Controller] Metadata request for file:", fileInfo.id);

    // Store fileInfo in state
    this.state.fileInfo = fileInfo;

    // Create FileReceiver
    const receiver = new FileReceiver(fileInfo);

    try {
      // Fetch metadata (decrypts file info like name, size, type)
      await receiver.getMetadata();

      // Store receiver in state.transfer
      this.state.transfer = receiver;

      // Update fileInfo with decrypted metadata
      Object.assign(this.state.fileInfo, {
        name: receiver.fileInfo.name,
        type: receiver.fileInfo.type,
        size: receiver.fileInfo.size,
        manifest: receiver.fileInfo.manifest,
        iv: receiver.fileInfo.iv,
      });

      console.log("[Controller] Metadata fetched successfully:", {
        name: receiver.fileInfo.name,
        size: receiver.fileInfo.size,
        type: receiver.fileInfo.type,
      });

      // Tell download-layout to show overview
      const layout = this.root.currentLayout;
      if (layout && typeof layout.showOverviewView === "function") {
        layout.showOverviewView(this.state.fileInfo);
      }
    } catch (e) {
      console.error("[Controller] Error fetching metadata:", e);

      // Handle specific errors
      if (e.message === "401") {
        // Password incorrect
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showPasswordView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("passwordTryAgain") : "Incorrect password. Please try again.";
          layout.showPasswordView(errorMsg);
        }
      } else if (e.message === "404") {
        // File not found
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("notFoundDescription") : "File not found or expired.";
          layout.showErrorView(errorMsg);
        }
      } else {
        // Other error
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          layout.showErrorView("An error occurred while fetching file information.");
        }
      }
    }
  }

  /**
   * Handle download-start event from file-overview view
   * Starts the actual file download
   */
  async handleDownloadStart(event) {
    console.log("[Controller] Download start");

    if (!this.state.transfer) {
      console.error("[Controller] No transfer (FileReceiver) in state");
      return;
    }

    const receiver = this.state.transfer;

    // Set up progress listeners
    receiver.addEventListener("progress", () => {
      this.updateDownloadProgress();
    });
    receiver.addEventListener("decrypting", () => {
      console.log("[Controller] Decrypting file...");
    });
    receiver.addEventListener("complete", () => {
      console.log("[Controller] Download complete");
      this.handleDownloadComplete();
    });

    try {
      // Start download (choose method based on capabilities)
      const useStream = this.state.capabilities.streamDownload;
      await receiver.download({ stream: useStream });

      // Update stats
      this.state.storage.totalDownloads += 1;
    } catch (err) {
      console.error("[Controller] Download error:", err);

      if (err.message === "0") {
        // Download cancelled by user
        receiver.reset();
        this.progressIndicators.reset();
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showOverviewView === "function") {
          layout.showOverviewView(this.state.fileInfo);
        }
      } else if (err.message === "404") {
        // File not found
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          const translate = this.state.translate || window.translate;
          const errorMsg = translate ? translate("notFoundDescription") : "File not found or expired.";
          layout.showErrorView(errorMsg);
        }
      } else {
        // Other error
        const layout = this.root.currentLayout;
        if (layout && typeof layout.showErrorView === "function") {
          layout.showErrorView("An error occurred during download.");
        }
      }
    }
  }

  /**
   * Update download progress (called during download)
   */
  updateDownloadProgress() {
    if (!this.state.transfer) return;

    const receiver = this.state.transfer;
    const ratio = receiver.progressRatio;
    const bytesDownloaded = receiver.progress[0];
    const totalBytes = receiver.progress[1];

    // Update layout progress
    const layout = this.root.currentLayout;
    if (layout && typeof layout.updateProgress === "function") {
      layout.updateProgress(ratio, bytesDownloaded, totalBytes);
    }

    // Update favicon and title (if window not focused)
    this.progressIndicators.update(ratio);
  }

  /**
   * Handle download complete
   */
  handleDownloadComplete() {
    console.log("[Controller] Download completed successfully");

    // Reset progress indicators
    this.progressIndicators.reset();

    // Show finished view
    const layout = this.root.currentLayout;
    if (layout && typeof layout.showFinishedView === "function") {
      layout.showFinishedView();
    }

    // Clean up
    this.state.transfer = null;
  }
}

// Export old function-based controller for backwards compatibility
export default function (state, emitter) {
  let lastRender = 0;
  let updateTitle = false;

  function render() {
    emitter.emit("render");
  }

  async function checkFiles() {
    const changes = await state.storage.merge();
    const rerender = changes.downloadCount;
    if (rerender) {
      render();
    }
  }

  function updateProgress() {
    if (updateTitle) {
      emitter.emit("DOMTitleChange", percent(state.transfer.progressRatio));
    }
    faviconProgressbar.updateFavicon(state.transfer.progressRatio);
    render();
  }

  emitter.on("DOMContentLoaded", () => {
    document.addEventListener("blur", () => (updateTitle = true));
    document.addEventListener("focus", () => {
      updateTitle = false;
      emitter.emit("DOMTitleChange", "Send");
      faviconProgressbar.updateFavicon(0);
    });
    checkFiles();
  });

  emitter.on("render", () => {
    lastRender = Date.now();
  });

  emitter.on("removeUpload", (file) => {
    state.archive.remove(file);
    if (state.archive.numFiles === 0) {
      state.archive.clear();
    }
    render();
  });

  emitter.on("delete", async (ownedFile) => {
    try {
      state.storage.remove(ownedFile.id);
      await ownedFile.del();
    } catch (e) {
      console.error(e);
    }
    render();
  });

  emitter.on("cancel", () => {
    state.transfer.cancel();
    faviconProgressbar.updateFavicon(0);
  });

  emitter.on("addFiles", async ({ files }) => {
    if (files.length < 1) {
      return;
    }
    const maxSize = state.LIMITS.MAX_FILE_SIZE;
    try {
      state.archive.addFiles(
        files,
        maxSize,
        state.LIMITS.MAX_FILES_PER_ARCHIVE,
      );
    } catch (e) {
      state.modal = okDialog(
        state.translate(e.message, {
          size: bytes(maxSize),
          count: state.LIMITS.MAX_FILES_PER_ARCHIVE,
        }),
      );
    }
    render();
  });

  emitter.on("upload", async () => {
    if (state.storage.files.length >= state.LIMITS.MAX_ARCHIVES_PER_USER) {
      state.modal = okDialog(
        state.translate("tooManyArchives", {
          count: state.LIMITS.MAX_ARCHIVES_PER_USER,
        }),
      );
      return render();
    }
    const archive = state.archive;
    const sender = new FileSender();

    sender.addEventListener("progress", updateProgress);
    sender.addEventListener("encrypting", render);
    sender.addEventListener("complete", render);
    state.transfer = sender;
    state.uploading = true;
    render();

    const links = openLinksInNewTab();
    await delay(200);
    try {
      const ownedFile = await sender.upload(archive);
      state.storage.totalUploads += 1;
      faviconProgressbar.updateFavicon(0);

      state.storage.addFile(ownedFile);
      // TODO: integrate password into /upload request
      if (archive.password) {
        emitter.emit("password", {
          password: archive.password,
          file: ownedFile,
        });
      }
      state.modal = state.capabilities.share
        ? shareDialog(ownedFile.name, ownedFile.url)
        : copyDialog(ownedFile.name, ownedFile.url);
    } catch (err) {
      if (err.message === "0") {
        //cancelled. do nothing
        render();
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
        emitter.emit("pushState", "/error");
      }
    } finally {
      openLinksInNewTab(links, false);
      archive.clear();
      state.uploading = false;
      state.transfer = null;
      await state.storage.merge();
      render();
    }
  });

  emitter.on("password", async ({ password, file }) => {
    try {
      state.settingPassword = true;
      render();
      await file.setPassword(password);
      state.storage.writeFile(file);
      await delay(1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      state.passwordSetError = err;
    } finally {
      state.settingPassword = false;
    }
    render();
  });

  emitter.on("getMetadata", async () => {
    const file = state.fileInfo;

    const receiver = new FileReceiver(file);
    try {
      await receiver.getMetadata();
      state.transfer = receiver;
    } catch (e) {
      if (e.message === "401" || e.message === "404") {
        file.password = null;
        if (!file.requiresPassword) {
          return emitter.emit("pushState", "/404");
        }
      } else {
        console.error(e);
        return emitter.emit("pushState", "/error");
      }
    }

    render();
  });

  emitter.on("download", async () => {
    state.transfer.addEventListener("progress", updateProgress);
    state.transfer.addEventListener("decrypting", render);
    state.transfer.addEventListener("complete", render);
    const links = openLinksInNewTab();
    try {
      const dl = state.transfer.download({
        stream: state.capabilities.streamDownload,
      });
      render();
      await dl;
      state.storage.totalDownloads += 1;
      faviconProgressbar.updateFavicon(0);
    } catch (err) {
      if (err.message === "0") {
        // download cancelled
        state.transfer.reset();
        render();
      } else {
        // eslint-disable-next-line no-console
        state.transfer = null;
        const location = err.message === "404" ? "/404" : "/error";
        if (location === "/error") {
          console.error(err);
        }
        emitter.emit("pushState", location);
      }
    } finally {
      openLinksInNewTab(links, false);
    }
  });

  emitter.on("copy", ({ url }) => {
    copyToClipboard(url);
  });

  emitter.on("closeModal", () => {
    state.modal = null;
    render();
  });

  setInterval(
    () => {
      // poll for updates of the upload list
      if (!state.modal && state.route === "/") {
        checkFiles();
      }
    },
    2 * 60 * 1000,
  );

  setInterval(() => {
    // poll for rerendering the file list countdown timers
    if (
      !state.modal &&
      state.route === "/" &&
      state.storage.files.length > 0 &&
      Date.now() - lastRender > 30000
    ) {
      render();
    }
  }, 60000);
}
