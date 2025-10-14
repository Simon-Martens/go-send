import { translateElement } from "../utils.mjs";

/**
 * <file-error-view> - Error/expired file screen
 *
 * Responsibilities:
 * - Display error icon and message for expired/not found files
 * - Show "Send your own files" button to navigate to upload page
 * - Support custom error messages
 */
class FileErrorElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
    this.errorMessage = null;
  }

  connectedCallback() {
    // Mount template first (synchronous)
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

    // Schedule async initialization
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);
      this.setupHandlers();

      // Apply error message if set before mount
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
    // Wire up "Send your own files" button
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

    // Update custom description if provided
    const descEl = this.querySelector('[data-role="custom-description"]');
    if (descEl) {
      descEl.textContent = this.errorMessage;
      descEl.classList.remove("hidden");

      // Hide default description
      const defaultDesc = this.querySelector('[data-role="default-description"]');
      if (defaultDesc) {
        defaultDesc.classList.add("hidden");
      }
    }
  }
}

// Register the custom element
customElements.define("file-error-view", FileErrorElement);
