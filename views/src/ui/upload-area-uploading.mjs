import { translateElement } from "../utils.mjs";
import { bytes } from "../utils.mjs";

class UploadUploadingView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._progressBar = null;
    this._progressPercent = null;
    this._boundHandleCancel = this.handleCancel.bind(this);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this._boundHandleCancel);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._boundHandleCancel);
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

    // Cache references to progress elements
    this._progressBar = this.querySelector('[data-role="progress-bar"]');
    this._progressPercent = this.querySelector('[data-role="progress-percent"]');

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
    });
  }

  handleCancel(event) {
    const target = event.target.closest('[data-action="cancel"]');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    // Dispatch cancel event that bubbles up
    this.dispatchEvent(new CustomEvent("cancel", {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Update upload progress
   * @param {number} ratio - Progress ratio from 0.0 to 1.0
   * @param {number} bytesUploaded - Bytes uploaded so far
   * @param {number} totalBytes - Total bytes to upload
   */
  updateProgress(ratio, bytesUploaded, totalBytes) {
    if (this._progressBar) {
      this._progressBar.value = ratio;
    }

    if (this._progressPercent) {
      const percent = Math.round(ratio * 100);
      this._progressPercent.textContent = `${percent}%`;
    }
  }

  /**
   * Set file information
   * @param {string} name - File name
   * @param {number} size - File size in bytes
   */
  setFileInfo(name, size) {
    const nameEl = this.querySelector('[data-role="file-name"]');
    const sizeEl = this.querySelector('[data-role="file-size"]');

    if (nameEl) {
      nameEl.textContent = name;
    }
    if (sizeEl) {
      sizeEl.textContent = bytes(size);
    }
  }

  /**
   * Set expiry information
   * @param {string} expiryText - Formatted expiry text
   */
  setExpiryInfo(expiryText) {
    const expiryEl = this.querySelector('[data-role="expiry-info"]');
    if (expiryEl) {
      expiryEl.textContent = expiryText;
    }
  }
}

customElements.define("upload-uploading-view", UploadUploadingView);
