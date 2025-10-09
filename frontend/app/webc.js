import { arrayToB64, b64ToArray, setTranslate } from "../utils.js";
import { workerCommand } from "../auth-worker-client.js";

// --- SECURITY NOTE ---
// Storing cryptographic keys in localStorage is vulnerable to Cross-Site Scripting (XSS).
// SessionStorage is safer as it's cleared when the session ends (tab is closed),
// but it is still accessible via XSS. The most secure method is storing the key in
// memory only (e.g., in a variable within a Web Worker).
const USER_SESSION_KEY_LOCAL = "user-decryption-key-local"; // For trusted browsers
const USER_SESSION_KEY_SESSION = "user-decryption-key-session"; // For untrusted browsers

let translate;
setTranslate((t) => {
  translate = t;
});

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img class="w-8 h-8 mr-2" src="/icon.svg" alt="logo">
          Go Send
        </a>
        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl" data-l10n-id="login-header">
              Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6" id="login-form">
              <div>
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900" data-l10n-id="login-username-label">Your username</label>
                <input type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="username" required autocomplete="username">
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900" data-l10n-id="login-password-label">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required autocomplete="current-password">
              </div>
              <div class="flex items-center">
                  <input id="trust-browser" aria-describedby="trust-browser" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300">
                <div class="ml-3 text-sm">
                  <label for="trust-browser" class="text-gray-500" data-l10n-id="login-trust-browser-label">Trust this browser</label>
                </div>
              </div>
              <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-l10n-id="login-submit-button">Sign in</button>
              <p id="error-message" class="text-sm font-light text-red-500 hidden"></p>
            </form>
          </div>
        </div>
      </div>
    `;
    this._onSubmit = this._onSubmit.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("#login-form");
    this.errorMessage = this.querySelector("#error-message");
    this.form.addEventListener("submit", this._onSubmit);
    if (typeof translate === "function") {
      translate(this);
    }
  }

  disconnectedCallback() {
    this.form.removeEventListener("submit", this._onSubmit);
    // We no longer terminate the worker here, so it persists.
  }

  async _onSubmit(event) {
    event.preventDefault();
    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.setAttribute("data-l10n-id", "login-submit-button-loading");
    if (typeof translate === "function") {
      translate(submitButton);
    }

    this.errorMessage.classList.add("hidden");

    const username = this.form.elements.username.value;
    const password = this.form.elements.password.value;
    const trustBrowser = this.form.elements["trust-browser"].checked;

    try {
      const challengeResponse = await fetch("/api/v1/login/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (challengeResponse.status === 404) {
        throw new Error("user-not-found");
      }
      if (!challengeResponse.ok) {
        throw new Error("server-error");
      }

      const { salt, nonce } = await challengeResponse.json();

      const { signature, privateKey } = await workerCommand("DERIVE_AND_SIGN", {
        password,
        salt: b64ToArray(salt),
        nonce,
      });

      const loginResponse = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, signature }),
      });

      if (loginResponse.ok) {
        const exportedPrivateKey = await window.crypto.subtle.exportKey(
          "jwk",
          privateKey,
        );

        localStorage.removeItem(USER_SESSION_KEY_LOCAL);
        sessionStorage.removeItem(USER_SESSION_KEY_SESSION);

        if (trustBrowser) {
          localStorage.setItem(
            USER_SESSION_KEY_LOCAL,
            JSON.stringify(exportedPrivateKey),
          );
        } else {
          sessionStorage.setItem(
            USER_SESSION_KEY_SESSION,
            JSON.stringify(exportedPrivateKey),
          );
        }

        window.location.href = "/account/links";
      } else {
        throw new Error("invalid-credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessageId = "login-error-unexpected";
      if (
        error.message === "invalid-credentials" ||
        error.message === "user-not-found"
      ) {
        errorMessageId = "login-error-invalid";
      }
      this.errorMessage.setAttribute("data-l10n-id", errorMessageId);
      if (typeof translate === "function") {
        translate(this.errorMessage);
      }
      this.errorMessage.classList.remove("hidden");
    } finally {
      submitButton.disabled = false;
      submitButton.setAttribute("data-l10n-id", "login-submit-button");
      if (typeof translate === "function") {
        translate(submitButton);
      }
    }
  }
}

class PasswordReset extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
            <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl" data-l10n-id="reset-password-header">
                        Change password
                    </h1>
                    <form class="space-y-4 md:space-y-6" id="reset-form">
                        <div>
                            <label for="new-password" class="block mb-2 text-sm font-medium text-gray-900" data-l10n-id="reset-password-new-label">New Password</label>
                            <input type="password" name="new-password" id="new-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required autocomplete="new-password">
                        </div>
                        <div>
                            <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900" data-l10n-id="reset-password-confirm-label">Confirm New Password</label>
                            <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required autocomplete="new-password">
                        </div>
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-l10n-id="reset-password-submit-button">Reset Password</button>
                        <p id="reset-message" class="text-sm font-light text-green-500 hidden"></p>
                        <p id="reset-error" class="text-sm font-light text-red-500 hidden"></p>
                    </form>
                </div>
            </div>
        `;
    this._onSubmit = this._onSubmit.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("#reset-form");
    this.message = this.querySelector("#reset-message");
    this.error = this.querySelector("#reset-error");
    this.form.addEventListener("submit", this._onSubmit);
    if (typeof translate === "function") {
      translate(this);
    }
  }

  disconnectedCallback() {
    this.form.removeEventListener("submit", this._onSubmit);
  }

  async _onSubmit(event) {
    event.preventDefault();
    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.setAttribute(
      "data-l10n-id",
      "reset-password-submit-button-loading",
    );
    if (typeof translate === "function") {
      translate(submitButton);
    }

    this.message.classList.add("hidden");
    this.error.classList.add("hidden");

    const newPassword = this.form.elements["new-password"].value;
    const confirmPassword = this.form.elements["confirm-password"].value;

    if (newPassword !== confirmPassword) {
      this.error.setAttribute("data-l10n-id", "reset-password-error-mismatch");
      if (typeof translate === "function") {
        translate(this.error);
      }
      this.error.classList.remove("hidden");
      submitButton.disabled = false;
      submitButton.setAttribute("data-l10n-id", "reset-password-submit-button");
      if (typeof translate === "function") {
        translate(submitButton);
      }
      return;
    }

    try {
      const newSalt = window.crypto.getRandomValues(new Uint8Array(16));

      const { newPublicEncKey, newPublicSignKey, privateKey } =
        await workerCommand("DERIVE_KEYS_FOR_RESET", {
          newPassword,
          newSalt,
        });

      const response = await fetch("/api/v1/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salt: arrayToB64(newSalt),
          publicEncKey: newPublicEncKey,
          publicSignKey: newPublicSignKey,
        }),
      });

      if (response.ok) {
        const exportedPrivateKey = await window.crypto.subtle.exportKey(
          "jwk",
          privateKey,
        );

        // Maintain the user's original trust decision
        if (localStorage.getItem(USER_SESSION_KEY_LOCAL)) {
          localStorage.setItem(
            USER_SESSION_KEY_LOCAL,
            JSON.stringify(exportedPrivateKey),
          );
        } else if (sessionStorage.getItem(USER_SESSION_KEY_SESSION)) {
          sessionStorage.setItem(
            USER_SESSION_KEY_SESSION,
            JSON.stringify(exportedPrivateKey),
          );
        }

        this.message.setAttribute("data-l10n-id", "reset-password-success");
        if (typeof translate === "function") {
          translate(this.message);
        }
        this.message.classList.remove("hidden");
        this.form.reset();
      } else {
        throw new Error("Failed to update password on the server.");
      }
    } catch (err) {
      console.error("Password reset failed:", err);
      this.error.setAttribute(
        "data-l10n-id",
        "reset-password-error-unexpected",
      );
      if (typeof translate === "function") {
        translate(this.error);
      }
      this.error.classList.remove("hidden");
    } finally {
      submitButton.disabled = false;
      submitButton.setAttribute("data-l10n-id", "reset-password-submit-button");
      if (typeof translate === "function") {
        translate(submitButton);
      }
    }
  }
}

// Define the custom elements so they can be used in HTML
customElements.define("login-form", LoginForm);
customElements.define("password-reset", PasswordReset);
