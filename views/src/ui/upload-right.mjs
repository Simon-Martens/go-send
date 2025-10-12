import { translateElement } from "../utils.mjs";

/**
 * <upload-right> - Right column component
 *
 * Responsibilities:
 * - Display intro text (upload-title template)
 * - OR display list of completed uploads (future)
 * - Emit events: delete, copy, share (from upload list items)
 *
 * Fine-grained rendering:
 * - showIntro() / showUploadList() replace entire template
 * - addUpload(), removeUpload() update specific list items without template switch
 */
class UploadRightElement extends HTMLElement {
  constructor() {
    super();
    this.currentTemplate = null; // 'intro' or 'list'

    // Cached element references
    this.elements = {
      uploadList: null,
    };
  }

  connectedCallback() {
    // Show intro by default
    this.showIntro();
  }

  /**
   * Template Switching Methods
   */

  /**
   * Show intro/welcome text
   * Uses template: #upload-title
   */
  showIntro() {
    const template = document.getElementById("upload-title");
    if (!template) {
      console.error("Template #upload-title not found");
      return;
    }

    // Clone and insert template
    const content = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(content);

    // Translate content
    translateElement(this);

    // Update current template tracker
    this.currentTemplate = "intro";
  }

  /**
   * Show list of completed uploads
   * Uses template: #upload-list (to be created)
   */
  showUploadList() {
    // TODO: Create #upload-list template in _app.gohtml
    const template = document.getElementById("upload-list");
    if (!template) {
      console.error("Template #upload-list not found (not yet created)");
      return;
    }

    // Clone and insert template
    const content = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(content);

    // Translate content
    translateElement(this);

    // Cache element references
    this.elements.uploadList = this.querySelector("#upload-list-container");

    // Update current template tracker
    this.currentTemplate = "list";
  }

  /**
   * Fine-Grained Update Methods
   */

  /**
   * Add a completed upload to the list (when in 'list' template)
   */
  addUpload(ownedFile) {
    if (this.currentTemplate !== "list" || !this.elements.uploadList) {
      console.warn("addUpload called but not in list template");
      return;
    }

    // TODO: Implement when we have upload list item template
    console.log("addUpload:", ownedFile);
  }

  /**
   * Remove an upload from the list (when in 'list' template)
   */
  removeUpload(fileId) {
    if (this.currentTemplate !== "list" || !this.elements.uploadList) {
      console.warn("removeUpload called but not in list template");
      return;
    }

    const uploadElement = this.querySelector(`[data-upload-id="${fileId}"]`);
    if (uploadElement) {
      uploadElement.remove();
    }
  }

  /**
   * Update the expiry countdown for a specific upload (when in 'list' template)
   */
  updateUploadExpiry(fileId, timeLeftText) {
    if (this.currentTemplate !== "list") {
      return;
    }

    const expiryElement = this.querySelector(
      `[data-upload-id="${fileId}"] .expiry-text`
    );
    if (expiryElement) {
      expiryElement.textContent = timeLeftText;
    }
  }

  /**
   * Event Handlers
   * (Will be added when list template is implemented)
   */
}

// Register the custom element
customElements.define("upload-right", UploadRightElement);
