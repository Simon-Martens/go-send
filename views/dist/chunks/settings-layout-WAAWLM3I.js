import {
  DEFAULT_KDF_SETTINGS,
  deriveKeyMaterial,
  encodePublicKey,
  encodeSalt,
  generateSalt,
  getPublicKey,
  normalizeKDFSettings,
  serializeKDFSettings
} from "./chunk-RSYMEIED.js";
import {
  qrcode_default
} from "./chunk-U2YGIKKI.js";
import {
  OWNER_SECRET_VERSION,
  USER_ROLES,
  UserSecrets,
  storage_default,
  x25519
} from "./chunk-CZU3OPZQ.js";
import {
  arrayToB64,
  copyToClipboard,
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
    this._activeCategory = "account";
    this._boundCategoryClick = this._handleCategoryClick.bind(this);
    this._boundPasswordSubmit = this._handlePasswordSubmit.bind(this);
    this._boundProfileSubmit = this._handleProfileSubmit.bind(this);
    this._boundClearSessions = this._handleClearSessions.bind(this);
    this._boundDeactivateAccount = this._handleDeactivateAccount.bind(this);
    this._boundKeyCopy = this._handleAccountKeyCopy.bind(this);
    this._passwordSubmitButton = null;
    this._passwordStatus = null;
    this._passwordForm = null;
    this._passwordStatusIcon = null;
    this._passwordStatusText = null;
    this._profileForm = null;
    this._profileSubmitButton = null;
    this._profileStatus = null;
    this._profileStatusIcon = null;
    this._profileStatusText = null;
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
    this._usersNavItem = null;
    this._usersPanel = null;
    this._usersHeader = null;
    this._usersHeader = null;
    this._isAdmin = false;
    this._signupSections = /* @__PURE__ */ new Map();
    this._signupOverview = null;
    this._signupDetail = null;
    this._detailHeading = null;
    this._detailDescription = null;
    this._detailActiveCount = null;
    this._detailStatusEl = null;
    this._detailQrContainer = null;
    this._detailLinkInput = null;
    this._detailCopyButton = null;
    this._detailCopyIcon = null;
    this._detailBackButton = null;
    this._detailFootnote = null;
    this._activeDetailType = null;
    this._activeDetailExpiresAt = null;
    this._usersListSection = null;
    this._usersListStatus = null;
    this._usersListEmpty = null;
    this._usersTableBody = null;
    this._usersData = [];
    this._usersLoading = false;
    this._detailStatusIcon = null;
    this._detailStatusText = null;
    this._usersStatusIcon = null;
    this._usersStatusText = null;
    this._usersLoading = false;
    this._boundGenerateClick = this._handleGenerateClick.bind(this);
    this._boundRevokeClick = this._handleRevokeClick.bind(this);
    this._boundDetailBack = this._handleDetailBack.bind(this);
    this._boundDetailCopy = this._handleDetailCopy.bind(this);
    this._boundDetailLinkFocus = this._handleDetailLinkFocus.bind(this);
    this._boundUserAction = this._handleUserAction.bind(this);
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
    this._isAdmin = this._checkIsAdmin();
    this._cacheElements();
    this._configureAccess();
    translateElement(this);
    this._attachListeners();
    this._populateAccountForms();
    if (!this._isAdmin && this._activeCategory === "users") {
      this._activeCategory = "account";
    }
    this._selectCategory(this._activeCategory);
    if (this._isAdmin) {
      this._loadSignupOverview();
    }
  }
  disconnectedCallback() {
    this._detachListeners();
    this._categoryButtons = [];
    this._panels.clear();
    this._signupSections.clear();
    this._usersNavItem = null;
    this._usersPanel = null;
    this._isAdmin = false;
    this._signupOverview = null;
    this._signupDetail = null;
    this._detailHeading = null;
    this._detailDescription = null;
    this._detailActiveCount = null;
    this._detailStatusEl = null;
    this._detailStatusIcon = null;
    this._detailStatusText = null;
    this._detailQrContainer = null;
    this._detailLinkInput = null;
    this._detailCopyButton = null;
    this._detailCopyIcon = null;
    this._detailBackButton = null;
    this._detailFootnote = null;
    this._activeDetailType = null;
    this._activeDetailExpiresAt = null;
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
    this._usersListSection = null;
    this._usersListStatus = null;
    this._usersStatusIcon = null;
    this._usersStatusText = null;
    this._usersListEmpty = null;
    this._usersTableBody = null;
    this._usersData = [];
    this._usersLoading = false;
  }
  _cacheElements() {
    var _a, _b, _c, _d, _e;
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
    this._usersNavItem = this.querySelector('[data-role="users-nav"]');
    this._usersPanel = this._panels.get("users") || null;
    this._usersHeader = this.querySelector('[data-role="users-header"]');
    this._profileForm = this.querySelector('[data-role="profile-form"]');
    this._profileSubmitButton = this.querySelector('[data-role="profile-submit"]');
    this._profileStatus = this.querySelector('[data-role="profile-status"]');
    this._profileStatusIcon = this.querySelector('[data-role="profile-status-icon"]');
    this._profileStatusText = this.querySelector('[data-role="profile-status-text"]');
    this._passwordForm = this.querySelector('[data-role="password-form"]');
    this._passwordSubmitButton = this.querySelector('[data-role="password-submit"]');
    this._passwordStatus = this.querySelector('[data-role="password-status"]');
    this._passwordStatusIcon = this.querySelector('[data-role="password-status-icon"]');
    this._passwordStatusText = this.querySelector('[data-role="password-status-text"]');
    this._accountStatus = this.querySelector('[data-role="account-status"]');
    this._accountStatusIcon = this.querySelector('[data-role="account-status-icon"]');
    this._accountStatusText = this.querySelector('[data-role="account-status-text"]');
    this._clearSessionsButton = this.querySelector('[data-role="account-clear-sessions"]');
    this._deactivateAccountButton = this.querySelector('[data-role="account-deactivate"]');
    this._accountKeyValue = this.querySelector('[data-role="account-key-value"]');
    this._accountKeyCopyButton = this.querySelector('[data-role="account-key-copy"]');
    this._accountKeyStatus = this.querySelector('[data-role="account-key-status"]');
    this._accountKeyStatusIcon = this.querySelector('[data-role="account-key-status-icon"]');
    this._accountKeyStatusText = this.querySelector('[data-role="account-key-status-text"]');
    this._signupOverview = this.querySelector('[data-role="signup-overview"]');
    this._signupDetail = this.querySelector('[data-role="signup-detail"]');
    this._detailHeading = this.querySelector('[data-role="detail-heading"]');
    this._detailDescription = this.querySelector('[data-role="detail-description"]');
    this._detailActiveCount = this.querySelector('[data-role="detail-active-count"]');
    this._detailStatusEl = this.querySelector('[data-role="detail-status"]');
    this._detailStatusIcon = this.querySelector('[data-role="detail-status-icon"]');
    this._detailStatusText = this.querySelector('[data-role="detail-status-text"]');
    this._detailQrContainer = this.querySelector('[data-role="detail-qr"]');
    this._detailLinkInput = this.querySelector('[data-role="detail-link"]');
    this._detailCopyButton = this.querySelector('[data-role="detail-copy"]');
    this._detailCopyIcon = this.querySelector('[data-role="detail-copy-icon"]');
    this._detailBackButton = this.querySelector('[data-role="detail-back"]');
    this._detailFootnote = this.querySelector('[data-role="detail-footnote"]');
    this._usersListSection = this.querySelector('[data-role="users-list"]');
    this._usersListStatus = ((_a = this._usersListSection) == null ? void 0 : _a.querySelector('[data-role="users-list-status"]')) || null;
    this._usersStatusIcon = ((_b = this._usersListSection) == null ? void 0 : _b.querySelector('[data-role="users-list-status-icon"]')) || null;
    this._usersStatusText = ((_c = this._usersListSection) == null ? void 0 : _c.querySelector('[data-role="users-list-status-text"]')) || null;
    this._usersListEmpty = ((_d = this._usersListSection) == null ? void 0 : _d.querySelector('[data-role="users-list-empty"]')) || null;
    this._usersTableBody = ((_e = this._usersListSection) == null ? void 0 : _e.querySelector('[data-role="users-table-body"]')) || null;
  }
  _attachListeners() {
    this._categoryButtons.forEach((button) => {
      button.addEventListener("click", this._boundCategoryClick);
    });
    if (this._profileSubmitButton) {
      this._profileSubmitButton.addEventListener("click", this._boundProfileSubmit);
    }
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.addEventListener("click", this._boundPasswordSubmit);
    }
    if (this._clearSessionsButton) {
      this._clearSessionsButton.addEventListener("click", this._boundClearSessions);
    }
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.addEventListener("click", this._boundDeactivateAccount);
    }
    if (this._accountKeyCopyButton) {
      this._accountKeyCopyButton.addEventListener("click", this._boundKeyCopy);
    }
    if (this._isAdmin) {
      this._signupSections.forEach((section) => {
        if (section.generateButton) {
          section.generateButton.addEventListener("click", this._boundGenerateClick);
        }
        if (section.revokeButton) {
          section.revokeButton.addEventListener("click", this._boundRevokeClick);
        }
      });
      if (this._detailCopyButton) {
        this._detailCopyButton.addEventListener("click", this._boundDetailCopy);
      }
      if (this._detailLinkInput) {
        this._detailLinkInput.addEventListener("focus", this._boundDetailLinkFocus);
        this._detailLinkInput.addEventListener("click", this._boundDetailLinkFocus);
      }
      if (this._detailBackButton) {
        this._detailBackButton.addEventListener("click", this._boundDetailBack);
      }
      if (this._usersTableBody) {
        this._usersTableBody.addEventListener("click", this._boundUserAction);
      }
    }
  }
  _detachListeners() {
    this._categoryButtons.forEach((button) => {
      button.removeEventListener("click", this._boundCategoryClick);
    });
    if (this._profileSubmitButton) {
      this._profileSubmitButton.removeEventListener("click", this._boundProfileSubmit);
    }
    if (this._passwordSubmitButton) {
      this._passwordSubmitButton.removeEventListener("click", this._boundPasswordSubmit);
    }
    if (this._clearSessionsButton) {
      this._clearSessionsButton.removeEventListener("click", this._boundClearSessions);
    }
    if (this._deactivateAccountButton) {
      this._deactivateAccountButton.removeEventListener("click", this._boundDeactivateAccount);
    }
    if (this._accountKeyCopyButton) {
      this._accountKeyCopyButton.removeEventListener("click", this._boundKeyCopy);
    }
    if (this._isAdmin) {
      this._signupSections.forEach((section) => {
        if (section.generateButton) {
          section.generateButton.removeEventListener("click", this._boundGenerateClick);
        }
        if (section.revokeButton) {
          section.revokeButton.removeEventListener("click", this._boundRevokeClick);
        }
      });
      if (this._detailCopyButton) {
        this._detailCopyButton.removeEventListener("click", this._boundDetailCopy);
      }
      if (this._detailLinkInput) {
        this._detailLinkInput.removeEventListener("focus", this._boundDetailLinkFocus);
        this._detailLinkInput.removeEventListener("click", this._boundDetailLinkFocus);
      }
      if (this._detailBackButton) {
        this._detailBackButton.removeEventListener("click", this._boundDetailBack);
      }
      if (this._usersTableBody) {
        this._usersTableBody.removeEventListener("click", this._boundUserAction);
      }
    }
  }
  _checkIsAdmin() {
    const user = storage_default.user;
    if (!user || user.role === void 0 || user.role === null) {
      return false;
    }
    const role = user.role;
    if (typeof role === "number") {
      return role === USER_ROLES.ADMIN;
    }
    if (typeof role === "string") {
      const trimmed = role.trim();
      if (!trimmed) {
        return false;
      }
      const asNumber = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(asNumber)) {
        return asNumber === USER_ROLES.ADMIN;
      }
      return trimmed.toLowerCase() === "admin";
    }
    return false;
  }
  _configureAccess() {
    if (this._isAdmin) {
      if (this._usersNavItem) {
        this._usersNavItem.classList.remove("hidden");
      }
      this._initSignupSections();
      if (this._usersListSection) {
        this._usersListSection.classList.remove("hidden");
      }
      this._loadUsers();
    } else {
      if (this._usersNavItem) {
        this._usersNavItem.classList.add("hidden");
      }
      if (this._usersPanel) {
        this._usersPanel.classList.add("hidden");
      }
      this._signupSections.clear();
      if (this._usersListSection) {
        this._usersListSection.classList.add("hidden");
      }
      this._usersData = [];
      this._renderUsers();
    }
  }
  _populateAccountForms() {
    var _a, _b;
    const userSecrets = storage_default.user;
    if (!userSecrets) {
      return;
    }
    const nameInput = (_a = this._profileForm) == null ? void 0 : _a.querySelector("#settings-account-name");
    if (nameInput) {
      nameInput.value = userSecrets.name || "";
    }
    const emailInput = (_b = this._profileForm) == null ? void 0 : _b.querySelector("#settings-account-email");
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
      this._accountKeyValue.textContent = translate("settingsAccountKeyUnavailable");
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
  _initSignupSections() {
    this._signupSections.clear();
    const cards = this.querySelectorAll('[data-role="signup-card"]');
    cards.forEach((card) => {
      const type = card.getAttribute("data-token-type");
      if (!type) {
        return;
      }
      const normalized = type.toLowerCase();
      const section = {
        container: card,
        countEl: card.querySelector('[data-role="active-count"]'),
        generateButton: card.querySelector('[data-role="generate"]'),
        revokeButton: card.querySelector('[data-role="revoke"]'),
        statusEl: card.querySelector('[data-role="status"]')
      };
      this._signupSections.set(normalized, section);
      this._setSectionStatus(normalized, "");
    });
  }
  _getSignupSection(type) {
    if (!type) {
      return null;
    }
    return this._signupSections.get(type.toLowerCase()) || null;
  }
  _setSignupCount(type, count) {
    const section = this._getSignupSection(type);
    if (!section || !section.countEl) {
      return;
    }
    const value = Number.isFinite(count) ? count : 0;
    section.countEl.textContent = String(value);
    if (this._activeDetailType === type && this._detailActiveCount) {
      this._detailActiveCount.textContent = String(value);
    }
  }
  _setSectionStatus(type, message, variant = "info") {
    const section = this._getSignupSection(type);
    if (!section || !section.statusEl) {
      return;
    }
    const statusEl = section.statusEl;
    const text = message || "";
    statusEl.textContent = text;
    statusEl.classList.remove(
      "text-grey-60",
      "dark:text-grey-40",
      "text-green-600",
      "dark:text-green-400",
      "text-red-600",
      "dark:text-red-400"
    );
    if (!text) {
      statusEl.classList.add("text-grey-60", "dark:text-grey-40");
      return;
    }
    if (variant === "success") {
      statusEl.classList.add("text-green-600", "dark:text-green-400");
    } else if (variant === "error") {
      statusEl.classList.add("text-red-600", "dark:text-red-400");
    } else {
      statusEl.classList.add("text-grey-60", "dark:text-grey-40");
    }
  }
  _setDetailStatus(message, variant = "info") {
    if (!this._detailStatusEl) {
      return;
    }
    const baseClass = "text-sm flex items-center gap-2 min-h-[1.25rem]";
    this._detailStatusEl.className = `${baseClass} text-grey-60 dark:text-grey-40`;
    if (this._detailStatusText) {
      this._detailStatusText.textContent = message || "";
    } else {
      this._detailStatusEl.textContent = message || "";
    }
    if (this._detailStatusIcon) {
      this._detailStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    let iconClass = "ri-information-line text-grey-60 dark:text-grey-40";
    if (variant === "success") {
      this._detailStatusEl.className = `${baseClass} text-green-600 dark:text-green-400`;
      iconClass = "ri-check-line text-green-600 dark:text-green-400";
    } else if (variant === "error") {
      this._detailStatusEl.className = `${baseClass} text-red-600 dark:text-red-400`;
      iconClass = "ri-error-warning-line text-red-600 dark:text-red-400";
    }
    if (this._detailStatusIcon) {
      this._detailStatusIcon.className = iconClass;
    }
  }
  _setSectionLoading(section, isLoading) {
    if (!section) {
      return;
    }
    const disabled = Boolean(isLoading);
    if (section.generateButton) {
      section.generateButton.disabled = disabled;
      section.generateButton.classList.toggle("opacity-60", disabled);
    }
    if (section.revokeButton) {
      section.revokeButton.disabled = disabled;
      section.revokeButton.classList.toggle("opacity-60", disabled);
    }
  }
  _showSignupDetail(type, link, expiresAtSeconds) {
    if (!this._signupDetail || !this._signupOverview) {
      return;
    }
    this._activeDetailType = type;
    this._activeDetailExpiresAt = expiresAtSeconds || null;
    const headingKey = type === "admin" ? "settingsUsersDetailHeadingAdmin" : "settingsUsersDetailHeadingUser";
    if (this._detailHeading) {
      this._detailHeading.textContent = translate(headingKey);
    }
    const expiresText = this._formatExpiry(expiresAtSeconds);
    if (this._detailDescription) {
      this._detailDescription.textContent = translate("settingsUsersDetailDescription", {
        date: expiresText
      });
    }
    if (this._detailActiveCount) {
      const section = this._getSignupSection(type);
      const count = (section == null ? void 0 : section.countEl) ? Number(section.countEl.textContent || 0) : 0;
      this._detailActiveCount.textContent = String(count);
    }
    if (this._detailFootnote) {
      this._detailFootnote.textContent = translate("settingsUsersDetailFootnote");
    }
    this._setDetailStatus("");
    if (this._detailLinkInput) {
      this._detailLinkInput.value = link || "";
      requestAnimationFrame(() => {
        this._detailLinkInput.select();
        this._detailLinkInput.focus();
      });
    }
    if (this._detailQrContainer) {
      this._renderQRCode(this._detailQrContainer, link);
    }
    if (this._detailCopyIcon) {
      const original = this._detailCopyIcon.dataset.originalClass || this._detailCopyIcon.className;
      this._detailCopyIcon.dataset.originalClass = original;
      this._detailCopyIcon.className = original;
    }
    this._signupOverview.classList.add("hidden");
    this._signupDetail.classList.remove("hidden");
    if (this._usersHeader) {
      this._usersHeader.classList.add("hidden");
    }
    if (this._usersListSection) {
      this._usersListSection.classList.add("hidden");
    }
  }
  _clearSignupDetail() {
    if (!this._signupDetail || !this._signupOverview) {
      return;
    }
    this._activeDetailType = null;
    this._activeDetailExpiresAt = null;
    if (this._detailLinkInput) {
      this._detailLinkInput.value = "";
    }
    if (this._detailQrContainer) {
      this._detailQrContainer.innerHTML = "";
    }
    if (this._detailCopyIcon && this._detailCopyIcon.dataset.originalClass) {
      this._detailCopyIcon.className = this._detailCopyIcon.dataset.originalClass;
    }
    this._setDetailStatus("");
    this._signupDetail.classList.add("hidden");
    this._signupOverview.classList.remove("hidden");
    if (this._usersHeader) {
      this._usersHeader.classList.remove("hidden");
    }
    if (this._usersListSection) {
      this._usersListSection.classList.remove("hidden");
    }
  }
  _renderQRCode(container, value) {
    if (!container) {
      return;
    }
    if (!value) {
      container.innerHTML = "";
      return;
    }
    try {
      const qr = qrcode_default(0, "L");
      qr.addData(value);
      qr.make();
      container.innerHTML = qr.createSvgTag({
        scalable: true,
        cellSize: 4,
        margin: 4
      });
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        svgEl.style.maxWidth = "200px";
        svgEl.style.height = "auto";
      }
    } catch (error) {
      console.error("[SettingsLayout] QR generation failed", error);
      container.innerHTML = `<p class="text-sm text-grey-60 dark:text-grey-40 text-center">${translate("settingsUsersQrError")}</p>`;
    }
  }
  _setUsersStatus(message, variant = "info") {
    if (!this._usersListStatus) {
      return;
    }
    const baseClass = "text-sm flex items-center gap-2 min-h-[1.25rem]";
    this._usersListStatus.className = `${baseClass} text-grey-60 dark:text-grey-40`;
    if (this._usersStatusText) {
      this._usersStatusText.textContent = message || "";
    } else {
      this._usersListStatus.textContent = message || "";
    }
    if (this._usersStatusIcon) {
      this._usersStatusIcon.className = "hidden";
    }
    if (!message) {
      return;
    }
    let iconClass = "ri-information-line text-grey-60 dark:text-grey-40";
    if (variant === "success") {
      this._usersListStatus.className = `${baseClass} text-green-600 dark:text-green-400`;
      iconClass = "ri-check-line text-green-600 dark:text-green-400";
    } else if (variant === "error") {
      this._usersListStatus.className = `${baseClass} text-red-600 dark:text-red-400`;
      iconClass = "ri-error-warning-line text-red-600 dark:text-red-400";
    }
    if (this._usersStatusIcon) {
      this._usersStatusIcon.className = iconClass;
    }
  }
  async _loadUsers() {
    if (!this._isAdmin || !this._usersListSection) {
      return;
    }
    if (this._usersLoading) {
      return;
    }
    this._usersLoading = true;
    this._setUsersStatus(translate("settingsUsersListLoading"), "info");
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`users_list_failed_${response.status}`);
      }
      const payload = await response.json();
      const list = Array.isArray(payload == null ? void 0 : payload.users) ? payload.users : [];
      this._usersData = list.map((user) => ({
        id: Number.parseInt(user.id, 10) || user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        active: Boolean(user.active),
        public_key: user.public_key || "",
        encryption_public_key: user.encryption_public_key || "",
        active_sessions: Number.isFinite(user.active_sessions) ? user.active_sessions : Number.parseInt(user.active_sessions ?? 0, 10) || 0,
        is_current_user: Boolean(user.is_current_user),
        created: user.created || 0,
        updated: user.updated || 0
      }));
      this._renderUsers();
      this._setUsersStatus("", "info");
    } catch (error) {
      console.error("[SettingsLayout] Failed to load users", error);
      this._setUsersStatus(translate("settingsUsersListError"), "error");
    } finally {
      this._usersLoading = false;
    }
  }
  _renderUsers() {
    if (!this._usersTableBody) {
      return;
    }
    if (!Array.isArray(this._usersData) || !this._usersData.length) {
      this._usersTableBody.innerHTML = "";
      if (this._usersListEmpty) {
        this._usersListEmpty.classList.remove("hidden");
      }
      return;
    }
    if (this._usersListEmpty) {
      this._usersListEmpty.classList.add("hidden");
    }
    const rows = this._usersData.map((user) => this._renderUserRow(user)).join("");
    this._usersTableBody.innerHTML = rows;
  }
  _renderUserRow(user) {
    var _a;
    const displayName = this._getDisplayName(user);
    const roleLabel = this._formatUserRole(user.role);
    const statusLabel = this._formatUserStatus(user.active);
    const statusClass = user.active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    const emailText = ((_a = user.email) == null ? void 0 : _a.trim()) || "";
    const signingKeyTitle = (user.public_key || "").trim();
    const encryptionKeyTitle = (user.encryption_public_key || "").trim();
    const signingKey = this._formatKey(signingKeyTitle);
    const encryptionKey = this._formatKey(encryptionKeyTitle);
    const clearDisabled = user.active_sessions === 0;
    const deleteDisabled = user.is_current_user;
    const clearButtonLabel = translate("settingsUsersActionClearSessions");
    const deleteButtonLabel = translate("settingsUsersActionDelete");
    const signingLabel = translate("settingsUsersKeySigning");
    const encryptionLabel = translate("settingsUsersKeyEncryption");
    const baseButtonClass = "inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
    const clearButtonClass = `${baseButtonClass} text-grey-80 dark:text-grey-20 border-grey-30 dark:border-grey-60 bg-grey-5 dark:bg-grey-80/40 hover:bg-grey-10 dark:hover:bg-grey-70`;
    const deleteButtonClass = `${baseButtonClass} text-red-600 dark:text-red-400 border-red-200 dark:border-red-400/40 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30`;
    const deactivateButtonClass = `${baseButtonClass} text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-400/40 bg-yellow-50/60 dark:bg-yellow-900/20 hover:bg-yellow-50 dark:hover:bg-yellow-900/30`;
    const activateButtonClass = `${baseButtonClass} text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/40 bg-green-50/60 dark:bg-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/30`;
    const toggleAction = user.active ? "deactivate" : "activate";
    const toggleButtonLabel = user.active ? translate("settingsUsersActionDeactivate") : translate("settingsUsersActionActivate");
    const toggleIcon = user.active ? "ri-user-unfollow-line" : "ri-user-follow-line";
    const toggleDisabled = user.active && user.is_current_user;
    const toggleDisabledTitle = toggleDisabled ? ` title="${this._escapeHTML(translate("settingsUsersActionDeactivateSelfError"))}"` : "";
    const detailTags = [];
    if (roleLabel) {
      detailTags.push(`<span>${this._escapeHTML(roleLabel)}</span>`);
    }
    if (statusLabel) {
      detailTags.push(`<span class="${statusClass}">${this._escapeHTML(statusLabel)}</span>`);
    }
    if (user.is_current_user) {
      const youLabel = translate("settingsUsersCurrentUserLabel");
      detailTags.push(`<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">${this._escapeHTML(youLabel)}</span>`);
    }
    const metaParts = detailTags.filter(Boolean).join(" \xB7 ");
    const signingTitleAttr = signingKeyTitle ? ` title="${this._escapeHTML(signingKeyTitle)}"` : "";
    const encryptionTitleAttr = encryptionKeyTitle ? ` title="${this._escapeHTML(encryptionKeyTitle)}"` : "";
    const clearDisabledTitle = clearDisabled ? ` title="${this._escapeHTML(translate("settingsUsersActionClearDisabledTooltip"))}"` : "";
    const deleteDisabledTitle = deleteDisabled ? ` title="${this._escapeHTML(translate("settingsUsersActionDeleteSelfTooltip"))}"` : "";
    const toggleAriaAttr = ` aria-label="${this._escapeHTML(toggleButtonLabel)}"`;
    const clearAriaAttr = ` aria-label="${this._escapeHTML(clearButtonLabel)}"`;
    const deleteAriaAttr = ` aria-label="${this._escapeHTML(deleteButtonLabel)}"`;
    const toggleDisabledAttr = toggleDisabled ? " disabled" : "";
    const clearDisabledAttr = clearDisabled ? " disabled" : "";
    const deleteDisabledAttr = deleteDisabled ? " disabled" : "";
    const clearButtonContent = `<i class="ri-refresh-line text-base leading-4" aria-hidden="true"></i>`;
    const deleteButtonContent = `<i class="ri-delete-bin-6-line text-base leading-4" aria-hidden="true"></i>`;
    const toggleButtonContent = `<i class="${toggleIcon} text-base leading-4" aria-hidden="true"></i>`;
    const copyButtonClass = "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-grey-30 dark:border-grey-60 bg-white dark:bg-grey-80 text-grey-60 dark:text-grey-30 hover:text-primary hover:bg-grey-10 dark:hover:bg-grey-70 focus:outline focus:outline-2 focus:outline-primary transition cursor-pointer";
    const copyButtonIconClass = "ri-file-copy-2-line text-base leading-4";
    const copyActionLabel = translate("copyLinkButton");
    const signingCopyLabel = `${copyActionLabel} \u2013 ${translate("settingsUsersKeySigning")}`;
    const encryptionCopyLabel = `${copyActionLabel} \u2013 ${translate("settingsUsersKeyEncryption")}`;
    const signingCopyButton = signingKeyTitle ? `<button type="button" class="${copyButtonClass}" data-user-action="copy-key" data-user-id="${user.id}" data-key-value="${this._escapeHTML(signingKeyTitle)}" aria-label="${this._escapeHTML(signingCopyLabel)}" title="${this._escapeHTML(signingCopyLabel)}"><i class="${copyButtonIconClass}" aria-hidden="true"></i><span class="sr-only">${this._escapeHTML(signingCopyLabel)}</span></button>` : "";
    const encryptionCopyButton = encryptionKeyTitle ? `<button type="button" class="${copyButtonClass}" data-user-action="copy-key" data-user-id="${user.id}" data-key-value="${this._escapeHTML(encryptionKeyTitle)}" aria-label="${this._escapeHTML(encryptionCopyLabel)}" title="${this._escapeHTML(encryptionCopyLabel)}"><i class="${copyButtonIconClass}" aria-hidden="true"></i><span class="sr-only">${this._escapeHTML(encryptionCopyLabel)}</span></button>` : "";
    const toggleButtonClass = user.active ? deactivateButtonClass : activateButtonClass;
    return `
      <tr class="align-top">
        <td class="px-4 py-4">
          <div class="font-medium text-grey-90 dark:text-grey-10">${this._escapeHTML(displayName)}</div>
          <div class="text-xs text-grey-60 dark:text-grey-40 mt-1">${metaParts || ""}</div>
        </td>
        <td class="px-4 py-4 text-sm text-grey-80 dark:text-grey-20">${emailText ? this._escapeHTML(emailText) : "\u2014"}</td>
        <td class="px-4 py-4 text-sm">
          <div class="space-y-3">
            <div class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wide text-grey-60 dark:text-grey-40">${this._escapeHTML(signingLabel)}</span>
              <div class="flex items-center gap-2 min-w-0">
                <code class="flex-1 min-w-0 font-mono text-xs text-grey-80 dark:text-grey-20 whitespace-nowrap overflow-hidden text-ellipsis"${signingTitleAttr}>${this._escapeHTML(signingKey)}</code>
                ${signingCopyButton}
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wide text-grey-60 dark:text-grey-40">${this._escapeHTML(encryptionLabel)}</span>
              <div class="flex items-center gap-2 min-w-0">
                <code class="flex-1 min-w-0 font-mono text-xs text-grey-80 dark:text-grey-20 whitespace-nowrap overflow-hidden text-ellipsis"${encryptionTitleAttr}>${this._escapeHTML(encryptionKey)}</code>
                ${encryptionCopyButton}
              </div>
            </div>
          </div>
        </td>
        <td class="px-4 py-4 text-sm text-grey-80 dark:text-grey-20">${Number.isFinite(user.active_sessions) ? user.active_sessions : 0}</td>
        <td class="px-4 py-4">
          <div class="flex items-center gap-2">
            <button type="button" class="${toggleButtonClass}" data-user-action="${toggleAction}" data-user-id="${user.id}"${toggleAriaAttr}${toggleDisabledAttr}${toggleDisabledTitle}>${toggleButtonContent}</button>
            <button type="button" class="${clearButtonClass}" data-user-action="clear-sessions" data-user-id="${user.id}"${clearAriaAttr}${clearDisabledAttr}${clearDisabledTitle}>${clearButtonContent}</button>
            <button type="button" class="${deleteButtonClass}" data-user-action="delete" data-user-id="${user.id}"${deleteAriaAttr}${deleteDisabledAttr}${deleteDisabledTitle}>${deleteButtonContent}</button>
          </div>
        </td>
      </tr>
    `;
  }
  _getDisplayName(user) {
    var _a, _b;
    if (!user) {
      return translate("settingsUsersNameFallback");
    }
    const name = (_a = user.name) == null ? void 0 : _a.trim();
    if (name) {
      return name;
    }
    const email = (_b = user.email) == null ? void 0 : _b.trim();
    if (email) {
      return email;
    }
    return translate("settingsUsersNameFallback");
  }
  _formatUserRole(role) {
    const normalized = (role || "").toString().toLowerCase();
    if (normalized === "admin") {
      return translate("settingsUsersRoleAdmin");
    }
    if (normalized === "user") {
      return translate("settingsUsersRoleUser");
    }
    if (normalized === "guest") {
      return translate("settingsUsersRoleGuest");
    }
    return translate("settingsUsersRoleUnknown");
  }
  _formatUserStatus(active) {
    return active ? translate("settingsUsersStatusActive") : translate("settingsUsersStatusInactive");
  }
  _formatKey(key) {
    const value = (key || "").trim();
    if (!value) {
      return translate("settingsUsersKeyMissing");
    }
    if (value.length <= 36) {
      return value;
    }
    return `${value.slice(0, 20)}\u2026${value.slice(-10)}`;
  }
  _escapeHTML(str) {
    if (str == null) {
      return "";
    }
    return String(str).replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });
  }
  async _handleUserAction(event) {
    const button = event.target.closest("[data-user-action]");
    if (!button || button.disabled) {
      return;
    }
    const action = button.getAttribute("data-user-action");
    const idAttr = button.getAttribute("data-user-id");
    const userID = Number.parseInt(idAttr || "", 10);
    if (!Number.isFinite(userID)) {
      return;
    }
    const user = this._usersData.find((item) => item.id === userID);
    if (!user) {
      return;
    }
    if (action === "copy-key") {
      event.preventDefault();
      const value = button.getAttribute("data-key-value") || "";
      if (!value) {
        this._setUsersStatus(translate("settingsUsersCopyError"), "error");
        return;
      }
      const success = copyToClipboard(value);
      if (success) {
        this._setUsersStatus(translate("settingsUsersCopySuccess"), "success");
        const icon = button.querySelector("i");
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
        this._setUsersStatus(translate("settingsUsersCopyError"), "error");
      }
      return;
    }
    const displayName = this._getDisplayName(user);
    if (action === "deactivate") {
      if (user.is_current_user) {
        this._setUsersStatus(translate("settingsUsersActionDeactivateSelfError"), "error");
        return;
      }
      this._setUsersStatus(translate("settingsUsersActionDeactivateWorking"), "info");
      let succeeded = false;
      this._setButtonLoading(button, "ri-loader-4-line", translate("settingsUsersActionDeactivateWorking"));
      try {
        const response = await fetch(`/api/admin/users/${userID}/deactivate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`deactivate_user_failed_${response.status}`);
        }
        succeeded = true;
        await this._loadUsers();
        this._setUsersStatus(translate("settingsUsersActionDeactivateSuccess", { name: displayName }), "success");
      } catch (error) {
        console.error("[SettingsLayout] Failed to deactivate user", error);
        this._setUsersStatus(translate("settingsUsersActionDeactivateError"), "error");
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
      return;
    }
    if (action === "activate") {
      this._setUsersStatus(translate("settingsUsersActionActivateWorking"), "info");
      let succeeded = false;
      this._setButtonLoading(button, "ri-loader-4-line", translate("settingsUsersActionActivateWorking"));
      try {
        const response = await fetch(`/api/admin/users/${userID}/activate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`activate_user_failed_${response.status}`);
        }
        succeeded = true;
        await this._loadUsers();
        this._setUsersStatus(translate("settingsUsersActionActivateSuccess", { name: displayName }), "success");
      } catch (error) {
        console.error("[SettingsLayout] Failed to activate user", error);
        this._setUsersStatus(translate("settingsUsersActionActivateError"), "error");
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
      return;
    }
    if (action === "clear-sessions") {
      if (user.active_sessions === 0) {
        return;
      }
      this._setUsersStatus(translate("settingsUsersActionClearWorking"), "info");
      let succeeded = false;
      this._setButtonLoading(button, "ri-loader-4-line", translate("settingsUsersActionClearWorking"));
      try {
        const response = await fetch(`/api/admin/users/${userID}/clear-sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`clear_sessions_failed_${response.status}`);
        }
        user.active_sessions = 0;
        succeeded = true;
        await this._loadUsers();
        if (user.is_current_user) {
          window.location.assign("/login");
          return;
        }
        this._setUsersStatus(translate("settingsUsersActionClearSuccess", { name: displayName }), "success");
      } catch (error) {
        console.error("[SettingsLayout] Failed to clear sessions", error);
        this._setUsersStatus(translate("settingsUsersActionClearError"), "error");
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
      return;
    }
    if (action === "delete") {
      if (user.is_current_user) {
        this._setUsersStatus(translate("settingsUsersActionDeleteSelfError"), "error");
        return;
      }
      const confirmed = window.confirm(translate("settingsUsersActionDeleteConfirm", { name: displayName }));
      if (!confirmed) {
        return;
      }
      this._setUsersStatus(translate("settingsUsersActionDeleteWorking"), "info");
      let succeeded = false;
      this._setButtonLoading(button, "ri-loader-4-line", translate("settingsUsersActionDeleteWorking"));
      try {
        const response = await fetch(`/api/admin/users/${userID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`delete_user_failed_${response.status}`);
        }
        succeeded = true;
        await this._loadUsers();
        this._setUsersStatus(translate("settingsUsersActionDeleteSuccess", { name: displayName }), "success");
      } catch (error) {
        console.error("[SettingsLayout] Failed to delete user", error);
        this._setUsersStatus(translate("settingsUsersActionDeleteError"), "error");
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
    }
  }
  _setButtonLoading(button, iconClass, text) {
    if (!button) {
      return;
    }
    if (!button.dataset.originalContent) {
      button.dataset.originalContent = button.innerHTML;
    }
    if (!button.dataset.originalAriaLabel) {
      button.dataset.originalAriaLabel = button.getAttribute("aria-label") || "";
    }
    const icon = iconClass ? `<i class="${iconClass} text-base leading-4 animate-spin" aria-hidden="true"></i>` : "";
    button.innerHTML = icon || "";
    if (text) {
      button.setAttribute("aria-label", text);
    }
    button.setAttribute("aria-busy", "true");
    button.disabled = true;
    button.classList.add("opacity-60");
  }
  _restoreButton(button) {
    if (!button || !button.dataset.originalContent) {
      return;
    }
    button.innerHTML = button.dataset.originalContent;
    if (button.dataset.originalAriaLabel !== void 0) {
      if (button.dataset.originalAriaLabel) {
        button.setAttribute("aria-label", button.dataset.originalAriaLabel);
      } else {
        button.removeAttribute("aria-label");
      }
      delete button.dataset.originalAriaLabel;
    }
    button.removeAttribute("aria-busy");
    button.disabled = false;
    button.classList.remove("opacity-60");
    delete button.dataset.originalContent;
  }
  async _handleGenerateClick(event) {
    var _a;
    event.preventDefault();
    const button = event.currentTarget;
    const type = ((_a = button == null ? void 0 : button.getAttribute("data-token-type")) == null ? void 0 : _a.toLowerCase()) || "admin";
    const section = this._getSignupSection(type);
    if (!section) {
      return;
    }
    this._setSectionStatus(type, translate("settingsUsersGenerating"), "info");
    this._setSectionLoading(section, true);
    try {
      const response = await fetch("/api/admin/signup-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type })
      });
      if (!response.ok) {
        throw new Error(`generate_failed_${response.status}`);
      }
      const data = await response.json();
      if (typeof data.active_count === "number") {
        this._setSignupCount(type, data.active_count);
      }
      const expiresAt = typeof data.expires_at === "number" ? data.expires_at : Number(data.expires_at || 0);
      if (typeof data.link === "string") {
        this._showSignupDetail(type, data.link, expiresAt);
        this._setDetailStatus(translate("settingsUsersGenerateSuccess"), "success");
      }
      this._setSectionStatus(type, translate("settingsUsersGenerateSuccess"), "success");
    } catch (error) {
      console.error("[SettingsLayout] Failed to create signup link", error);
      this._setSectionStatus(type, translate("settingsUsersGenerateError"), "error");
      if (this._activeDetailType === type) {
        this._setDetailStatus(translate("settingsUsersGenerateError"), "error");
      }
    } finally {
      this._setSectionLoading(section, false);
    }
  }
  async _handleRevokeClick(event) {
    var _a;
    event.preventDefault();
    const button = event.currentTarget;
    const type = ((_a = button == null ? void 0 : button.getAttribute("data-token-type")) == null ? void 0 : _a.toLowerCase()) || "admin";
    const section = this._getSignupSection(type);
    if (!section) {
      return;
    }
    this._setSectionStatus(type, translate("settingsUsersRevoking"), "info");
    this._setSectionLoading(section, true);
    try {
      const response = await fetch(`/api/admin/signup-links?type=${encodeURIComponent(type)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`revoke_failed_${response.status}`);
      }
      const data = await response.json();
      if (typeof data.active_count === "number") {
        this._setSignupCount(type, data.active_count);
      } else {
        this._setSignupCount(type, 0);
      }
      if (this._activeDetailType === type) {
        this._clearSignupDetail();
      }
      this._setSectionStatus(type, translate("settingsUsersRevokeSuccess"), "success");
    } catch (error) {
      console.error("[SettingsLayout] Failed to revoke signup links", error);
      this._setSectionStatus(type, translate("settingsUsersRevokeError"), "error");
      if (this._activeDetailType === type) {
        this._setDetailStatus(translate("settingsUsersRevokeError"), "error");
      }
    } finally {
      this._setSectionLoading(section, false);
    }
  }
  _handleDetailBack(event) {
    event.preventDefault();
    this._clearSignupDetail();
  }
  _handleDetailCopy(event) {
    event.preventDefault();
    if (!this._detailLinkInput) {
      return;
    }
    const value = this._detailLinkInput.value;
    if (!value) {
      return;
    }
    const success = copyToClipboard(value);
    if (success) {
      this._setDetailStatus(translate("settingsUsersDetailCopySuccess"), "success");
      if (this._detailCopyIcon) {
        const original = this._detailCopyIcon.dataset.originalClass || this._detailCopyIcon.className;
        this._detailCopyIcon.dataset.originalClass = original;
        this._detailCopyIcon.className = "ri-check-line text-lg leading-4";
        setTimeout(() => {
          if (this._detailCopyIcon) {
            this._detailCopyIcon.className = this._detailCopyIcon.dataset.originalClass || original;
          }
        }, 2e3);
      }
    } else {
      this._setDetailStatus(translate("settingsUsersDetailCopyError"), "error");
    }
  }
  _handleDetailLinkFocus(event) {
    const input = event.currentTarget;
    if (input && typeof input.select === "function") {
      input.select();
    }
  }
  _formatExpiry(expiresAtSeconds) {
    if (!expiresAtSeconds) {
      return translate("settingsUsersDetailExpiresUnknown");
    }
    const millis = Number(expiresAtSeconds) * 1e3;
    const date = new Date(millis);
    if (Number.isNaN(date.getTime())) {
      return translate("settingsUsersDetailExpiresUnknown");
    }
    const locale = document.documentElement.lang || navigator.language || "en";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }
  async _loadSignupOverview() {
    try {
      const response = await fetch("/api/admin/signup-links", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`overview_failed_${response.status}`);
      }
      const data = await response.json();
      if ((data == null ? void 0 : data.admin) && typeof data.admin.active_count === "number") {
        this._setSignupCount("admin", data.admin.active_count);
      }
      if ((data == null ? void 0 : data.user) && typeof data.user.active_count === "number") {
        this._setSignupCount("user", data.user.active_count);
      }
      this._setSectionStatus("admin", "");
      this._setSectionStatus("user", "");
      if (this._activeDetailType && this._detailActiveCount) {
        const section = this._getSignupSection(this._activeDetailType);
        const countText = (section == null ? void 0 : section.countEl) ? section.countEl.textContent || "0" : "0";
        this._detailActiveCount.textContent = countText;
      }
    } catch (error) {
      console.error("[SettingsLayout] Failed to load signup overview", error);
      this._setSignupCount("admin", 0);
      this._setSignupCount("user", 0);
      this._setSectionStatus("admin", translate("settingsUsersOverviewError"), "error");
      this._setSectionStatus("user", translate("settingsUsersOverviewError"), "error");
      if (this._activeDetailType) {
        this._setDetailStatus(translate("settingsUsersOverviewError"), "error");
      }
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
        this._profileStatusIcon.classList.add("ri-close-circle-fill", "text-red-600", "dark:text-red-400");
      }
    } else if (type === "success") {
      this._profileStatus.classList.add("text-green-600", "dark:text-green-400");
      if (this._profileStatusIcon) {
        this._profileStatusIcon.classList.remove("hidden");
        this._profileStatusIcon.classList.add("ri-check-line", "text-green-600", "dark:text-green-400");
      }
    } else {
      this._profileStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._profileStatusIcon) {
        this._profileStatusIcon.classList.remove("hidden");
        this._profileStatusIcon.classList.add("ri-information-line", "text-grey-60", "dark:text-grey-40");
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
        this._accountStatusIcon.classList.add("ri-close-circle-fill", "text-red-600", "dark:text-red-400");
      }
    } else if (type === "success") {
      this._accountStatus.classList.add("text-green-600", "dark:text-green-400");
      if (this._accountStatusIcon) {
        this._accountStatusIcon.classList.remove("hidden");
        this._accountStatusIcon.classList.add("ri-check-line", "text-green-600", "dark:text-green-400");
      }
    } else {
      this._accountStatus.classList.add("text-grey-70", "dark:text-grey-40");
      if (this._accountStatusIcon) {
        this._accountStatusIcon.classList.remove("hidden");
        this._accountStatusIcon.classList.add("ri-information-line", "text-grey-60", "dark:text-grey-40");
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
      this._setKeyStatus("error", translate("settingsAccountKeyStatusUnavailable"));
      return;
    }
    const success = copyToClipboard(value);
    if (success) {
      this._setKeyStatus("success", translate("settingsAccountKeyStatusCopied"));
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
    const emailInput = this._profileForm.querySelector("#settings-account-email");
    const name = (nameInput == null ? void 0 : nameInput.value.trim()) || "";
    const email = (emailInput == null ? void 0 : emailInput.value.trim()) || "";
    if (!name) {
      this._setProfileStatus("error", translate("settingsAccountProfileStatusNameRequired"));
      return;
    }
    if (!email) {
      this._setProfileStatus("error", translate("settingsAccountProfileStatusEmailRequired"));
      return;
    }
    if (!this._isValidEmail(email)) {
      this._setProfileStatus("error", translate("settingsAccountProfileStatusEmailInvalid"));
      return;
    }
    this._setProfileStatus("info", translate("settingsAccountProfileStatusSaving"));
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
      this._setProfileStatus("success", translate("settingsAccountProfileStatusSuccess"));
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
    this._setAccountStatus("info", translate("settingsAccountDangerStatusClearing"));
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
    const confirmed = window.confirm(translate("settingsAccountDeactivateConfirm"));
    if (!confirmed) {
      return;
    }
    this._setAccountStatus("info", translate("settingsAccountDangerStatusDeactivating"));
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
      console.warn("[SettingsLayout] Failed to clear local storage on logout", err);
    }
    window.location.href = "/logout";
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
//# sourceMappingURL=settings-layout-WAAWLM3I.js.map
