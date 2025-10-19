import {
  translateElement
} from "./chunk-6DFT5NXM.js";
import "./chunk-IFG75HHC.js";

// src/ui/file-error.mjs
var FileErrorElement = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._postMountFrame = null;
    this.errorMessage = null;
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("file-error-view");
      if (!template) {
        console.error("Template #file-error-view not found");
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
      this.setupHandlers();
      if (this.errorMessage) {
        this.render();
      }
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
  }
  setupHandlers() {
    const homeBtn = this.querySelector('[data-action="home"]');
    if (homeBtn) {
      homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.assign("/");
      });
    }
  }
  /**
   * Public API: Set error message (optional, uses default if not provided)
   */
  setError(message) {
    this.errorMessage = message;
    this.render();
  }
  render() {
    if (!this.errorMessage) {
      return;
    }
    const descEl = this.querySelector('[data-role="custom-description"]');
    if (descEl) {
      descEl.textContent = this.errorMessage;
      descEl.classList.remove("hidden");
      const defaultDesc = this.querySelector('[data-role="default-description"]');
      if (defaultDesc) {
        defaultDesc.classList.add("hidden");
      }
    }
  }
};
customElements.define("file-error-view", FileErrorElement);
//# sourceMappingURL=file-error-KJPHPVVB.js.map
