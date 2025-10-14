import { translateElement } from "../utils.mjs";
import { bytes } from "../utils.mjs";

/**
 * <file-downloading-view> - Shows download progress
 *
 * Displays:
 * - File name and size
 * - Progress bar with animated stripes
 * - Progress percentage
 */
class FileDownloadingElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
    this._progressBar = null;
    this._progressPercent = null;
  }

  connectedCallback() {
    // Mount template first (synchronous)
    if (!this._templateMounted) {
      const template = document.getElementById("file-downloading-view");
      if (!template) {
        console.error("Template #file-downloading-view not found");
        return;
      }

      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;

      // Cache references to progress elements
      this._progressBar = this.querySelector('[data-role="progress-bar"]');
      this._progressPercent = this.querySelector('[data-role="progress-percent"]');
    }

    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
    }

    // Schedule async initialization
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);
    });
  }

  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
  }

  /**
   * Update download progress
   * @param {number} ratio - Progress ratio from 0.0 to 1.0
   * @param {number} bytesDownloaded - Bytes downloaded so far
   * @param {number} totalBytes - Total bytes to download
   */
  updateProgress(ratio, bytesDownloaded, totalBytes) {
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
}

// Register the custom element
customElements.define("file-downloading-view", FileDownloadingElement);
