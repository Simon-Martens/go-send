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
      retry: this.handleRetry.bind(this),
      errorDismiss: this.handleErrorDismiss.bind(this),
      editFile: this.handleEditFile.bind(this),
      saveEdit: this.handleSaveEdit.bind(this),
      cancelEdit: this.handleCancelEdit.bind(this),
    };

    // Track edit view
    this.editView = null;
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
        this.addEventListener("edit-file", this._boundHandlers.editFile);
        this.addEventListener("save", this._boundHandlers.saveEdit);
        this.addEventListener("cancel", this._boundHandlers.cancelEdit);
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
      this.removeEventListener("edit-file", this._boundHandlers.editFile);
      this.removeEventListener("save", this._boundHandlers.saveEdit);
      this.removeEventListener("cancel", this._boundHandlers.cancelEdit);
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

  handleRetry(event) {
    console.log("[UploadLayout] Retry event received from error view");

    // Clear error and go back to list view
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

    // Clear error and clear the archive (go to empty state)
    if (this.uploadArea && typeof this.uploadArea.clearError === "function") {
      console.log("[UploadLayout] Calling uploadArea.clearError()");
      this.uploadArea.clearError();
    } else {
      console.warn("[UploadLayout] uploadArea.clearError not available", this.uploadArea);
    }

    // Clear the archive to reset to empty state
    if (this.app && this.app.state && this.app.state.archive) {
      console.log("[UploadLayout] Clearing archive");
      this.app.state.archive.clear();
    }

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

  handleEditFile(event) {
    const { ownedFile } = event.detail;
    console.log("upload-layout: edit file", ownedFile);

    this.showFileEditView(ownedFile);
  }

  handleSaveEdit(event) {
    const { ownedFile } = event.detail;
    console.log("upload-layout: save edit", ownedFile);

    // Hide edit view
    this.hideFileEditView();

    // Refresh upload list to show updated values
    this.refreshUploadList();
  }

  handleCancelEdit(event) {
    console.log("upload-layout: cancel edit");

    // Hide edit view
    this.hideFileEditView();
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

  /**
   * Show file edit view
   */
  showFileEditView(ownedFile) {
    console.log("[UploadLayout] showFileEditView called with:", ownedFile);

    // Hide upload-area using inline style (more reliable than hidden class)
    if (this.uploadArea) {
      this.uploadArea.style.display = "none";
      console.log("[UploadLayout] upload-area hidden with inline style");
    }

    // Create or get edit view
    if (!this.editView) {
      console.log("[UploadLayout] Creating new file-edit-view element");
      this.editView = document.createElement("file-edit-view");

      // Try multiple selector strategies
      const leftColumn = this.querySelector("div:first-child");
      console.log("[UploadLayout] Found left column:", leftColumn);
      console.log("[UploadLayout] Left column classes:", leftColumn?.className);

      if (leftColumn) {
        leftColumn.appendChild(this.editView);
        console.log("[UploadLayout] file-edit-view appended to left column");
      } else {
        console.error("[UploadLayout] Could not find left column to mount edit view");
        return;
      }
    }

    // Show edit view using inline style
    this.editView.style.display = "block";
    console.log("[UploadLayout] Calling setFile on edit view");

    // Wait for the component to be defined
    if (typeof this.editView.setFile === "function") {
      this.editView.setFile(ownedFile);
      console.log("[UploadLayout] setFile called successfully");
    } else {
      console.error("[UploadLayout] file-edit-view.setFile is not a function", this.editView);
      customElements.whenDefined("file-edit-view").then(() => {
        console.log("[UploadLayout] file-edit-view now defined, calling setFile");
        this.editView.setFile(ownedFile);
      });
    }
  }

  /**
   * Hide file edit view
   */
  hideFileEditView() {
    if (this.editView) {
      this.editView.style.display = "none";
    }

    // Show upload-area again
    if (this.uploadArea) {
      this.uploadArea.style.display = "";
    }
  }
}

// Register the custom element
customElements.define("upload-layout", UploadLayoutElement);
