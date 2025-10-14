import { translateElement } from "../utils.mjs";

/**
 * <file-password-view> - Password entry form for protected files
 *
 * Responsibilities:
 * - Display password input field with show/hide toggle
 * - Handle form submission
 * - Show error message if password is incorrect
 * - Dispatch "password-submit" event with entered password
 */
class FilePasswordElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
    this._hasError = false;

    // Bound handlers
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      input: this.handleInput.bind(this),
      toggleVisibility: this.togglePasswordVisibility.bind(this),
    };
  }

  connectedCallback() {
    // Mount template first (synchronous)
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

    // Schedule async initialization
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);
      this.setupHandlers();

      // Auto-focus password input
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

    // Disable submit button while processing
    const submitBtn = this.querySelector('[data-role="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    // Clear any existing error
    this.clearError();

    // Dispatch password-submit event
    const event2 = new CustomEvent("password-submit", {
      detail: { password },
      bubbles: true,
    });
    this.dispatchEvent(event2);

    console.log("[file-password] Password submitted");
  }

  handleInput(event) {
    // Clear error styling when user types
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

    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
    }

    // Add error styling to input
    if (input) {
      input.classList.add("border-red-600", "dark:border-red-400");
    }

    // Show error message
    if (errorLabel) {
      errorLabel.textContent = message || "Incorrect password. Please try again.";
      errorLabel.classList.remove("hidden");
    }

    // Add error styling to submit button
    if (submitBtn) {
      submitBtn.classList.add(
        "bg-red-600",
        "hover:bg-red-700",
        "dark:bg-red-400",
        "dark:hover:bg-red-500"
      );
    }

    // Focus input for retry
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

    // Remove error styling from input
    if (input) {
      input.classList.remove("border-red-600", "dark:border-red-400");
    }

    // Hide error message
    if (errorLabel) {
      errorLabel.classList.add("hidden");
    }

    // Remove error styling from submit button
    if (submitBtn) {
      submitBtn.classList.remove(
        "bg-red-600",
        "hover:bg-red-700",
        "dark:bg-red-400",
        "dark:hover:bg-red-500"
      );
    }
  }
}

// Register the custom element
customElements.define("file-password-view", FilePasswordElement);
