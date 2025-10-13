import { translateElement } from "../utils.mjs";
import { Controller } from "../controller.mjs";

/**
 * <go-send> - Root element
 * - Holds global application state
 * - Manages high-level layout switching (upload, download, error, etc.)
 * - Maintains reference to current layout only
 * - Controller handles all business logic and events
 */
class GoSendElement extends HTMLElement {
  constructor() {
    super();
    this.state = null;
    this.currentView = null;

    // Current layout reference (only one layout active at a time)
    this.currentLayout = null;

    // Controller handles business logic (instantiated after state is set)
    this.controller = null;

    // Track scheduled initialization and template state
    this._initFrame = null;
    this._templateMounted = false;
  }

  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("go-send");
      if (!template) {
        console.error("Template #go-send not found");
        return;
      }

      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }

    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
    }

    this._initFrame = requestAnimationFrame(() => {
      this._initFrame = null;
      if (!this.isConnected) {
        return;
      }

      if (!this.state) {
        this.state = window.initialState;
        if (!this.state) {
          console.error(
            "window.initialState not found. Ensure main.mjs loaded first.",
          );
          return;
        }
      }

      translateElement(this);

      if (!this.currentLayout) {
        this.showUploadLayout();
      }

      if (!this.controller) {
        this.controller = new Controller(this);
        this.controller.hookupHandlers();
      }
    });
  }

  disconnectedCallback() {
    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
      this._initFrame = null;
    }
    if (this.controller) {
      this.controller.destroyHandlers();
      this.controller = null;
    }
  }

  showUploadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const uploadLayout = document.createElement("upload-layout");
    slot.appendChild(uploadLayout);

    this.currentLayout = uploadLayout;
    this.currentView = "upload";
  }

  showDownloadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const downloadLayout = document.createElement("download-layout");
    slot.appendChild(downloadLayout);

    this.currentLayout = downloadLayout;
    this.currentView = "download";
  }

  showErrorLayout(errorMessage) {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const errorLayout = document.createElement("error-layout");
    if (errorMessage) {
      errorLayout.setAttribute("message", errorMessage);
    }
    slot.appendChild(errorLayout);

    this.currentLayout = errorLayout;
    this.currentView = "error";
  }
}

// Register the custom element
customElements.define("go-send", GoSendElement);
