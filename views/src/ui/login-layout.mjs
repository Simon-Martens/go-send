import {
  translateElement,
  translate,
} from "../utils.mjs";
import {
  decodeSalt,
  deriveKeyMaterial,
  normalizeKDFSettings,
  signChallenge,
} from "../crypto/credentials.mjs";
import storage from "../storage.mjs";
import UserSecrets from "../userSecrets.mjs";
import { syncOwnedFiles } from "../syncFiles.mjs";

class LoginLayoutElement extends HTMLElement {
  constructor() {
    super();
    this.form = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.errorElement = null;
    this.submitButton = null;
    this.passwordToggle = null;

    this._frame = null;
    this._templateMounted = false;
    this._storageCleared = false;

    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      togglePassword: this.togglePasswordVisibility.bind(this),
    };
  }

  connectedCallback() {
    // Clear all localStorage when login page is first opened
    // If user is redirected here, session is invalid and all state should be wiped
    if (!this._storageCleared) {
      storage.clearAll();
      this._storageCleared = true;
    }

    if (!this._templateMounted) {
      const template = document.getElementById("login-layout");
      if (!template) {
        console.error("Template #login-layout not found");
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

      this.form = this.querySelector('[data-role="login-form"]');
      this.emailInput = this.querySelector('[data-role="email-input"]');
      this.passwordInput = this.querySelector('[data-role="password-input"]');
      this.errorElement = this.querySelector('[data-role="error"]');
      this.submitButton = this.querySelector('[data-role="submit"]');
      this.passwordToggle = this.querySelector('[data-role="toggle-password"]');

      if (this.form) {
        this.form.addEventListener("submit", this._boundHandlers.submit);
      }
      if (this.passwordToggle) {
        this.passwordToggle.addEventListener("click", this._boundHandlers.togglePassword);
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

    if (this.passwordToggle) {
      this.passwordToggle.removeEventListener("click", this._boundHandlers.togglePassword);
    }
  }

  togglePasswordVisibility(event) {
    event.preventDefault();
    if (!this.passwordInput) return;
    this.passwordInput.type = this.passwordInput.type === "password" ? "text" : "password";
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.hideError();

    const email = this.emailInput?.value.trim();
    const password = this.passwordInput?.value;

    if (!email || !this.isValidEmail(email)) {
      this.showError(translate("authErrorInvalidEmail"));
      return;
    }

    if (!password || password.length < 10) {
      this.showError(translate("authErrorPasswordLength"));
      return;
    }

    if (!window.crypto || !window.crypto.subtle) {
      this.showError(translate("authErrorCryptoUnsupported"));
      return;
    }

    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.setSubmitLabel("loginSubmitting");
    }

    try {
      const challenge = await this.requestChallenge(email);
      const saltBytes = decodeSalt(challenge.salt);
      const settings = normalizeKDFSettings(challenge.kdf);

      let keyMaterial;
      try {
        try {
          keyMaterial = await deriveKeyMaterial(password, saltBytes, settings);
        } finally {
          if (this.passwordInput) this.passwordInput.value = "";
        }

        const signature = await signChallenge(
          keyMaterial.edSeed,
          challenge.nonce,
        );
        const loginResult = await this.submitLogin(email, challenge.challenge_id, signature);

        let userSecrets = null;
        try {
          userSecrets = UserSecrets.fromKeyMaterial({
            email,
            name: loginResult.user?.name,
            role: loginResult.user?.role,
            settings: loginResult.user?.settings,
            edSeed: keyMaterial.edSeed,
            x25519Seed: keyMaterial.x25519Seed,
            version: loginResult.app_version,
          });
          storage.clearUser();
          storage.setUser(userSecrets);
        } catch (persistError) {
          console.warn(
            "[LoginLayout] Failed to persist user secrets",
            persistError,
          );
        }

        if (userSecrets) {
          await syncOwnedFiles(userSecrets, { clearFirst: true });
        }

        window.location.assign("/");
      } finally {
        if (keyMaterial?.edSeed) {
          keyMaterial.edSeed.fill(0);
        }
        if (keyMaterial?.x25519Seed) {
          keyMaterial.x25519Seed.fill(0);
        }
        saltBytes?.fill(0);
      }
    } catch (error) {
      console.error("[LoginLayout] Login failed", error);
      this.showError(error.message || translate("loginErrorGeneric"));
      if (this.submitButton) {
        this.submitButton.disabled = false;
        this.setSubmitLabel("loginSubmitButton");
      }
    }
  }

  async requestChallenge(email) {
    const response = await fetch("/auth/challenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = await response.text();
      } catch (e) {
        // ignore
      }
      console.error("[LoginLayout] Challenge request failed", response.status, serverMessage);
      throw new Error(translate("loginErrorChallenge"));
    }

    return response.json();
  }

  async submitLogin(email, challengeID, signature) {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        challenge_id: challengeID,
        signature,
      }),
    });

    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = await response.text();
      } catch (e) {
        // ignore
      }
      console.error("[LoginLayout] Login submission failed", response.status, serverMessage);
      throw new Error(translate("loginErrorGeneric"));
    }

    return response.json();
  }

  showError(message) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.remove("hidden");
    }
  }

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

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

customElements.define("login-layout", LoginLayoutElement);
