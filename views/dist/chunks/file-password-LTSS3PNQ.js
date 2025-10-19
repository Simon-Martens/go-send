import {
  translateElement
} from "./chunk-6LPP53TP.js";
import "./chunk-IFG75HHC.js";

// src/ui/file-password.mjs
var FilePasswordElement = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._postMountFrame = null;
    this._hasError = false;
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      input: this.handleInput.bind(this),
      toggleVisibility: this.togglePasswordVisibility.bind(this)
    };
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("file-password-view");
      if (!template) {
        console.error("Template #file-password-view not found");
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
      const input = this.querySelector('[data-role="password-input"]');
      if (input) {
        input.focus();
      }
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
    this.teardownHandlers();
  }
  setupHandlers() {
    const form = this.querySelector('[data-role="password-form"]');
    const input = this.querySelector('[data-role="password-input"]');
    const toggleBtn = this.querySelector('[data-role="toggle-visibility"]');
    if (form) {
      form.addEventListener("submit", this._boundHandlers.submit);
    }
    if (input) {
      input.addEventListener("input", this._boundHandlers.input);
    }
    if (toggleBtn) {
      toggleBtn.addEventListener("click", this._boundHandlers.toggleVisibility);
    }
  }
  teardownHandlers() {
    const form = this.querySelector('[data-role="password-form"]');
    const input = this.querySelector('[data-role="password-input"]');
    const toggleBtn = this.querySelector('[data-role="toggle-visibility"]');
    if (form) {
      form.removeEventListener("submit", this._boundHandlers.submit);
    }
    if (input) {
      input.removeEventListener("input", this._boundHandlers.input);
    }
    if (toggleBtn) {
      toggleBtn.removeEventListener("click", this._boundHandlers.toggleVisibility);
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const input = this.querySelector('[data-role="password-input"]');
    const password = input ? input.value : "";
    if (password.length === 0) {
      return;
    }
    const submitBtn = this.querySelector('[data-role="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    this.clearError();
    const event2 = new CustomEvent("password-submit", {
      detail: { password },
      bubbles: true
    });
    this.dispatchEvent(event2);
    console.log("[file-password] Password submitted");
  }
  handleInput(event) {
    if (this._hasError) {
      this.clearError();
    }
  }
  togglePasswordVisibility(event) {
    event.preventDefault();
    const input = this.querySelector('[data-role="password-input"]');
    const icon = this.querySelector('[data-role="visibility-icon"]');
    if (!input || !icon) {
      return;
    }
    if (input.type === "password") {
      input.type = "text";
      icon.src = "/eye-off.svg";
    } else {
      input.type = "password";
      icon.src = "/eye.svg";
    }
    input.focus();
  }
  /**
   * Public API: Set error message (called by parent when password is wrong)
   */
  setError(message) {
    this._hasError = true;
    const input = this.querySelector('[data-role="password-input"]');
    const submitBtn = this.querySelector('[data-role="submit"]');
    const errorLabel = this.querySelector('[data-role="error"]');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
    if (input) {
      input.classList.add("border-red-600", "dark:border-red-400");
    }
    if (errorLabel) {
      errorLabel.textContent = message || "Incorrect password. Please try again.";
      errorLabel.classList.remove("hidden");
    }
    if (submitBtn) {
      submitBtn.classList.add(
        "bg-red-600",
        "hover:bg-red-700",
        "dark:bg-red-400",
        "dark:hover:bg-red-500"
      );
    }
    if (input) {
      input.select();
    }
  }
  /**
   * Public API: Clear error state
   */
  clearError() {
    this._hasError = false;
    const input = this.querySelector('[data-role="password-input"]');
    const submitBtn = this.querySelector('[data-role="submit"]');
    const errorLabel = this.querySelector('[data-role="error"]');
    if (input) {
      input.classList.remove("border-red-600", "dark:border-red-400");
    }
    if (errorLabel) {
      errorLabel.classList.add("hidden");
    }
    if (submitBtn) {
      submitBtn.classList.remove(
        "bg-red-600",
        "hover:bg-red-700",
        "dark:bg-red-400",
        "dark:hover:bg-red-500"
      );
    }
  }
};
customElements.define("file-password-view", FilePasswordElement);
//# sourceMappingURL=file-password-LTSS3PNQ.js.map
