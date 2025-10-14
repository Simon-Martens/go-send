import { translateElement } from "../utils.mjs";

/**
 * <file-finished-view> - Download completion screen (STUB)
 *
 * Responsibilities (to be implemented later):
 * - Display success icon/checkmark
 * - Show "Download complete" message
 * - Provide "Send your own files" button to navigate to upload page
 */
class FileFinishedElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
  }

  connectedCallback() {
    // Mount template first (synchronous)
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

    // Schedule async initialization
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
    // Wire up "Send your own files" button
    const homeBtn = this.querySelector('[data-action="home"]');
    if (homeBtn) {
      homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.assign("/");
      });
    }
  }
}

// Register the custom element
customElements.define("file-finished-view", FileFinishedElement);
