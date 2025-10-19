import { translateElement, translate } from "../utils.mjs";
import {
  DEFAULT_KDF_SETTINGS,
  deriveKeyPair,
  encodePublicKey,
  encodeSalt,
  generateSalt,
  serializeKDFSettings,
} from "../crypto/credentials.mjs";

/**
 * <register-layout> - User registration form
 *
 * Responsibilities:
 * - Displays registration form (name, email, password, password confirm)
 * - Handles password visibility toggling
 * - Validates passwords match
 * - Extracts token from URL
 * - Will trigger registration flow (to be implemented)
 *
 * Note: Client-side crypto logic will be added later to derive
 * private/public keys from password using Web Crypto API
 */
class RegisterLayoutElement extends HTMLElement {
  constructor() {
    super();

    // Form elements (will be populated in connectedCallback)
    this.form = null;
    this.nameInput = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.passwordConfirmInput = null;
    this.errorElement = null;
    this.submitButton = null;

    // Password visibility toggles
    this.passwordToggle = null;
    this.passwordConfirmToggle = null;

    // Token extracted from URL
    this.token = null;
    this.registerType = 'admin'; // 'admin' or 'user'

    this._postMountFrame = null;
    this._templateMounted = false;
    this._handlersBound = false;

    // Bound event handlers
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      togglePassword: this.togglePasswordVisibility.bind(this),
      togglePasswordConfirm: this.togglePasswordConfirmVisibility.bind(this),
    };
  }

  connectedCallback() {
    // Mount template first (synchronous)
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

    // Schedule async initialization
    this._postMountFrame = requestAnimationFrame(() => {
      this._postMountFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);

      // Extract token from URL path
      this.extractToken();

      // Get form elements
      this.form = this.querySelector('[data-role="register-form"]');
      this.nameInput = this.querySelector('[data-role="name-input"]');
      this.emailInput = this.querySelector('[data-role="email-input"]');
      this.passwordInput = this.querySelector('[data-role="password-input"]');
      this.passwordConfirmInput = this.querySelector('[data-role="password-confirm-input"]');
      this.errorElement = this.querySelector('[data-role="error"]');
      this.submitButton = this.querySelector('[data-role="submit"]');
      this.passwordToggle = this.querySelector('[data-role="toggle-password"]');
      this.passwordConfirmToggle = this.querySelector('[data-role="toggle-password-confirm"]');

      // Update title and description based on register type
      const titleSpan = this.querySelector('[data-role="register-title"] span');
      const descriptionSpan = this.querySelector('[data-role="register-description"] span');

      if (titleSpan && descriptionSpan) {
        if (this.registerType === 'admin') {
          // Already shows admin text from template
          titleSpan.id = 'registerAdminTitle';
          descriptionSpan.id = 'registerAdminDescription';
        } else {
          // Change to user text
          titleSpan.id = 'registerUserTitle';
          descriptionSpan.id = 'registerUserDescription';
        }
        // Re-translate after changing IDs
        translateElement(this);
      }

      // Set placeholder translations
      this.setPlaceholders();

      // Bind event handlers
      if (!this._handlersBound && this.form) {
        this.form.addEventListener("submit", this._boundHandlers.submit);

        if (this.passwordToggle) {
          this.passwordToggle.addEventListener("click", this._boundHandlers.togglePassword);
        }

        if (this.passwordConfirmToggle) {
          this.passwordConfirmToggle.addEventListener("click", this._boundHandlers.togglePasswordConfirm);
        }

        // Add input event listeners for real-time validation
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

      // Initial validation state
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
   * Expected paths: /register/admin/[token] or /register/[token]
   */
  extractToken() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);

    // /register/admin/[token]
    if (parts[0] === 'register' && parts[1] === 'admin' && parts[2]) {
      this.token = parts[2];
      this.registerType = 'admin';
    }
    // /register/[token] (for regular users)
    else if (parts[0] === 'register' && parts[1]) {
      this.token = parts[1];
      this.registerType = 'user';
    }
    // No token found
    else {
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
    event.preventDefault();

    // Clear any previous errors
    this.hideError();

    // Get form values
    const name = this.nameInput?.value.trim();
    const email = this.emailInput?.value.trim();
    const password = this.passwordInput?.value;
    const passwordConfirm = this.passwordConfirmInput?.value;

    if (!name) {
      this.showError(translate("registerErrorNameRequired"));
      return;
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      this.showError(translate("authErrorInvalidEmail"));
      return;
    }

    // Validate password length
    if (password.length < 10) {
      this.showError(translate("authErrorPasswordLength"));
      return;
    }

    // Validate passwords match
    if (password !== passwordConfirm) {
      this.showError(translate("registerErrorPasswordsMismatch"));
      return;
    }

    // Validate token exists
    if (!this.token) {
      this.showError(translate("registerErrorMissingToken"));
      return;
    }

    if (!window.crypto || !window.crypto.subtle) {
      this.showError(translate("authErrorCryptoUnsupported"));
      return;
    }

    // Disable submit button during processing
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
          DEFAULT_KDF_SETTINGS,
        ));
      } finally {
        // Always clear the password string once the derivation finished
        this.passwordInput.value = "";
        this.passwordConfirmInput.value = "";
      }

      const salt = encodeSalt(saltBytes);
      const publicKeyB64 = encodePublicKey(publicKey);
      const encryptionPublicKeyB64 = encodePublicKey(encryptionPublicKey);
      const kdfSettings = serializeKDFSettings(DEFAULT_KDF_SETTINGS);

      // Zero sensitive buffers
      console.log("[RegisterLayout] Sending registration request");

      // Send registration request to server
      const endpoint = this.registerType === 'admin' ? '/register/admin' : '/register/user';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          name: name,
          email: email,
          salt,
          public_key: publicKeyB64,
          encryption_public_key: encryptionPublicKeyB64,
          kdf: kdfSettings,
        }),
      });

      if (!response.ok) {
        let serverMessage = "";
        try {
          serverMessage = await response.text();
        } catch (e) {
          // Ignore parse errors
        }
        console.error("[RegisterLayout] Registration request failed", response.status, serverMessage);
        throw new Error(translate("registerErrorGeneric"));
      }

      const data = await response.json();
      console.log("[RegisterLayout] Registration successful", { userId: data.id, email: data.email });

      // Show success screen
      this.showSuccess(name);

    } catch (error) {
      console.error("[RegisterLayout] Registration failed", error);
      this.showError(error.message || translate("registerErrorGeneric"));

      // Re-enable submit button
      if (this.submitButton) {
        this.submitButton.disabled = false;
        this.setSubmitLabel("registerSubmitButton");
      }
    }
    finally {
      if (seed) seed.fill(0);
      if (saltBytes) saltBytes.fill(0);
    }
  }

  /**
   * Show success screen after registration
   */
  async showSuccess(name) {
    // Replace form with success message
    const container = this.querySelector('section > div');
    if (!container) return;

    // Get the success template
    const template = document.getElementById("register-success");
    if (!template) {
      console.error("Template #register-success not found");
      return;
    }

    // Clear container and mount success template
    container.innerHTML = '';
    const content = template.content.cloneNode(true);

    // Import translation function
    const { translate, translateElement } = await import("../utils.mjs");

    // Set the dynamic success message
    const messageElement = content.querySelector('[data-role="success-message"]');
    if (messageElement) {
      messageElement.textContent = translate('registerSuccessMessage', { name });
    }

    // Bind button click handler
    const goHomeButton = content.querySelector('[data-action="go-home"]');
    if (goHomeButton) {
      goHomeButton.addEventListener('click', () => {
        window.location.href = '/';
      });
    }

    // Append content to container
    container.appendChild(content);

    // Translate the static elements
    translateElement(container);
  }

  /**
   * Validate the entire form and enable/disable submit button
   */
  validateForm() {
    const name = this.nameInput?.value.trim();
    const email = this.emailInput?.value.trim();
    const password = this.passwordInput?.value;
    const passwordConfirm = this.passwordConfirmInput?.value;

    // Check all conditions
    const nameValid = name && name.length > 0;
    const emailValid = email && this.isValidEmail(email);
    const passwordValid = password && password.length >= 10;
    const passwordsMatch = password === passwordConfirm;
    const passwordConfirmValid = passwordConfirm && passwordConfirm.length >= 10;

    const allValid = nameValid && emailValid && passwordValid && passwordsMatch && passwordConfirmValid;

    // Enable/disable submit button
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
      const { translate } = await import("../utils.mjs");

      const nameInput = this.querySelector('[data-placeholder-key="registerNamePlaceholder"]');
      const emailInput = this.querySelector('[data-placeholder-key="registerEmailPlaceholder"]');

      if (nameInput) {
        nameInput.placeholder = translate('registerNamePlaceholder');
      }

      if (emailInput) {
        emailInput.placeholder = translate('registerEmailPlaceholder');
      }
    } catch (e) {
      console.warn('Could not translate placeholders', e);
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    // Basic email validation regex
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
}

// Register the custom element
customElements.define("register-layout", RegisterLayoutElement);
