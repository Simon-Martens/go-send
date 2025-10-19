import {
  translateElement
} from "./chunk-WCSYBWMD.js";
import "./chunk-IFG75HHC.js";

// src/ui/file-finished.mjs
var FileFinishedElement = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._postMountFrame = null;
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("file-finished-view");
      if (!template) {
        console.error("Template #file-finished-view not found");
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
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
  }
  setupHandlers() {
  }
};
customElements.define("file-finished-view", FileFinishedElement);
//# sourceMappingURL=file-finished-SG6MDJKB.js.map
