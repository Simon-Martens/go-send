import { translateElement } from "../utils.mjs";

/**
 * <upload-layout> - Complete upload flow container
 *
 * Responsibilities:
 * - Encapsulates entire upload state and UI
 * - Manages upload-area and upload-right child components
 * - Handles upload lifecycle (selection → list → uploading → complete)
 * - Forwards events to parent <go-send> element
 *
 * This layout owns the upload state and coordinates between its children.
 */
class UploadLayoutElement extends HTMLElement {
  constructor() {
    super();

    // Child component references (owned by this layout)
    this.uploadArea = null;
    this.uploadRight = null;
    this.app = null;
    this._waitingForUploadAreaUpgrade = false;
    this._waitingForUploadRightUpgrade = false;

    // Upload state
    this.state = {
      stage: 'empty',  // 'empty', 'selected', 'uploading', 'complete'
      files: [],
      totalSize: 0,
      progress: 0,
      uploadedFile: null,  // After successful upload
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
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });

    queueMicrotask(() => this.refreshArchiveState());
  }

  handleRemoveUpload(event) {
    console.log("upload-layout: removeupload", event.detail);

    queueMicrotask(() => this.refreshArchiveState());
  }

  handleUpload(event) {
    // Start upload process
    this.state.stage = 'uploading';

    // Update UI: force uploading view immediately
    if (this.uploadArea && typeof this.uploadArea.ensureView === "function") {
      this.uploadArea.ensureView('uploading');
    }

    console.log("upload-layout: starting upload");

    // Original event will bubble to the controller
    queueMicrotask(() => this.refreshArchiveState());
  }

  handleCancel(event) {
    // Cancel upload and return to file list
    this.state.stage = 'selected';
    this.state.progress = 0;

    console.log("upload-layout: upload cancelled");

    // Original event will bubble to the controller
    this.refreshArchiveState();
  }

  handleCompleteAcknowledged(event) {
    console.log("upload-layout: complete acknowledged");

    // Reset to initial state
    this.state.stage = 'empty';
    this.state.uploadedFile = null;

    // Clear the complete state from upload-area
    if (this.uploadArea && typeof this.uploadArea.clearComplete === "function") {
      this.uploadArea.clearComplete();
    }

    // Keep showing upload list if files exist
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
    this.state.stage = 'complete';
    this.state.uploadedFile = ownedFile;

    // Update UI: upload-area shows complete view with QR code and link
    if (this.uploadArea) {
      if (typeof this.uploadArea.ensureView === "function") {
        this.uploadArea.ensureView('complete');
      }
      if (typeof this.uploadArea.setUploadedFile === "function") {
        this.uploadArea.setUploadedFile(ownedFile);
      }
    }

    // Update UI: upload-right shows list with new file
    this.refreshUploadList();

    console.log("upload-layout: upload complete", ownedFile);
  }

  /**
   * Reset to initial state (for new upload)
   */
  reset() {
    this.state = {
      stage: 'empty',
      files: [],
      totalSize: 0,
      progress: 0,
      uploadedFile: null,
    };

    if (this.uploadArea) {
      if (typeof this.uploadArea.ensureView === "function") {
        this.uploadArea.ensureView('empty');
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
        customElements
          .whenDefined("upload-area")
          .then(() => {
            this.uploadArea = this.querySelector("upload-area");
            this._waitingForUploadAreaUpgrade = false;
            this.refreshArchiveState();
          })
          .catch(() => {
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

    // Check if upload-right is fully upgraded
    if (typeof this.uploadRight.showUploadList !== "function") {
      if (!this._waitingForUploadRightUpgrade) {
        this._waitingForUploadRightUpgrade = true;
        customElements
          .whenDefined("upload-right")
          .then(() => {
            this.uploadRight = this.querySelector("upload-right");
            this._waitingForUploadRightUpgrade = false;
            this.refreshUploadList();
          })
          .catch(() => {
            this._waitingForUploadRightUpgrade = false;
          });
      }
      return;
    }

    // Get files from storage
    const files = this.app.state.storage ? this.app.state.storage.files : [];
    const activeFiles = files.filter(f => !f.expired);

    // Show list if we have files, otherwise show intro
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
}

// Register the custom element
customElements.define("upload-layout", UploadLayoutElement);
