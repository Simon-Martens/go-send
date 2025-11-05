import {
  DEFAULT_KDF_SETTINGS,
  deriveKeyPair,
  encodePublicKey,
  encodeSalt,
  generateSalt,
  serializeKDFSettings
} from "./chunk-VEXKMDTC.js";
import {
  storage_default
} from "./chunk-AKVSF6J7.js";
import "./chunk-OOESJOAH.js";
import {
  translate,
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/register-layout.mjs
var RegisterLayoutElement = class extends HTMLElement {
  constructor() {
    super();
    this.form = null;
    this.nameInput = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.passwordConfirmInput = null;
    this.errorElement = null;
    this.submitButton = null;
    this.passwordToggle = null;
    this.passwordConfirmToggle = null;
    this.token = null;
    this.registerType = "admin";
    this._postMountFrame = null;
    this._templateMounted = false;
    this._storageCleared = false;
    this._handlersBound = false;
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      togglePassword: this.togglePasswordVisibility.bind(this),
      togglePasswordConfirm: this.togglePasswordConfirmVisibility.bind(this)
    };
  }
  connectedCallback() {
    if (!this._storageCleared) {
      storage_default.clearAll();
      this._storageCleared = true;
    }
    if (!this._templateMounted) {
      const template = document.getElementById("register-layout");
      if (!template) {
        console.error("Template #register-layout not found");
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
      this.extractToken();
      this.form = this.querySelector('[data-role="register-form"]');
      this.nameInput = this.querySelector('[data-role="name-input"]');
      this.emailInput = this.querySelector('[data-role="email-input"]');
      this.passwordInput = this.querySelector('[data-role="password-input"]');
      this.passwordConfirmInput = this.querySelector('[data-role="password-confirm-input"]');
      this.errorElement = this.querySelector('[data-role="error"]');
      this.submitButton = this.querySelector('[data-role="submit"]');
      this.passwordToggle = this.querySelector('[data-role="toggle-password"]');
      this.passwordConfirmToggle = this.querySelector('[data-role="toggle-password-confirm"]');
      const titleSpan = this.querySelector('[data-role="register-title"] span');
      const descriptionSpan = this.querySelector('[data-role="register-description"] span');
      if (titleSpan && descriptionSpan) {
        if (this.registerType === "admin") {
          titleSpan.id = "registerAdminTitle";
          descriptionSpan.id = "registerAdminDescription";
        } else {
          titleSpan.id = "registerUserTitle";
          descriptionSpan.id = "registerUserDescription";
        }
        translateElement(this);
      }
      this.setPlaceholders();
      if (!this._handlersBound && this.form) {
        this.form.addEventListener("submit", this._boundHandlers.submit);
        if (this.passwordToggle) {
          this.passwordToggle.addEventListener("click", this._boundHandlers.togglePassword);
        }
        if (this.passwordConfirmToggle) {
          this.passwordConfirmToggle.addEventListener("click", this._boundHandlers.togglePasswordConfirm);
        }
        if (this.nameInput) {
          this.nameInput.addEventListener("input", () => this.validateForm());
        }
        if (this.emailInput) {
          this.emailInput.addEventListener("input", () => this.validateForm());
        }
        if (this.passwordInput) {
          this.passwordInput.addEventListener("input", () => this.validateForm());
        }
        if (this.passwordConfirmInput) {
          this.passwordConfirmInput.addEventListener("input", () => this.validateForm());
        }
        this._handlersBound = true;
      }
      this.validateForm();
      console.log("[RegisterLayout] Initialized", {
        token: this.token ? this.token.substring(0, 8) + "..." : null,
        type: this.registerType
      });
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
    if (this._handlersBound && this.form) {
      this.form.removeEventListener("submit", this._boundHandlers.submit);
      if (this.passwordToggle) {
        this.passwordToggle.removeEventListener("click", this._boundHandlers.togglePassword);
      }
      if (this.passwordConfirmToggle) {
        this.passwordConfirmToggle.removeEventListener("click", this._boundHandlers.togglePasswordConfirm);
      }
      this._handlersBound = false;
    }
  }
  /**
   * Extract token from URL path
   * Expected paths: /register/admin/[token] or /register/user/[token]
   */
  extractToken() {
    const path = window.location.pathname;
    const parts = path.split("/").filter((p) => p);
    if (parts[0] === "register" && parts[1] === "admin" && parts[2]) {
      this.token = parts[2];
      this.registerType = "admin";
    } else if (parts[0] === "register" && parts[1] === "user" && parts[2]) {
      this.token = parts[2];
      this.registerType = "user";
    } else {
      console.warn("[RegisterLayout] No token found in URL:", path);
      this.showError("Invalid registration link. Please use the link provided in your email.");
    }
  }
  /**
   * Toggle password field visibility
   */
  togglePasswordVisibility(event) {
    event.preventDefault();
    if (!this.passwordInput) return;
    if (this.passwordInput.type === "password") {
      this.passwordInput.type = "text";
    } else {
      this.passwordInput.type = "password";
    }
  }
  /**
   * Toggle password confirmation field visibility
   */
  togglePasswordConfirmVisibility(event) {
    event.preventDefault();
    if (!this.passwordConfirmInput) return;
    if (this.passwordConfirmInput.type === "password") {
      this.passwordConfirmInput.type = "text";
    } else {
      this.passwordConfirmInput.type = "password";
    }
  }
  /**
   * Handle form submission
   * Derives crypto keys from password and registers user with server
   */
  async handleSubmit(event) {
    var _a, _b, _c, _d;
    event.preventDefault();
    this.hideError();
    const name = (_a = this.nameInput) == null ? void 0 : _a.value.trim();
    const email = (_b = this.emailInput) == null ? void 0 : _b.value.trim();
    const password = (_c = this.passwordInput) == null ? void 0 : _c.value;
    const passwordConfirm = (_d = this.passwordConfirmInput) == null ? void 0 : _d.value;
    if (!name) {
      this.showError(translate("registerErrorNameRequired"));
      return;
    }
    if (!this.isValidEmail(email)) {
      this.showError(translate("authErrorInvalidEmail"));
      return;
    }
    if (password.length < 10) {
      this.showError(translate("authErrorPasswordLength"));
      return;
    }
    if (password !== passwordConfirm) {
      this.showError(translate("registerErrorPasswordsMismatch"));
      return;
    }
    if (!this.token) {
      this.showError(translate("registerErrorMissingToken"));
      return;
    }
    if (!window.crypto || !window.crypto.subtle) {
      this.showError(translate("authErrorCryptoUnsupported"));
      return;
    }
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.setSubmitLabel("registerSubmitting");
    }
    let saltBytes;
    let seed;
    try {
      console.log("[RegisterLayout] Deriving credentials");
      saltBytes = generateSalt();
      let publicKey;
      let encryptionPublicKey;
      try {
        ({ seed, publicKey, encryptionPublicKey } = await deriveKeyPair(
          password,
          saltBytes,
          DEFAULT_KDF_SETTINGS
        ));
      } finally {
        this.passwordInput.value = "";
        this.passwordConfirmInput.value = "";
      }
      const salt = encodeSalt(saltBytes);
      const publicKeyB64 = encodePublicKey(publicKey);
      const encryptionPublicKeyB64 = encodePublicKey(encryptionPublicKey);
      const kdfSettings = serializeKDFSettings(DEFAULT_KDF_SETTINGS);
      console.log("[RegisterLayout] Sending registration request");
      const endpoint = this.registerType === "admin" ? "/register/admin" : "/register/user";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: this.token,
          name,
          email,
          salt,
          public_key: publicKeyB64,
          encryption_public_key: encryptionPublicKeyB64,
          kdf: kdfSettings
        })
      });
      if (!response.ok) {
        let serverMessage = "";
        try {
          serverMessage = await response.text();
        } catch (e) {
        }
        console.error("[RegisterLayout] Registration request failed", response.status, serverMessage);
        throw new Error(translate("registerErrorGeneric"));
      }
      const data = await response.json();
      console.log("[RegisterLayout] Registration successful", { userId: data.id, email: data.email });
      this.showSuccess(name);
    } catch (error) {
      console.error("[RegisterLayout] Registration failed", error);
      this.showError(error.message || translate("registerErrorGeneric"));
      if (this.submitButton) {
        this.submitButton.disabled = false;
        this.setSubmitLabel("registerSubmitButton");
      }
    } finally {
      if (seed) seed.fill(0);
      if (saltBytes) saltBytes.fill(0);
    }
  }
  /**
   * Show success screen after registration
   */
  async showSuccess(name) {
    const container = this.querySelector("section > div");
    if (!container) return;
    const template = document.getElementById("register-success");
    if (!template) {
      console.error("Template #register-success not found");
      return;
    }
    container.innerHTML = "";
    const content = template.content.cloneNode(true);
    const { translate: translate2, translateElement: translateElement2 } = await import("./utils-5ZUSYSIM.js");
    const messageElement = content.querySelector('[data-role="success-message"]');
    if (messageElement) {
      messageElement.textContent = translate2("registerSuccessMessage", { name });
    }
    const goHomeButton = content.querySelector('[data-action="go-home"]');
    if (goHomeButton) {
      goHomeButton.addEventListener("click", () => {
        window.location.href = "/";
      });
    }
    container.appendChild(content);
    translateElement2(container);
  }
  /**
   * Validate the entire form and enable/disable submit button
   */
  validateForm() {
    var _a, _b, _c, _d;
    const name = (_a = this.nameInput) == null ? void 0 : _a.value.trim();
    const email = (_b = this.emailInput) == null ? void 0 : _b.value.trim();
    const password = (_c = this.passwordInput) == null ? void 0 : _c.value;
    const passwordConfirm = (_d = this.passwordConfirmInput) == null ? void 0 : _d.value;
    const nameValid = name && name.length > 0;
    const emailValid = email && this.isValidEmail(email);
    const passwordValid = password && password.length >= 10;
    const passwordsMatch = password === passwordConfirm;
    const passwordConfirmValid = passwordConfirm && passwordConfirm.length >= 10;
    const allValid = nameValid && emailValid && passwordValid && passwordsMatch && passwordConfirmValid;
    if (this.submitButton) {
      this.submitButton.disabled = !allValid;
    }
    return allValid;
  }
  /**
   * Set translated placeholders for input fields
   */
  async setPlaceholders() {
    try {
      const { translate: translate2 } = await import("./utils-5ZUSYSIM.js");
      const nameInput = this.querySelector('[data-placeholder-key="registerNamePlaceholder"]');
      const emailInput = this.querySelector('[data-placeholder-key="registerEmailPlaceholder"]');
      if (nameInput) {
        nameInput.placeholder = translate2("registerNamePlaceholder");
      }
      if (emailInput) {
        emailInput.placeholder = translate2("registerEmailPlaceholder");
      }
    } catch (e) {
      console.warn("Could not translate placeholders", e);
    }
  }
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  /**
   * Show error message
   */
  showError(message) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.remove("hidden");
    }
  }
  /**
   * Hide error message
   */
  hideError() {
    if (this.errorElement) {
      this.errorElement.textContent = "";
      this.errorElement.classList.add("hidden");
    }
  }
  setSubmitLabel(key) {
    if (!this.submitButton) {
      return;
    }
    const label = this.submitButton.querySelector('[data-type="lang"]');
    const text = translate(key);
    if (label) {
      label.textContent = text;
    } else {
      this.submitButton.textContent = text;
    }
  }
};
customElements.define("register-layout", RegisterLayoutElement);
//# sourceMappingURL=register-layout-UL65PQT3.js.map
