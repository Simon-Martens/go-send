import { translateElement } from "../utils.mjs";

/**
 * <upload-area> - Left column upload component
 *
 * Responsibilities:
 * - Display different templates based on state (default, list, uploading, complete)
 * - Handle file input interaction
 * - Emit events: addfiles, removeupload, upload, cancel
 *
 * Fine-grained rendering:
 * - switchToX() methods replace entire template
 * - addFileToList(), updateProgress(), etc. update specific elements without template switch
 */
class UploadAreaElement extends HTMLElement {
  constructor() {
    super();
    this.currentTemplate = null; // 'default', 'list', 'uploading', 'complete'

    // Cached element references (populated by switchToX methods)
    this.elements = {
      fileInput: null,
      fileList: null,
      uploadButton: null,
      progressBar: null,
      progressText: null,
      cancelButton: null,
      copyButton: null,
      shareButton: null,
    };

    this._afterPaintFrame = null;
    this._boundFileSelect = this.handleFileSelect.bind(this);
  }

  connectedCallback() {
    // Show default template (empty upload area)
    this.switchToDefault();
  }

  disconnectedCallback() {
    if (this._afterPaintFrame !== null) {
      cancelAnimationFrame(this._afterPaintFrame);
      this._afterPaintFrame = null;
    }
  }

  _renderTemplate(templateId, onReady) {
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template #${templateId} not found`);
      return;
    }

    const content = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(content);

    if (this._afterPaintFrame !== null) {
      cancelAnimationFrame(this._afterPaintFrame);
    }

    this._afterPaintFrame = requestAnimationFrame(() => {
      this._afterPaintFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);

      if (typeof onReady === "function") {
        onReady();
      }
    });
  }

  /**
   * Template Switching Methods
   * These replace the entire innerHTML with a new template
   */

  /**
   * Switch to default state (empty upload area with file selection)
   * Uses template: #upload-area-default
   */
  switchToDefault() {
    this._renderTemplate("upload-area-default", () => {
      this.elements.fileInput = this.querySelector("#file-upload");

      if (this.elements.fileInput) {
        this.elements.fileInput.addEventListener(
          "change",
          this._boundFileSelect,
        );
      }

      this.currentTemplate = "default";
    });
  }

  /**
   * Switch to list state (shows selected files before upload)
   * Uses template: #upload-area-list
   */
  switchToList() {
    const template = document.getElementById("upload-area-list");
    if (!template) {
      console.error("Template #upload-area-list not found");
      return;
    }

    // TODO: Implement when template is ready
    console.log("switchToList not yet implemented - template pending");
    this.currentTemplate = "list";
  }

  /**
   * Switch to uploading state (shows progress bar)
   * Uses template: #upload-area-uploading
   */
  switchToUploading() {
    const templateId = "upload-area-uploading";
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template #${templateId} not found`);
      return;
    }

    // TODO: Implement when template is ready
    console.log("switchToUploading not yet implemented - template pending");
    this.currentTemplate = "uploading";
  }

  /**
   * Switch to complete state (shows share link)
   * Uses template: #upload-area-complete
   */
  switchToComplete() {
    const template = document.getElementById("upload-area-complete");
    if (!template) {
      console.error("Template #upload-area-complete not found");
      return;
    }

    // TODO: Implement when template is ready
    console.log("switchToComplete not yet implemented - template pending");
    this.currentTemplate = "complete";
  }

  /**
   * Fine-Grained Update Methods
   * These update specific elements without switching templates
   */

  /**
   * Add a file to the file list (when in 'list' template)
   */
  addFileToList(file) {
    if (this.currentTemplate !== "list") {
      console.warn("addFileToList called but not in list template");
      return;
    }

    // TODO: Implement when list template is ready
    console.log("addFileToList:", file);
  }

  /**
   * Remove a file from the file list (when in 'list' template)
   */
  removeFileFromList(fileId) {
    if (this.currentTemplate !== "list") {
      console.warn("removeFileFromList called but not in list template");
      return;
    }

    // TODO: Implement when list template is ready
    console.log("removeFileFromList:", fileId);
  }

  /**
   * Update progress bar value (when in 'uploading' template)
   */
  updateProgress(ratio) {
    if (
      this.currentTemplate !== "uploading" ||
      !this.elements.progressBar
    ) {
      return;
    }

    this.elements.progressBar.value = ratio;
  }

  /**
   * Update progress text (when in 'uploading' template)
   */
  updateProgressText(text) {
    if (
      this.currentTemplate !== "uploading" ||
      !this.elements.progressText
    ) {
      return;
    }

    this.elements.progressText.textContent = text;
  }

  /**
   * Update total file size display (when in 'list' template)
   */
  updateTotalSize(bytes) {
    if (this.currentTemplate !== "list") {
      return;
    }

    // TODO: Implement when list template is ready
    console.log("updateTotalSize:", bytes);
  }

  /**
   * Enable/disable upload button (when in 'list' template)
   */
  setUploadButtonEnabled(enabled) {
    if (
      this.currentTemplate !== "list" ||
      !this.elements.uploadButton
    ) {
      return;
    }

    this.elements.uploadButton.disabled = !enabled;
  }

  /**
   * Event Handlers
   */

  /**
   * Handle file input change event
   * Emits 'addfiles' custom event with selected files
   */
  handleFileSelect(event) {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    // Emit custom event (bubbles up to <go-send>)
    this.dispatchEvent(
      new CustomEvent("addfiles", {
        bubbles: true,
        detail: { files },
      })
    );

    // Reset input so the same file can be selected again
    event.target.value = "";
  }
}

// Register the custom element
customElements.define("upload-area", UploadAreaElement);
