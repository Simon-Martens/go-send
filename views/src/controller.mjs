import FileReceiver from "./fileReceiver";
import FileSender from "./fileSender";
// import copyDialog from "./ui/copyDialog";
// import faviconProgressbar from "./ui/faviconProgressbar";
// import okDialog from "./ui/okDialog";
// import shareDialog from "./ui/shareDialog";
import { bytes } from "./utils";
import { copyToClipboard, delay, openLinksInNewTab, percent } from "./utils";

/**
 * Controller - Handles business logic for the application
 *
 * This class listens to events from the <go-send> custom element
 * and orchestrates file uploads, downloads, and state management.
 *
 * Usage:
 *   const controller = new Controller(goSendElement);
 *   controller.hookupHandlers();  // in connectedCallback
 *   controller.destroyHandlers(); // in disconnectedCallback
 */
export class Controller {
  constructor(rootElement) {
    this.root = rootElement;
    this.state = rootElement.state;

    // Bind event handlers so they maintain 'this' context
    this.handleAddFiles = this.handleAddFiles.bind(this);
    this.handleRemoveUpload = this.handleRemoveUpload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleUpdateOptions = this.handleUpdateOptions.bind(this);

    // Track intervals for cleanup
    this.intervals = [];
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

    // Set up periodic tasks (like in old controller)
    this.intervals.push(
      setInterval(() => this.checkFiles(), 2 * 60 * 1000)
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
    const { timeLimit, downloadLimit, password } = event.detail;
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
      // faviconProgressbar.updateFavicon(0);

      this.state.storage.addFile(ownedFile);

      // TODO: Handle password
      if (archive.password) {
        await this.handlePassword({ password: archive.password, file: ownedFile });
      }

      // TODO: Show share dialog
      console.log("[Controller] Upload complete:", ownedFile);

      // Update the layout
      if (this.root.currentLayout && this.root.currentLayout.setUploadComplete) {
        this.root.currentLayout.setUploadComplete(ownedFile);
      }

    } catch (err) {
      if (err.message === "0") {
        // Cancelled, do nothing
        console.log("[Controller] Upload cancelled");
      } else {
        console.error("[Controller] Upload error:", err);
        this.root.showErrorLayout(err.message);
      }
    } finally {
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
    }
  }

  handleCancel(event) {
    console.log("[Controller] Cancelling upload");

    if (this.state.transfer) {
      this.state.transfer.cancel();
      // faviconProgressbar.updateFavicon(0);
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
    } catch (e) {
      console.error("[Controller] Error deleting file:", e);
    }

    // TODO: Render/update UI
    // this.render();
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

    // faviconProgressbar.updateFavicon(ratio);
  }

  async checkFiles() {
    const changes = await this.state.storage.merge();
    if (changes.downloadCount) {
      this.render();
    }
  }

  render() {
    // TODO: Implement rendering logic
    // For now, just log
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
