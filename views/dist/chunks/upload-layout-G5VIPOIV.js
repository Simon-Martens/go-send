import {
  translateElement
} from "./chunk-WCSYBWMD.js";
import "./chunk-IFG75HHC.js";

// src/ui/upload-layout.mjs
var UploadLayoutElement = class extends HTMLElement {
  constructor() {
    super();
    this.uploadArea = null;
    this.uploadRight = null;
    this.app = null;
    this._waitingForUploadAreaUpgrade = false;
    this._waitingForUploadRightUpgrade = false;
    this.state = {
      stage: "empty",
      // 'empty', 'selected', 'uploading', 'complete'
      files: [],
      totalSize: 0,
      progress: 0,
      uploadedFile: null
      // After successful upload
    };
    this._postMountFrame = null;
    this._templateMounted = false;
    this._handlersBound = false;
    this._boundHandlers = {
      addfiles: this.handleAddFiles.bind(this),
      removeupload: this.handleRemoveUpload.bind(this),
      upload: this.handleUpload.bind(this),
      cancel: this.handleCancel.bind(this),
      completeAcknowledged: this.handleCompleteAcknowledged.bind(this),
      retry: this.handleRetry.bind(this),
      errorDismiss: this.handleErrorDismiss.bind(this)
    };
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("upload-layout");
      if (!template) {
        console.error("Template #upload-layout not found");
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
      this.uploadArea = this.querySelector("upload-area");
      this.uploadRight = this.querySelector("upload-right");
      this.app = this.closest("go-send") || this.app;
      if (!this._handlersBound) {
        this.addEventListener("addfiles", this._boundHandlers.addfiles);
        this.addEventListener("removeupload", this._boundHandlers.removeupload);
        this.addEventListener("upload", this._boundHandlers.upload);
        this.addEventListener("cancel", this._boundHandlers.cancel);
        this.addEventListener("complete-acknowledged", this._boundHandlers.completeAcknowledged);
        this.addEventListener("retry", this._boundHandlers.retry);
        this.addEventListener("error-dismiss", this._boundHandlers.errorDismiss);
        this._handlersBound = true;
      }
      this.refreshArchiveState();
      this.refreshUploadList();
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
    if (this._handlersBound) {
      this.removeEventListener("addfiles", this._boundHandlers.addfiles);
      this.removeEventListener("removeupload", this._boundHandlers.removeupload);
      this.removeEventListener("upload", this._boundHandlers.upload);
      this.removeEventListener("cancel", this._boundHandlers.cancel);
      this.removeEventListener("complete-acknowledged", this._boundHandlers.completeAcknowledged);
      this.removeEventListener("retry", this._boundHandlers.retry);
      this.removeEventListener("error-dismiss", this._boundHandlers.errorDismiss);
      this._handlersBound = false;
    }
  }
  /**
   * Event Handlers
   * These handle events from child components and manage state transitions
   */
  handleAddFiles(event) {
    const { files } = event.detail;
    console.log("upload-layout: addfiles", {
      files,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    });
    queueMicrotask(() => this.refreshArchiveState());
  }
  handleRemoveUpload(event) {
    console.log("upload-layout: removeupload", event.detail);
    queueMicrotask(() => this.refreshArchiveState());
  }
  handleUpload(event) {
    this.state.stage = "uploading";
    if (this.uploadArea && typeof this.uploadArea.ensureView === "function") {
      this.uploadArea.ensureView("uploading");
    }
    console.log("upload-layout: starting upload");
    queueMicrotask(() => this.refreshArchiveState());
  }
  handleCancel(event) {
    this.state.stage = "selected";
    this.state.progress = 0;
    console.log("upload-layout: upload cancelled");
    this.refreshArchiveState();
  }
  handleRetry(event) {
    console.log("[UploadLayout] Retry event received from error view");
    if (this.uploadArea && typeof this.uploadArea.clearError === "function") {
      console.log("[UploadLayout] Calling uploadArea.clearError()");
      this.uploadArea.clearError();
    } else {
      console.warn("[UploadLayout] uploadArea.clearError not available", this.uploadArea);
    }
    this.refreshArchiveState();
  }
  handleErrorDismiss(event) {
    console.log("[UploadLayout] Error-dismiss event received from error view");
    if (this.uploadArea && typeof this.uploadArea.clearError === "function") {
      console.log("[UploadLayout] Calling uploadArea.clearError()");
      this.uploadArea.clearError();
    } else {
      console.warn("[UploadLayout] uploadArea.clearError not available", this.uploadArea);
    }
    if (this.app && this.app.state && this.app.state.archive) {
      console.log("[UploadLayout] Clearing archive");
      this.app.state.archive.clear();
    }
    this.refreshArchiveState();
  }
  handleCompleteAcknowledged(event) {
    console.log("upload-layout: complete acknowledged");
    this.state.stage = "empty";
    this.state.uploadedFile = null;
    if (this.uploadArea && typeof this.uploadArea.clearComplete === "function") {
      this.uploadArea.clearComplete();
    }
    this.refreshUploadList();
  }
  /**
   * Public Methods (called by parent <go-send> or controller)
   */
  /**
   * Update upload progress (called during upload)
   */
  updateProgress(ratio, bytesUploaded, totalBytes) {
    this.state.progress = ratio;
    if (this.uploadArea && typeof this.uploadArea.updateProgress === "function") {
      this.uploadArea.updateProgress(ratio, bytesUploaded, totalBytes);
    }
  }
  /**
   * Mark upload as complete and show share UI
   */
  setUploadComplete(ownedFile) {
    this.state.stage = "complete";
    this.state.uploadedFile = ownedFile;
    if (this.uploadArea) {
      if (typeof this.uploadArea.ensureView === "function") {
        this.uploadArea.ensureView("complete");
      }
      if (typeof this.uploadArea.setUploadedFile === "function") {
        this.uploadArea.setUploadedFile(ownedFile);
      }
    }
    this.refreshUploadList();
    console.log("upload-layout: upload complete", ownedFile);
  }
  /**
   * Reset to initial state (for new upload)
   */
  reset() {
    this.state = {
      stage: "empty",
      files: [],
      totalSize: 0,
      progress: 0,
      uploadedFile: null
    };
    if (this.uploadArea) {
      if (typeof this.uploadArea.ensureView === "function") {
        this.uploadArea.ensureView("empty");
      }
    }
    if (this.uploadRight) {
      this.uploadRight.showIntro();
    }
    this.refreshArchiveState();
  }
  refreshArchiveState() {
    if (!this.app) {
      this.app = this.closest("go-send") || this.app;
    }
    if (!this.app || !this.uploadArea || !this.app.state) {
      return;
    }
    if (typeof this.uploadArea.refresh !== "function") {
      if (!this._waitingForUploadAreaUpgrade) {
        this._waitingForUploadAreaUpgrade = true;
        customElements.whenDefined("upload-area").then(() => {
          this.uploadArea = this.querySelector("upload-area");
          this._waitingForUploadAreaUpgrade = false;
          this.refreshArchiveState();
        }).catch(() => {
          this._waitingForUploadAreaUpgrade = false;
        });
      }
      return;
    }
    this.uploadArea.refresh();
  }
  refreshUploadList() {
    if (!this.app) {
      this.app = this.closest("go-send") || this.app;
    }
    if (!this.app || !this.uploadRight || !this.app.state) {
      return;
    }
    if (typeof this.uploadRight.showUploadList !== "function") {
      if (!this._waitingForUploadRightUpgrade) {
        this._waitingForUploadRightUpgrade = true;
        customElements.whenDefined("upload-right").then(() => {
          this.uploadRight = this.querySelector("upload-right");
          this._waitingForUploadRightUpgrade = false;
          this.refreshUploadList();
        }).catch(() => {
          this._waitingForUploadRightUpgrade = false;
        });
      }
      return;
    }
    const files = this.app.state.storage ? this.app.state.storage.files : [];
    const activeFiles = files.filter((f) => !f.expired);
    if (activeFiles.length > 0) {
      if (this.uploadRight.currentTemplate !== "list") {
        this.uploadRight.showUploadList(activeFiles);
      } else {
        this.uploadRight.refreshList(activeFiles);
      }
    } else {
      if (this.uploadRight.currentTemplate !== "intro") {
        this.uploadRight.showIntro();
      }
    }
  }
};
customElements.define("upload-layout", UploadLayoutElement);
//# sourceMappingURL=upload-layout-G5VIPOIV.js.map
