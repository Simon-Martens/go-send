import {
  decodeSalt,
  deriveKeyMaterial,
  normalizeKDFSettings,
  signChallenge
} from "./chunk-5FOUOON2.js";
import {
  Keychain,
  OwnedFile,
  UserSecrets,
  storage_default
} from "./chunk-42IXS7QU.js";
import "./chunk-U2WOWVJN.js";
import {
  arrayToB64,
  b64ToArray,
  translate,
  translateElement
} from "./chunk-6LPP53TP.js";
import "./chunk-IFG75HHC.js";

// src/ui/login-layout.mjs
var LoginLayoutElement = class extends HTMLElement {
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
    this._boundHandlers = {
      submit: this.handleSubmit.bind(this),
      togglePassword: this.togglePasswordVisibility.bind(this)
    };
  }
  connectedCallback() {
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
    var _a, _b;
    event.preventDefault();
    this.hideError();
    const email = (_a = this.emailInput) == null ? void 0 : _a.value.trim();
    const password = (_b = this.passwordInput) == null ? void 0 : _b.value;
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
          challenge.nonce
        );
        await this.submitLogin(email, challenge.challenge_id, signature);
        let userSecrets = null;
        try {
          userSecrets = UserSecrets.fromKeyMaterial({
            email,
            edSeed: keyMaterial.edSeed,
            x25519Seed: keyMaterial.x25519Seed
          });
          storage_default.clearUser();
          storage_default.setUser(userSecrets);
        } catch (persistError) {
          console.warn(
            "[LoginLayout] Failed to persist user secrets",
            persistError
          );
        }
        if (userSecrets) {
          await this.restoreOwnedFiles(userSecrets);
        }
        window.location.assign("/");
      } finally {
        if (keyMaterial == null ? void 0 : keyMaterial.edSeed) {
          keyMaterial.edSeed.fill(0);
        }
        if (keyMaterial == null ? void 0 : keyMaterial.x25519Seed) {
          keyMaterial.x25519Seed.fill(0);
        }
        saltBytes == null ? void 0 : saltBytes.fill(0);
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
  async restoreOwnedFiles(userSecrets) {
    try {
      const response = await fetch("/api/me/files", {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
        credentials: "same-origin"
      });
      if (!response.ok) {
        console.warn(
          "[LoginLayout] Failed to fetch owned files",
          response.status
        );
        return;
      }
      const payload = await response.json();
      const files = Array.isArray(payload == null ? void 0 : payload.files) ? payload.files : [];
      storage_default.clearLocalFiles();
      for (const file of files) {
        try {
          const secretBytes = await userSecrets.unwrapSecret({
            ciphertext: file.secret_ciphertext,
            nonce: file.secret_nonce,
            ephemeralPublicKey: file.secret_ephemeral_pub,
            version: file.secret_version
          });
          try {
            const secretB64 = arrayToB64(secretBytes);
            const keychain = new Keychain(secretB64, file.nonce);
            const metadataBytes = b64ToArray(file.metadata);
            const metadata = await keychain.decryptMetadata(metadataBytes);
            const ownedFile = new OwnedFile({
              id: file.id,
              url: `${window.location.origin}/download/${file.id}#${secretB64}`,
              name: metadata.name,
              size: metadata.size,
              manifest: metadata.manifest || {},
              time: 0,
              speed: metadata.size || 0,
              createdAt: file.created_at * 1e3,
              expiresAt: file.expires_at * 1e3,
              secretKey: secretB64,
              nonce: file.nonce,
              ownerToken: file.owner_token,
              dlimit: file.dl_limit,
              dtotal: file.dl_count,
              hasPassword: file.password,
              timeLimit: file.time_limit
            });
            storage_default.addFile(ownedFile);
          } finally {
            secretBytes.fill(0);
          }
        } catch (fileError) {
          console.warn("[LoginLayout] Failed to restore file", fileError, file == null ? void 0 : file.id);
        }
      }
    } catch (err) {
      console.warn("[LoginLayout] Failed to restore owned files", err);
    }
  }
  async requestChallenge(email) {
    const response = await fetch("/auth/challenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = await response.text();
      } catch (e) {
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        challenge_id: challengeID,
        signature
      })
    });
    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = await response.text();
      } catch (e) {
      }
      console.error("[LoginLayout] Login submission failed", response.status, serverMessage);
      throw new Error(translate("loginErrorGeneric"));
    }
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
};
customElements.define("login-layout", LoginLayoutElement);
//# sourceMappingURL=login-layout-X54TNEPN.js.map
