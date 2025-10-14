import { translateElement } from "../utils.mjs";

/**
 * <file-downloading-view> - Shows download progress (STUB)
 *
 * Responsibilities (to be implemented later):
 * - Display spinner/progress bar
 * - Show "X of Y MB" progress text
 * - Provide cancel button
 * - Update progress via setProgress() method
 */
class FileDownloadingElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
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
   * Public API: Set download progress (to be implemented)
   */
  setProgress(ratio, bytesDownloaded, totalBytes) {
    // TODO: Update progress bar and text
    console.log(`[file-downloading] Progress: ${ratio * 100}% (${bytesDownloaded}/${totalBytes})`);

    const progressText = this.querySelector('[data-role="progress-text"]');
    if (progressText) {
      progressText.textContent = `${Math.round(ratio * 100)}%`;
    }
  }
}

// Register the custom element
customElements.define("file-downloading-view", FileDownloadingElement);
