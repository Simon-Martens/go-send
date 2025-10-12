import { translateElement } from "../utils.mjs";

/**
 * <go-send> - Root custom element
 *
 * Responsibilities:
 * - Hold global application state
 * - Create and manage layout views (upload, download, error)
 * - Store references to child components for direct access
 * - Listen to custom events from children
 */
class GoSendElement extends HTMLElement {
  constructor() {
    super();
    this.state = null;
    this.controller = null;
    this.currentView = null;

    // Child component references (for fine-grained updates)
    this.uploadArea = null;
    this.uploadRight = null;
  }

  connectedCallback() {
    // 1. Clone and insert template
    const template = document.getElementById("go-send");
    if (!template) {
      console.error("Template #go-send not found");
      return;
    }

    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // 2. Initialize state from window.initialState
    this.state = window.initialState;
    if (!this.state) {
      console.error("window.initialState not found. Ensure main.mjs loaded first.");
      return;
    }

    // 3. Translate content
    translateElement(this);

    // 4. Show initial view (upload layout)
    this.showUploadLayout();

    // 5. Set up event listeners for child events
    this.addEventListener("addfiles", this.handleAddFiles.bind(this));
    this.addEventListener("removeupload", this.handleRemoveUpload.bind(this));
    this.addEventListener("upload", this.handleUpload.bind(this));
    this.addEventListener("cancel", this.handleCancel.bind(this));
    this.addEventListener("delete", this.handleDelete.bind(this));
    this.addEventListener("copy", this.handleCopy.bind(this));
    this.addEventListener("share", this.handleShare.bind(this));

    // 6. TODO: Create controller (for later when we wire up business logic)
    // this.controller = createController(this, this.state);
  }

  /**
   * Show the upload layout (default view)
   * Clones the upload-layout template and inserts upload-area and upload-right
   */
  showUploadLayout() {
    const template = document.getElementById("upload-layout");
    if (!template) {
      console.error("Template #upload-layout not found");
      return;
    }

    // Find the slot where content goes
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    // Clone and insert the upload layout
    const content = template.content.cloneNode(true);
    slot.innerHTML = "";
    slot.appendChild(content);

    // Cache references to child components
    this.uploadArea = this.querySelector("upload-area");
    this.uploadRight = this.querySelector("upload-right");

    this.currentView = "upload";
  }

  /**
   * Show the download layout (future)
   */
  showDownloadLayout() {
    // TODO: Implement when needed
    console.log("showDownloadLayout not yet implemented");
  }

  /**
   * Show an error page (future)
   */
  showErrorPage() {
    // TODO: Implement when needed
    console.log("showErrorPage not yet implemented");
  }

  // Event Handlers
  // These forward events to the controller (when implemented)

  handleAddFiles(event) {
    console.log("addfiles event received", event.detail);
    // TODO: Forward to controller
    // For now, just log
  }

  handleRemoveUpload(event) {
    console.log("removeupload event received", event.detail);
    // TODO: Forward to controller
  }

  handleUpload(event) {
    console.log("upload event received", event.detail);
    // TODO: Forward to controller
  }

  handleCancel(event) {
    console.log("cancel event received", event.detail);
    // TODO: Forward to controller
  }

  handleDelete(event) {
    console.log("delete event received", event.detail);
    // TODO: Forward to controller
  }

  handleCopy(event) {
    console.log("copy event received", event.detail);
    // TODO: Forward to controller
  }

  handleShare(event) {
    console.log("share event received", event.detail);
    // TODO: Forward to controller
  }
}

// Register the custom element
customElements.define("go-send", GoSendElement);
