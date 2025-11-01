import {
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/request-invitation-layout.mjs
var RequestInvitationLayoutElement = class extends HTMLElement {
  constructor() {
    super();
    this.form = null;
    this.emailInput = null;
    this.messageElement = null;
    this.submitButton = null;
    this._frame = null;
    this._templateMounted = false;
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this)
    };
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("request-invitation-layout");
      if (!template) {
        console.error("Template #request-invitation-layout not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
    }
    this._frame = requestAnimationFrame(() => {
      this._frame = null;
      if (!this.isConnected) {
        return;
      }
      translateElement(this);
      this.form = this.querySelector('[data-role="request-form"]');
      this.emailInput = this.querySelector('[data-role="email-input"]');
      this.messageElement = this.querySelector('[data-role="message"]');
      this.submitButton = this.querySelector('[data-role="submit"]');
      if (this.form) {
        this.form.addEventListener("submit", this._boundHandlers.submit);
      }
    });
  }
  disconnectedCallback() {
    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
      this._frame = null;
    }
    if (this.form) {
      this.form.removeEventListener("submit", this._boundHandlers.submit);
    }
  }
  async handleSubmit(event) {
    var _a;
    event.preventDefault();
    this.hideMessage();
    const email = (_a = this.emailInput) == null ? void 0 : _a.value.trim();
    if (!email || !this.isValidEmail(email)) {
      const translate2 = window.translate || ((key) => key);
      this.showMessage(
        translate2("authErrorInvalidEmail") || "Please enter a valid email address",
        true
      );
      return;
    }
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.setSubmitLabel("requestInvitationSubmitting");
    }
    const maxRetries = 3;
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch("/api/request-invitation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        const translate2 = window.translate || ((key) => key);
        this.showMessage(
          translate2("requestInvitationSuccess") || "If your email domain is authorized, you will receive an invitation shortly.",
          false
        );
        if (this.emailInput) {
          this.emailInput.parentElement.style.display = "none";
        }
        if (this.submitButton) {
          this.submitButton.style.display = "none";
        }
        return;
      } catch (error) {
        lastError = error;
        console.error(`[RequestInvitationLayout] Attempt ${attempt}/${maxRetries} failed`, error);
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt - 1) * 1e3;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    const translate = window.translate || ((key) => key);
    this.showMessage(
      translate("requestInvitationError") || "Failed to submit request. Please try again later.",
      true
    );
    if (this.submitButton) {
      this.submitButton.disabled = false;
      this.setSubmitLabel("requestInvitationSubmitButton");
    }
  }
  showMessage(message, isError) {
    if (this.messageElement) {
      this.messageElement.textContent = message;
      this.messageElement.classList.remove("hidden");
      if (isError) {
        this.messageElement.classList.remove("text-green-600", "dark:text-green-400");
        this.messageElement.classList.add("text-red-600", "dark:text-red-400");
      } else {
        this.messageElement.classList.remove("text-red-600", "dark:text-red-400");
        this.messageElement.classList.add("text-green-600", "dark:text-green-400");
      }
    }
  }
  hideMessage() {
    if (this.messageElement) {
      this.messageElement.textContent = "";
      this.messageElement.classList.add("hidden");
      this.messageElement.classList.remove(
        "text-red-600",
        "dark:text-red-400",
        "text-green-600",
        "dark:text-green-400"
      );
    }
  }
  setSubmitLabel(key) {
    if (!this.submitButton) {
      return;
    }
    const translate = window.translate || ((key2) => key2);
    const label = this.submitButton.querySelector('[data-type="lang"]');
    const text = translate(key);
    if (label) {
      label.textContent = text;
    } else {
      this.submitButton.textContent = text;
    }
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};
customElements.define("request-invitation-layout", RequestInvitationLayoutElement);
//# sourceMappingURL=request-invitation-layout-TPEDIED2.js.map
