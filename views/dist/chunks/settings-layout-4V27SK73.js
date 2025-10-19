import {
  DEFAULT_KDF_SETTINGS,
  deriveKeyMaterial,
  encodePublicKey,
  encodeSalt,
  generateSalt,
  getPublicKey,
  normalizeKDFSettings,
  serializeKDFSettings
} from "./chunk-PEKSNMKL.js";
import {
  OWNER_SECRET_VERSION,
  UserSecrets,
  storage_default,
  x25519
} from "./chunk-H5HVRYHI.js";
import {
  arrayToB64,
  translate,
  translateElement
} from "./chunk-6DFT5NXM.js";
import "./chunk-IFG75HHC.js";

// src/ui/settings-layout.mjs
var SettingsLayout = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._categoryButtons = [];
    this._panels = /* @__PURE__ */ new Map();
    this._activeCategory = "password";
    this._boundCategoryClick = this._handleCategoryClick.bind(this);
    this._boundPasswordSubmit = this._handlePasswordSubmit.bind(this);
    this._passwordSubmitButton = null;
    this._passwordStatus = null;
    this._passwordForm = null;
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-layout");
      if (!template) {
        console.error("Template #settings-layout not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    this._cacheElements();
    translateElement(this);
    this._attachListeners();
    this._selectCategory(this._activeCategory);
  }
  disconnectedCallback() {
    this._detachListeners();
    this._categoryButtons = [];
    this._panels.clear();
  }
  _cacheElements() {
    const categoryList = this.querySelector('[data-role="category-list"]');
    if (categoryList) {
      this._categoryButtons = Array.from(
        categoryList.querySelectorAll("[data-category]")
      );
    }
    const panels = this.querySelectorAll("[data-panel]");
    this._panels = /* @__PURE__ */ new Map();
    panels.forEach((panel) => {
      this._panels.set(panel.getAttribute("data-panel"), panel);
    });
    this._passwordForm = this.querySelector('[data-panel="password"] form');
    this._passwordSubmitButton = this.querySelector('[data-role="password-submit"]');
    this._passwordStatus = this.querySelector('[data-role="password-status"]');
    this._passwordStatusIcon = this.querySelector('[data-role="password-status-icon"]');
    this._passwordStatusText = this.querySelector('[data-role="password-status-text"]');
  }
  _attachListeners() {
    this._categoryButtons.forEach((button) => {
      button.addEventListener("click", this._boundCategoryClick);
    });
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.addEventListener("click", this._boundPasswordSubmit);
    }
  }
  _detachListeners() {
    this._categoryButtons.forEach((button) => {
      button.removeEventListener("click", this._boundCategoryClick);
    });
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.removeEventListener("click", this._boundPasswordSubmit);
    }
  }
  _handleCategoryClick(event) {
    const category = event.currentTarget.getAttribute("data-category");
    if (category) {
      this._selectCategory(category);
    }
  }
  _selectCategory(category) {
    this._activeCategory = category;
    this._updateCategoryStyles();
    this._updatePanels();
  }
  _updateCategoryStyles() {
    this._categoryButtons.forEach((button) => {
      const isActive = button.getAttribute("data-category") === this._activeCategory;
      button.classList.toggle("border-primary", isActive);
      button.classList.toggle("bg-primary/10", isActive);
      button.classList.toggle("text-primary", isActive);
      button.classList.toggle("text-grey-70", !isActive);
      button.classList.toggle("dark:text-grey-30", !isActive);
      button.classList.toggle("border-transparent", !isActive);
    });
  }
  _updatePanels() {
    this._panels.forEach((panel, key) => {
      if (key === this._activeCategory) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });
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
        this._passwordStatusIcon.classList.add("ri-close-circle-fill", "text-red-600", "dark:text-red-400");
      }
    } else if (type === "success") {
      this._passwordStatus.classList.add("text-green-600", "dark:text-green-400");
      if (this._passwordStatusIcon) {
        this._passwordStatusIcon.classList.remove("hidden");
        this._passwordStatusIcon.classList.add("ri-check-line", "text-green-600", "dark:text-green-400");
      }
    } else {
      this._passwordStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._passwordStatusIcon) {
        this._passwordStatusIcon.classList.remove("hidden");
        this._passwordStatusIcon.classList.add("ri-information-line", "text-grey-60", "dark:text-grey-40");
      }
    }
  }
  async _handlePasswordSubmit(event) {
    var _a;
    event.preventDefault();
    if (!this._passwordForm) {
      return;
    }
    const currentInput = this._passwordForm.querySelector("#settings-current-password");
    const newInput = this._passwordForm.querySelector("#settings-new-password");
    const confirmInput = this._passwordForm.querySelector("#settings-confirm-password");
    const currentPassword = (currentInput == null ? void 0 : currentInput.value) || "";
    const newPassword = (newInput == null ? void 0 : newInput.value) || "";
    const confirmPassword = (confirmInput == null ? void 0 : confirmInput.value) || "";
    if (currentPassword.length < 10) {
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorCurrent"));
      return;
    }
    if (newPassword.length < 10) {
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorNewLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorMismatch"));
      return;
    }
    const userSecrets = storage_default.user;
    if (!userSecrets) {
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorNoSession"));
      return;
    }
    const saltBytes = userSecrets.getSaltBytes();
    if (!saltBytes || !saltBytes.length) {
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorMissingKeys"));
      return;
    }
    const storedSettings = userSecrets.settings || {};
    const kdfInput = storedSettings.kdf || storedSettings || DEFAULT_KDF_SETTINGS;
    const kdfSettings = normalizeKDFSettings(kdfInput);
    let derivedCurrent = null;
    let newMaterial = null;
    const newSaltBytes = generateSalt(kdfSettings.saltLength || DEFAULT_KDF_SETTINGS.saltLength);
    try {
      this._setPasswordStatus("info", translate("settingsPasswordStatusInfoDeriving"));
      derivedCurrent = await deriveKeyMaterial(currentPassword, saltBytes, kdfSettings);
      const derivedCurrentPublic = x25519.scalarMultBase(derivedCurrent.x25519Seed);
      const storedPublic = userSecrets.getX25519PublicKey();
      if (storedPublic && arrayToB64(derivedCurrentPublic) !== arrayToB64(storedPublic)) {
        this._setPasswordStatus("error", translate("settingsPasswordStatusErrorIncorrect"));
        derivedCurrent.edSeed.fill(0);
        derivedCurrent.x25519Seed.fill(0);
        return;
      }
      this._setPasswordStatus("info", translate("settingsPasswordStatusInfoPreparing"));
      newMaterial = await deriveKeyMaterial(newPassword, newSaltBytes, kdfSettings);
    } catch (err) {
      console.error("[SettingsLayout] Failed to derive key material", err);
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorDerive"));
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
      console.error("[SettingsLayout] Failed to compute public keys", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorPublicKeys"));
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
      console.error("[SettingsLayout] Failed to prepare new user secrets", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorUserSecrets"));
      return;
    }
    const fileUpdates = [];
    try {
      const files = storage_default.files || [];
      for (const ownedFile of files) {
        if (!(ownedFile == null ? void 0 : ownedFile.id) || !((_a = ownedFile.keychain) == null ? void 0 : _a.rawSecret)) {
          continue;
        }
        const wrap = await newUserSecrets.wrapSecret(ownedFile.keychain.rawSecret);
        fileUpdates.push({
          id: ownedFile.id,
          ciphertext: wrap.ciphertext,
          nonce: wrap.nonce,
          ephemeral_pub: wrap.ephemeralPublicKey,
          version: wrap.version || OWNER_SECRET_VERSION
        });
      }
    } catch (err) {
      console.error("[SettingsLayout] Failed to re-wrap secrets", err);
      if (newMaterial == null ? void 0 : newMaterial.edSeed) newMaterial.edSeed.fill(0);
      if (newMaterial == null ? void 0 : newMaterial.x25519Seed) newMaterial.x25519Seed.fill(0);
      this._setPasswordStatus("error", translate("settingsPasswordStatusErrorWrap"));
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
    this._setPasswordStatus("info", translate("settingsPasswordStatusInfoUpdating"));
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
        console.error("[SettingsLayout] Password reset failed", response.status, serverError);
        const message = serverError || translate("settingsPasswordStatusErrorRequest");
        throw new Error(message);
      }
      storage_default.setUser(newUserSecrets);
      this._setPasswordStatus("success", translate("settingsPasswordStatusSuccess"));
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
customElements.define("settings-layout", SettingsLayout);
//# sourceMappingURL=settings-layout-4V27SK73.js.map
