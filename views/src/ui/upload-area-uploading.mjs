import { translateElement } from "../utils.mjs";

class UploadUploadingView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._statusEl = null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
  }

  render() {
    const template = document.getElementById("upload-view-uploading");
    if (!template) {
      console.error("Template #upload-view-uploading not found");
      return;
    }

    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);

    this._statusEl = this.querySelector("#uploadingStatus");

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
    });
  }

  setStatus(text) {
    if (this._statusEl && typeof text === "string") {
      this._statusEl.textContent = text;
    }
  }

  setProgress({ percent, label } = {}) {
    if (typeof label === "string") {
      this.setStatus(label);
      return;
    }
    if (typeof percent === "number") {
      const rounded = Math.round(percent * 100);
      this.setStatus(`${rounded}%`);
    }
  }
}

customElements.define("upload-uploading-view", UploadUploadingView);
