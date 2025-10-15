import { translateElement } from "../utils.mjs";

class UploadErrorView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._errorMessage = null;
    this._boundRetry = this.handleRetry.bind(this);
    this._boundOk = this.handleOk.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    this.unbindEventHandlers();
  }

  render() {
    const template = document.getElementById("upload-view-error");
    if (!template) {
      console.error("Template #upload-view-error not found");
      return;
    }

    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);

    this.bindEventHandlers();

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }

    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);

      // Apply error message if set
      if (this._errorMessage) {
        this.setErrorMessage(this._errorMessage);
      }
    });
  }

  bindEventHandlers() {
    const retryBtn = this.querySelector('[data-action="retry"]');
    const okBtn = this.querySelector('[data-action="ok"]');

    console.log("[UploadErrorView] Binding event handlers", { retryBtn, okBtn });

    if (retryBtn) {
      retryBtn.addEventListener("click", this._boundRetry);
    }
    if (okBtn) {
      okBtn.addEventListener("click", this._boundOk);
    }
  }

  unbindEventHandlers() {
    const retryBtn = this.querySelector('[data-action="retry"]');
    const okBtn = this.querySelector('[data-action="ok"]');

    if (retryBtn) {
      retryBtn.removeEventListener("click", this._boundRetry);
    }
    if (okBtn) {
      okBtn.removeEventListener("click", this._boundOk);
    }
  }

  setErrorMessage(message) {
    this._errorMessage = message;
    const messageEl = this.querySelector('[data-role="error-message"]');
    if (messageEl && message) {
      messageEl.textContent = message;
    }
  }

  handleRetry(event) {
    console.log("[UploadErrorView] Retry button clicked");
    event.preventDefault();

    // Dispatch retry event to bubble up
    this.dispatchEvent(
      new CustomEvent("retry", {
        bubbles: true,
      }),
    );
    console.log("[UploadErrorView] Retry event dispatched");
  }

  handleOk(event) {
    console.log("[UploadErrorView] OK button clicked");
    event.preventDefault();

    // Dispatch dismiss event to bubble up
    this.dispatchEvent(
      new CustomEvent("error-dismiss", {
        bubbles: true,
      }),
    );
    console.log("[UploadErrorView] Error-dismiss event dispatched");
  }
}

customElements.define("upload-error-view", UploadErrorView);
