import {
  DEFAULT_KDF_SETTINGS,
  deriveKeyMaterial,
  encodePublicKey,
  encodeSalt,
  generateSalt,
  getPublicKey,
  normalizeKDFSettings,
  serializeKDFSettings
} from "./chunk-ZTZWVLC7.js";
import {
  OWNER_SECRET_VERSION,
  UserSecrets,
  storage_default,
  x25519
} from "./chunk-4T7GFWSU.js";
import "./chunk-PC246CWX.js";
import {
  arrayToB64,
  copyToClipboard,
  translate,
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/settings-account-panel.mjs
var SettingsAccountPanel = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._profileForm = null;
    this._profileSubmitButton = null;
    this._profileStatus = null;
    this._profileStatusIcon = null;
    this._profileStatusText = null;
    this._passwordForm = null;
    this._passwordSubmitButton = null;
    this._passwordStatus = null;
    this._passwordStatusIcon = null;
    this._passwordStatusText = null;
    this._accountStatus = null;
    this._accountStatusIcon = null;
    this._accountStatusText = null;
    this._clearSessionsButton = null;
    this._deactivateAccountButton = null;
    this._accountKeyValue = null;
    this._accountKeyCopyButton = null;
    this._accountKeyStatus = null;
    this._accountKeyStatusIcon = null;
    this._accountKeyStatusText = null;
    this._boundPasswordSubmit = this._handlePasswordSubmit.bind(this);
    this._boundProfileSubmit = this._handleProfileSubmit.bind(this);
    this._boundClearSessions = this._handleClearSessions.bind(this);
    this._boundDeactivateAccount = this._handleDeactivateAccount.bind(this);
    this._boundKeyCopy = this._handleAccountKeyCopy.bind(this);
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-account-panel");
      if (!template) {
        console.error("Template #settings-account-panel not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    this._cacheElements();
    translateElement(this);
    this._attachListeners();
    this._populateAccountForms();
  }
  disconnectedCallback() {
    this._detachListeners();
    this._profileForm = null;
    this._profileSubmitButton = null;
    this._profileStatus = null;
    this._profileStatusIcon = null;
    this._profileStatusText = null;
    this._passwordForm = null;
    this._passwordSubmitButton = null;
    this._passwordStatus = null;
    this._passwordStatusIcon = null;
    this._passwordStatusText = null;
    this._accountStatus = null;
    this._accountStatusIcon = null;
    this._accountStatusText = null;
    this._clearSessionsButton = null;
    this._deactivateAccountButton = null;
    this._accountKeyValue = null;
    this._accountKeyCopyButton = null;
    this._accountKeyStatus = null;
    this._accountKeyStatusIcon = null;
    this._accountKeyStatusText = null;
  }
  _cacheElements() {
    this._profileForm = this.querySelector('[data-role="profile-form"]');
    this._profileSubmitButton = this.querySelector(
      '[data-role="profile-submit"]'
    );
    this._profileStatus = this.querySelector('[data-role="profile-status"]');
    this._profileStatusIcon = this.querySelector(
      '[data-role="profile-status-icon"]'
    );
    this._profileStatusText = this.querySelector(
      '[data-role="profile-status-text"]'
    );
    this._passwordForm = this.querySelector('[data-role="password-form"]');
    this._passwordSubmitButton = this.querySelector(
      '[data-role="password-submit"]'
    );
    this._passwordStatus = this.querySelector('[data-role="password-status"]');
    this._passwordStatusIcon = this.querySelector(
      '[data-role="password-status-icon"]'
    );
    this._passwordStatusText = this.querySelector(
      '[data-role="password-status-text"]'
    );
    this._accountStatus = this.querySelector('[data-role="account-status"]');
    this._accountStatusIcon = this.querySelector(
      '[data-role="account-status-icon"]'
    );
    this._accountStatusText = this.querySelector(
      '[data-role="account-status-text"]'
    );
    this._clearSessionsButton = this.querySelector(
      '[data-role="account-clear-sessions"]'
    );
    this._deactivateAccountButton = this.querySelector(
      '[data-role="account-deactivate"]'
    );
    this._accountKeyValue = this.querySelector('[data-role="account-key-value"]');
    this._accountKeyCopyButton = this.querySelector(
      '[data-role="account-key-copy"]'
    );
    this._accountKeyStatus = this.querySelector(
      '[data-role="account-key-status"]'
    );
    this._accountKeyStatusIcon = this.querySelector(
      '[data-role="account-key-status-icon"]'
    );
    this._accountKeyStatusText = this.querySelector(
      '[data-role="account-key-status-text"]'
    );
  }
  _attachListeners() {
    if (this._profileSubmitButton) {
      this._profileSubmitButton.addEventListener(
        "click",
        this._boundProfileSubmit
      );
    }
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.addEventListener(
        "click",
        this._boundPasswordSubmit
      );
    }
    if (this._clearSessionsButton) {
      this._clearSessionsButton.addEventListener(
        "click",
        this._boundClearSessions
      );
    }
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.addEventListener(
        "click",
        this._boundDeactivateAccount
      );
    }
    if (this._accountKeyCopyButton) {
      this._accountKeyCopyButton.addEventListener("click", this._boundKeyCopy);
    }
  }
  _detachListeners() {
    if (this._profileSubmitButton) {
      this._profileSubmitButton.removeEventListener(
        "click",
        this._boundProfileSubmit
      );
    }
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.removeEventListener(
        "click",
        this._boundPasswordSubmit
      );
    }
    if (this._clearSessionsButton) {
      this._clearSessionsButton.removeEventListener(
        "click",
        this._boundClearSessions
      );
    }
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.removeEventListener(
        "click",
        this._boundDeactivateAccount
      );
    }
    if (this._accountKeyCopyButton) {
      this._accountKeyCopyButton.removeEventListener(
        "click",
        this._boundKeyCopy
      );
    }
  }
  _populateAccountForms() {
    var _a, _b;
    const userSecrets = storage_default.user;
    if (!userSecrets) {
      return;
    }
    const nameInput = (_a = this._profileForm) == null ? void 0 : _a.querySelector(
      "#settings-account-name"
    );
    if (nameInput) {
      nameInput.value = userSecrets.name || "";
    }
    const emailInput = (_b = this._profileForm) == null ? void 0 : _b.querySelector(
      "#settings-account-email"
    );
    if (emailInput) {
      emailInput.value = userSecrets.email || "";
    }
    this._updateAccountKeySummary(userSecrets);
  }
  _updateAccountKeySummary(userSecrets) {
    if (!this._accountKeyValue) {
      return;
    }
    const raw = (userSecrets == null ? void 0 : userSecrets.x25519PrivateKey) || "";
    if (!raw) {
      this._accountKeyValue.textContent = translate(
        "settingsAccountKeyUnavailable"
      );
      if (this._accountKeyCopyButton) {
        this._accountKeyCopyButton.disabled = true;
      }
      this._setKeyStatus("", "");
      return;
    }
    const preview = raw.length <= 20 ? raw : `${raw.slice(0, 12)}\u2026${raw.slice(-6)}`;
    this._accountKeyValue.textContent = preview;
    if (this._accountKeyCopyButton) {
      this._accountKeyCopyButton.disabled = false;
      this._accountKeyCopyButton.setAttribute("data-key-value", raw);
    }
    this._setKeyStatus("", "");
  }
  _setProfileStatus(type, message) {
    if (!this._profileStatus) {
      return;
    }
    if (this._profileStatusText) {
      this._profileStatusText.textContent = message || "";
    }
    this._profileStatus.className = "text-sm flex items-center gap-2 min-h-[1.25rem]";
    if (this._profileStatusIcon) {
      this._profileStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    if (type === "error") {
      this._profileStatus.classList.add("text-red-600", "dark:text-red-400");
      if (this._profileStatusIcon) {
        this._profileStatusIcon.classList.remove("hidden");
        this._profileStatusIcon.classList.add(
          "ri-close-circle-fill",
          "text-red-600",
          "dark:text-red-400"
        );
      }
    } else if (type === "success") {
      this._profileStatus.classList.add(
        "text-green-600",
        "dark:text-green-400"
      );
      if (this._profileStatusIcon) {
        this._profileStatusIcon.classList.remove("hidden");
        this._profileStatusIcon.classList.add(
          "ri-check-line",
          "text-green-600",
          "dark:text-green-400"
        );
      }
    } else {
      this._profileStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._profileStatusIcon) {
        this._profileStatusIcon.classList.remove("hidden");
        this._profileStatusIcon.classList.add(
          "ri-information-line",
          "text-grey-60",
          "dark:text-grey-40"
        );
      }
    }
  }
  _setKeyStatus(type, message) {
    if (!this._accountKeyStatus) {
      return;
    }
    if (this._accountKeyStatusText) {
      this._accountKeyStatusText.textContent = message || "";
    }
    this._accountKeyStatus.className = "text-xs flex items-center gap-2 min-h-[1.25rem] text-amber-900/80 dark:text-amber-200/80";
    if (this._accountKeyStatusIcon) {
      this._accountKeyStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    if (type === "error") {
      this._accountKeyStatus.className = "text-xs flex items-center gap-2 min-h-[1.25rem] text-red-600 dark:text-red-300";
      if (this._accountKeyStatusIcon) {
        this._accountKeyStatusIcon.classList.remove("hidden");
        this._accountKeyStatusIcon.className = "ri-close-circle-fill text-red-600 dark:text-red-300";
      }
    } else if (type === "success") {
      this._accountKeyStatus.className = "text-xs flex items-center gap-2 min-h-[1.25rem] text-green-700 dark:text-green-300";
      if (this._accountKeyStatusIcon) {
        this._accountKeyStatusIcon.classList.remove("hidden");
        this._accountKeyStatusIcon.className = "ri-check-line text-green-700 dark:text-green-300";
      }
    } else {
      if (this._accountKeyStatusIcon) {
        this._accountKeyStatusIcon.classList.remove("hidden");
        this._accountKeyStatusIcon.className = "ri-information-line text-amber-700 dark:text-amber-200";
      }
    }
  }
  _setAccountStatus(type, message) {
    if (!this._accountStatus) {
      return;
    }
    if (this._accountStatusText) {
      this._accountStatusText.textContent = message || "";
    }
    this._accountStatus.className = "text-xs flex items-center gap-2 min-h-[1.25rem]";
    if (this._accountStatusIcon) {
      this._accountStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    if (type === "error") {
      this._accountStatus.classList.add("text-red-600", "dark:text-red-400");
      if (this._accountStatusIcon) {
        this._accountStatusIcon.classList.remove("hidden");
        this._accountStatusIcon.classList.add(
          "ri-close-circle-fill",
          "text-red-600",
          "dark:text-red-400"
        );
      }
    } else if (type === "success") {
      this._accountStatus.classList.add(
        "text-green-600",
        "dark:text-green-400"
      );
      if (this._accountStatusIcon) {
        this._accountStatusIcon.classList.remove("hidden");
        this._accountStatusIcon.classList.add(
          "ri-check-line",
          "text-green-600",
          "dark:text-green-400"
        );
      }
    } else {
      this._accountStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._accountStatusIcon) {
        this._accountStatusIcon.classList.remove("hidden");
        this._accountStatusIcon.classList.add(
          "ri-information-line",
          "text-grey-60",
          "dark:text-grey-40"
        );
      }
    }
  }
  _handleAccountKeyCopy(event) {
    event.preventDefault();
    if (!this._accountKeyCopyButton) {
      return;
    }
    const value = this._accountKeyCopyButton.getAttribute("data-key-value") || "";
    if (!value) {
      this._setKeyStatus(
        "error",
        translate("settingsAccountKeyStatusUnavailable")
      );
      return;
    }
    const success = copyToClipboard(value);
    if (success) {
      this._setKeyStatus(
        "success",
        translate("settingsAccountKeyStatusCopied")
      );
      const icon = this._accountKeyCopyButton.querySelector("i");
      if (icon) {
        const original = icon.dataset.originalClass || icon.className;
        icon.dataset.originalClass = original;
        icon.className = "ri-check-line text-base leading-4";
        setTimeout(() => {
          if (icon && icon.dataset.originalClass) {
            icon.className = icon.dataset.originalClass;
          }
        }, 2e3);
      }
    } else {
      this._setKeyStatus("error", translate("settingsAccountKeyStatusError"));
    }
  }
  _setPasswordStatus(type, message) {
    if (!this._passwordStatus) {
      return;
    }
    if (this._passwordStatusText) {
      this._passwordStatusText.textContent = message || "";
    }
    this._passwordStatus.className = "text-sm mt-4 flex items-center gap-2";
    if (this._passwordStatusIcon) {
      this._passwordStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    if (type === "error") {
      this._passwordStatus.classList.add("text-red-600", "dark:text-red-400");
      if (this._passwordStatusIcon) {
        this._passwordStatusIcon.classList.remove("hidden");
        this._passwordStatusIcon.classList.add(
          "ri-close-circle-fill",
          "text-red-600",
          "dark:text-red-400"
        );
      }
    } else if (type === "success") {
      this._passwordStatus.classList.add(
        "text-green-600",
        "dark:text-green-400"
      );
      if (this._passwordStatusIcon) {
        this._passwordStatusIcon.classList.remove("hidden");
        this._passwordStatusIcon.classList.add(
          "ri-check-line",
          "text-green-600",
          "dark:text-green-400"
        );
      }
    } else {
      this._passwordStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._passwordStatusIcon) {
        this._passwordStatusIcon.classList.remove("hidden");
        this._passwordStatusIcon.classList.add(
          "ri-information-line",
          "text-grey-60",
          "dark:text-grey-40"
        );
      }
    }
  }
  _isValidEmail(value) {
    if (!value) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  _mapProfileError(code, status) {
    switch (code) {
      case "invalid_name":
        return translate("settingsAccountProfileStatusNameRequired");
      case "invalid_email":
        return translate("settingsAccountProfileStatusEmailInvalid");
      case "email_required":
        return translate("settingsAccountProfileStatusEmailRequired");
      case "name_required":
        return translate("settingsAccountProfileStatusNameRequired");
      case "email_in_use":
        return translate("settingsAccountProfileStatusEmailInUse");
      case "not_active":
        return translate("settingsAccountDangerStatusNotActive");
      case "forbidden":
        return translate("settingsAccountProfileStatusError");
      default:
        break;
    }
    if (status === 409) {
      return translate("settingsAccountProfileStatusEmailInUse");
    }
    return translate("settingsAccountProfileStatusError");
  }
  _mapAccountActionError(code) {
    switch (code) {
      case "not_active":
        return translate("settingsAccountDangerStatusNotActive");
      case "forbidden":
        return translate("settingsAccountDangerStatusError");
      default:
        return translate("settingsAccountDangerStatusError");
    }
  }
  async _handleProfileSubmit(event) {
    event.preventDefault();
    if (!this._profileForm) {
      return;
    }
    const nameInput = this._profileForm.querySelector("#settings-account-name");
    const emailInput = this._profileForm.querySelector(
      "#settings-account-email"
    );
    const name = (nameInput == null ? void 0 : nameInput.value.trim()) || "";
    const email = (emailInput == null ? void 0 : emailInput.value.trim()) || "";
    if (!name) {
      this._setProfileStatus(
        "error",
        translate("settingsAccountProfileStatusNameRequired")
      );
      return;
    }
    if (!email) {
      this._setProfileStatus(
        "error",
        translate("settingsAccountProfileStatusEmailRequired")
      );
      return;
    }
    if (!this._isValidEmail(email)) {
      this._setProfileStatus(
        "error",
        translate("settingsAccountProfileStatusEmailInvalid")
      );
      return;
    }
    this._setProfileStatus(
      "info",
      translate("settingsAccountProfileStatusSaving")
    );
    if (this._profileSubmitButton) {
      this._profileSubmitButton.disabled = true;
    }
    try {
      const response = await fetch("/api/me/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
      });
      if (!response.ok) {
        let errorCode = "";
        try {
          const payload = await response.json();
          if (payload && typeof payload.error === "string") {
            errorCode = payload.error;
          }
        } catch {
        }
        const message = this._mapProfileError(errorCode, response.status);
        throw new Error(message);
      }
      let data = null;
      if (response.status !== 204) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }
      const userSecrets = storage_default.user;
      if (userSecrets) {
        userSecrets.name = (data == null ? void 0 : data.name) ?? name;
        userSecrets.email = (data == null ? void 0 : data.email) ?? email;
        storage_default.setUser(userSecrets);
      }
      this._populateAccountForms();
      this._setProfileStatus(
        "success",
        translate("settingsAccountProfileStatusSuccess")
      );
    } catch (error) {
      const message = (error == null ? void 0 : error.message) || translate("settingsAccountProfileStatusError");
      this._setProfileStatus("error", message);
    } finally {
      if (this._profileSubmitButton) {
        this._profileSubmitButton.disabled = false;
      }
    }
  }
  async _handleClearSessions(event) {
    event.preventDefault();
    this._setAccountStatus(
      "info",
      translate("settingsAccountDangerStatusClearing")
    );
    if (this._clearSessionsButton) {
      this._clearSessionsButton.disabled = true;
    }
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.disabled = true;
    }
    try {
      const response = await fetch("/api/me/clear-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        let errorCode = "";
        try {
          const payload = await response.json();
          if (payload && typeof payload.error === "string") {
            errorCode = payload.error;
          }
        } catch {
        }
        const message = this._mapAccountActionError(errorCode);
        throw new Error(message);
      }
      this._redirectToLogout();
    } catch (error) {
      const message = (error == null ? void 0 : error.message) || translate("settingsAccountDangerStatusError");
      this._setAccountStatus("error", message);
      if (this._clearSessionsButton) {
        this._clearSessionsButton.disabled = false;
      }
      if (this._deactivateAccountButton) {
        this._deactivateAccountButton.disabled = false;
      }
    }
  }
  async _handleDeactivateAccount(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      translate("settingsAccountDeactivateConfirm")
    );
    if (!confirmed) {
      return;
    }
    this._setAccountStatus(
      "info",
      translate("settingsAccountDangerStatusDeactivating")
    );
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.disabled = true;
    }
    if (this._clearSessionsButton) {
      this._clearSessionsButton.disabled = true;
    }
    try {
      const response = await fetch("/api/me/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        let errorCode = "";
        try {
          const payload = await response.json();
          if (payload && typeof payload.error === "string") {
            errorCode = payload.error;
          }
        } catch {
        }
        const message = this._mapAccountActionError(errorCode);
        throw new Error(message);
      }
      this._redirectToLogout();
    } catch (error) {
      const message = (error == null ? void 0 : error.message) || translate("settingsAccountDangerStatusError");
      this._setAccountStatus("error", message);
      if (this._deactivateAccountButton) {
        this._deactivateAccountButton.disabled = false;
      }
      if (this._clearSessionsButton) {
        this._clearSessionsButton.disabled = false;
      }
    }
  }
  _redirectToLogout() {
    try {
      storage_default.clearUser();
      storage_default.clearLocalFiles();
    } catch (err) {
      console.warn(
        "[SettingsAccountPanel] Failed to clear local storage on logout",
        err
      );
    }
    window.location.href = "/logout";
  }
  async _handlePasswordSubmit(event) {
    var _a;
    event.preventDefault();
    if (!this._passwordForm) {
      return;
    }
    const currentInput = this._passwordForm.querySelector(
      "#settings-current-password"
    );
    const newInput = this._passwordForm.querySelector("#settings-new-password");
    const confirmInput = this._passwordForm.querySelector(
      "#settings-confirm-password"
    );
    const currentPassword = (currentInput == null ? void 0 : currentInput.value) || "";
    const newPassword = (newInput == null ? void 0 : newInput.value) || "";
    const confirmPassword = (confirmInput == null ? void 0 : confirmInput.value) || "";
    if (currentPassword.length < 10) {
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorCurrent")
      );
      return;
    }
    if (newPassword.length < 10) {
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorNewLength")
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorMismatch")
      );
      return;
    }
    const userSecrets = storage_default.user;
    if (!userSecrets) {
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorNoSession")
      );
      return;
    }
    const saltBytes = userSecrets.getSaltBytes();
    if (!saltBytes || !saltBytes.length) {
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorMissingKeys")
      );
      return;
    }
    const storedSettings = userSecrets.settings || {};
    const kdfInput = storedSettings.kdf || storedSettings || DEFAULT_KDF_SETTINGS;
    const kdfSettings = normalizeKDFSettings(kdfInput);
    let derivedCurrent = null;
    let newMaterial = null;
    const newSaltBytes = generateSalt(
      kdfSettings.saltLength || DEFAULT_KDF_SETTINGS.saltLength
    );
    try {
      this._setPasswordStatus(
        "info",
        translate("settingsPasswordStatusInfoDeriving")
      );
      derivedCurrent = await deriveKeyMaterial(
        currentPassword,
        saltBytes,
        kdfSettings
      );
      const derivedCurrentPublic = x25519.scalarMultBase(
        derivedCurrent.x25519Seed
      );
      const storedPublic = userSecrets.getX25519PublicKey();
      if (storedPublic && arrayToB64(derivedCurrentPublic) !== arrayToB64(storedPublic)) {
        this._setPasswordStatus(
          "error",
          translate("settingsPasswordStatusErrorIncorrect")
        );
        derivedCurrent.edSeed.fill(0);
        derivedCurrent.x25519Seed.fill(0);
        return;
      }
      this._setPasswordStatus(
        "info",
        translate("settingsPasswordStatusInfoPreparing")
      );
      newMaterial = await deriveKeyMaterial(
        newPassword,
        newSaltBytes,
        kdfSettings
      );
    } catch (err) {
      console.error("[SettingsAccountPanel] Failed to derive key material", err);
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorDerive")
      );
      return;
    } finally {
      if (derivedCurrent == null ? void 0 : derivedCurrent.edSeed) derivedCurrent.edSeed.fill(0);
      if (derivedCurrent == null ? void 0 : derivedCurrent.x25519Seed) derivedCurrent.x25519Seed.fill(0);
    }
    let newEdPublic;
    let newXPublic;
    try {
      newEdPublic = await getPublicKey(newMaterial.edSeed);
      newXPublic = x25519.scalarMultBase(newMaterial.x25519Seed);
    } catch (err) {
      console.error("[SettingsAccountPanel] Failed to compute public keys", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorPublicKeys")
      );
      return;
    }
    let newUserSecrets;
    try {
      newUserSecrets = UserSecrets.fromKeyMaterial({
        email: userSecrets.email,
        name: userSecrets.name,
        role: userSecrets.role,
        settings: storedSettings,
        salt: encodeSalt(newSaltBytes),
        x25519Seed: newMaterial.x25519Seed,
        x25519PublicKey: newXPublic,
        version: userSecrets.version
      });
    } catch (err) {
      console.error("[SettingsAccountPanel] Failed to prepare new user secrets", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorUserSecrets")
      );
      return;
    }
    const fileUpdates = [];
    try {
      const files = storage_default.files || [];
      for (const ownedFile of files) {
        if (!(ownedFile == null ? void 0 : ownedFile.id) || !((_a = ownedFile.keychain) == null ? void 0 : _a.rawSecret)) {
          continue;
        }
        const wrap = await newUserSecrets.wrapSecret(
          ownedFile.keychain.rawSecret
        );
        fileUpdates.push({
          id: ownedFile.id,
          ciphertext: wrap.ciphertext,
          nonce: wrap.nonce,
          ephemeral_pub: wrap.ephemeralPublicKey,
          version: wrap.version || OWNER_SECRET_VERSION
        });
      }
    } catch (err) {
      console.error("[SettingsAccountPanel] Failed to re-wrap secrets", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus(
        "error",
        translate("settingsPasswordStatusErrorWrap")
      );
      return;
    }
    const payload = {
      current_password: currentPassword,
      new_salt: encodeSalt(newSaltBytes),
      new_public_key: encodePublicKey(newEdPublic),
      new_encryption_public_key: arrayToB64(newXPublic),
      files: fileUpdates,
      kdf: serializeKDFSettings(kdfSettings)
    };
    this._setPasswordStatus(
      "info",
      translate("settingsPasswordStatusInfoUpdating")
    );
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.disabled = true;
    }
    try {
      const response = await fetch("/api/passwordreset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        let serverError = "";
        try {
          serverError = await response.text();
        } catch {
        }
        console.error(
          "[SettingsAccountPanel] Password reset failed",
          response.status,
          serverError
        );
        const message = serverError || translate("settingsPasswordStatusErrorRequest");
        throw new Error(message);
      }
      storage_default.setUser(newUserSecrets);
      this._setPasswordStatus(
        "success",
        translate("settingsPasswordStatusSuccess")
      );
      if (currentInput) currentInput.value = "";
      if (newInput) newInput.value = "";
      if (confirmInput) confirmInput.value = "";
    } catch (err) {
      const fallback = translate("settingsPasswordStatusErrorGeneric");
      const message = (err == null ? void 0 : err.message) || fallback;
      this._setPasswordStatus("error", message);
    } finally {
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      if (this._passwordSubmitButton) {
        this._passwordSubmitButton.disabled = false;
      }
    }
  }
};
customElements.define("settings-account-panel", SettingsAccountPanel);
//# sourceMappingURL=settings-account-panel-WXMDWVXY.js.map
