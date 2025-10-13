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

      if (!this._handlersBound) {
        this.addEventListener("addfiles", this._boundHandlers.addfiles);
        this.addEventListener("removeupload", this._boundHandlers.removeupload);
        this.addEventListener("upload", this._boundHandlers.upload);
        this.addEventListener("cancel", this._boundHandlers.cancel);
        this._handlersBound = true;
      }
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
      this._handlersBound = false;
    }
  }

  /**
   * Event Handlers
   * These handle events from child components and manage state transitions
   */

  handleAddFiles(event) {
    const { files } = event.detail;

    // Update state
    this.state.stage = 'selected';
    this.state.files = files;
    this.state.totalSize = files.reduce((sum, f) => sum + f.size, 0);

    // Update UI: upload-area shows file list
    if (this.uploadArea) {
      this.uploadArea.switchToList();
      files.forEach(file => this.uploadArea.addFileToList(file));
      this.uploadArea.updateTotalSize(this.state.totalSize);
    }

    // Log for now (will forward to controller later)
    console.log("upload-layout: addfiles", { files, totalSize: this.state.totalSize });

    // Bubble event to parent <go-send> for controller
    this.dispatchEvent(new CustomEvent("addfiles", {
      bubbles: true,
      composed: true,
      detail: event.detail,
    }));
  }

  handleRemoveUpload(event) {
    const { fileId } = event.detail;

    // Update state
    this.state.files = this.state.files.filter((f, i) => i !== fileId);
    this.state.totalSize = this.state.files.reduce((sum, f) => sum + f.size, 0);

    // If no files left, go back to empty state
    if (this.state.files.length === 0) {
      this.state.stage = 'empty';
      if (this.uploadArea) {
        this.uploadArea.switchToDefault();
      }
    } else {
      // Update UI
      if (this.uploadArea) {
        this.uploadArea.removeFileFromList(fileId);
        this.uploadArea.updateTotalSize(this.state.totalSize);
      }
    }

    // Bubble event to parent
    this.dispatchEvent(new CustomEvent("removeupload", {
      bubbles: true,
      composed: true,
      detail: event.detail,
    }));
  }

  handleUpload(event) {
    // Start upload process
    this.state.stage = 'uploading';

    // Update UI: upload-area shows progress
    if (this.uploadArea) {
      this.uploadArea.switchToUploading();
    }

    console.log("upload-layout: starting upload");

    // Bubble event to parent <go-send> for controller
    this.dispatchEvent(new CustomEvent("upload", {
      bubbles: true,
      composed: true,
      detail: event.detail,
    }));
  }

  handleCancel(event) {
    // Cancel upload and return to file list
    this.state.stage = 'selected';
    this.state.progress = 0;

    // Update UI
    if (this.uploadArea) {
      this.uploadArea.switchToList();
    }

    console.log("upload-layout: upload cancelled");

    // Bubble event to parent
    this.dispatchEvent(new CustomEvent("cancel", {
      bubbles: true,
      composed: true,
      detail: event.detail,
    }));
  }

  /**
   * Public Methods (called by parent <go-send> or controller)
   */

  /**
   * Update upload progress (called during upload)
   */
  updateProgress(ratio, bytesUploaded, totalBytes) {
    this.state.progress = ratio;

    if (this.uploadArea) {
      this.uploadArea.updateProgress(ratio);
      this.uploadArea.updateProgressText(`${bytesUploaded} / ${totalBytes}`);
    }
  }

  /**
   * Mark upload as complete and show share UI
   */
  setUploadComplete(ownedFile) {
    this.state.stage = 'complete';
    this.state.uploadedFile = ownedFile;

    // Update UI: upload-area shows share link
    if (this.uploadArea) {
      this.uploadArea.switchToComplete();
    }

    // Update UI: upload-right may show upload list
    // (For now, keep showing intro or implement list later)

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
      this.uploadArea.switchToDefault();
    }

    if (this.uploadRight) {
      this.uploadRight.showIntro();
    }
  }
}

// Register the custom element
customElements.define("upload-layout", UploadLayoutElement);
