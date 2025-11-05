import {
  qrcode_default
} from "./chunk-U2YGIKKI.js";
import "./chunk-SEJ6FTBC.js";
import {
  USER_ROLES,
  storage_default
} from "./chunk-NDNL5OG4.js";
import "./chunk-JZ372DUV.js";
import {
  copyToClipboard,
  translate,
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/file-logs-view.mjs
var FileLogsView = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._fileId = null;
    this._fileName = null;
    this._logsTable = null;
    this._closeButton = null;
    this._boundClose = this._handleClose.bind(this);
  }
  static get observedAttributes() {
    return ["fileId", "fileName"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "fileId") {
      this._fileId = newValue || null;
    } else if (name === "fileName") {
      this._fileName = newValue || null;
    }
    if (this._templateMounted) {
      this._updateHeader();
    }
  }
  connectedCallback() {
    if (this.hasAttribute("fileId")) {
      this._fileId = this.getAttribute("fileId");
    }
    if (this.hasAttribute("fileName")) {
      this._fileName = this.getAttribute("fileName");
    }
    if (!this._templateMounted) {
      this._mountTemplate();
      this._templateMounted = true;
    }
    this._cacheElements();
    this._attachListeners();
  }
  disconnectedCallback() {
    this._detachListeners();
    this._logsTable = null;
    this._closeButton = null;
  }
  _mountTemplate() {
    const container = document.createElement("div");
    container.className = "flex flex-col h-full gap-4";
    const header = document.createElement("div");
    header.className = "flex items-center justify-between border-b border-grey-20 dark:border-grey-80 pb-4";
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded border border-grey-20 dark:border-grey-80 hover:border-grey-40 dark:hover:border-grey-60 transition";
    backButton.innerHTML = '<i class="ri-arrow-left-line text-base leading-4"></i><span>Back</span>';
    backButton.setAttribute("data-role", "close-button");
    const title = document.createElement("h2");
    title.className = "text-lg font-semibold text-grey-90 dark:text-grey-10 flex items-center gap-2";
    title.setAttribute("data-role", "file-logs-title");
    header.appendChild(backButton);
    header.appendChild(title);
    const logsTable = document.createElement("logs-table");
    if (this._fileId) {
      logsTable.setAttribute("fileId", this._fileId);
    }
    container.appendChild(header);
    container.appendChild(logsTable);
    this.appendChild(container);
    this._logsTable = logsTable;
    this._closeButton = backButton;
    this._updateHeader();
  }
  _cacheElements() {
    if (!this._logsTable) {
      this._logsTable = this.querySelector("logs-table");
    }
    if (!this._closeButton) {
      this._closeButton = this.querySelector('[data-role="close-button"]');
    }
  }
  _attachListeners() {
    if (this._closeButton) {
      this._closeButton.addEventListener("click", this._boundClose);
    }
  }
  _detachListeners() {
    if (this._closeButton) {
      this._closeButton.removeEventListener("click", this._boundClose);
    }
  }
  _updateHeader() {
    const titleEl = this.querySelector('[data-role="file-logs-title"]');
    if (!titleEl) return;
    while (titleEl.firstChild) {
      titleEl.removeChild(titleEl.firstChild);
    }
    const icon = document.createElement("i");
    icon.className = "ri-file-list-line text-lg leading-4";
    titleEl.appendChild(icon);
    if (this._fileName || this._fileId) {
      const fileName = this._fileName || this._fileId.substring(0, 8) + "\u2026";
      const text = document.createTextNode(
        `Logs for ${fileName}`
      );
      titleEl.appendChild(text);
    } else {
      const text = document.createTextNode("File Logs");
      titleEl.appendChild(text);
    }
  }
  _handleClose() {
    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
        detail: { fileId: this._fileId }
      })
    );
  }
  /**
   * Public API: Set file ID (updates logs filter)
   */
  setFileId(fileId) {
    this._fileId = fileId;
    if (this._logsTable) {
      this._logsTable.setFileId(fileId);
    }
    this._updateHeader();
  }
  /**
   * Public API: Get file ID
   */
  getFileId() {
    return this._fileId;
  }
  /**
   * Public API: Get the logs table element for direct control
   */
  getLogsTable() {
    return this._logsTable;
  }
};
customElements.define("file-logs-view", FileLogsView);

// src/ui/settings-users-panel.mjs
var SettingsUsersPanel = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._isAdmin = false;
    this._signupSections = /* @__PURE__ */ new Map();
    this._signupOverview = null;
    this._signupDetail = null;
    this._detailHeading = null;
    this._detailDescription = null;
    this._detailStatusEl = null;
    this._detailStatusIcon = null;
    this._detailStatusText = null;
    this._detailQrContainer = null;
    this._detailLinkInput = null;
    this._detailCopyButton = null;
    this._detailCopyIcon = null;
    this._detailBackButton = null;
    this._activeDetailType = null;
    this._activeDetailExpiresAt = null;
    this._usersHeader = null;
    this._usersListSection = null;
    this._usersListStatus = null;
    this._usersListEmpty = null;
    this._usersTableBody = null;
    this._usersStatusIcon = null;
    this._usersStatusText = null;
    this._fileLogsViewContainer = null;
    this._currentFileLogsView = null;
    this._usersData = [];
    this._usersLoading = false;
    this._boundGenerateClick = this._handleGenerateClick.bind(this);
    this._boundRevokeClick = this._handleRevokeClick.bind(this);
    this._boundDetailBack = this._handleDetailBack.bind(this);
    this._boundDetailCopy = this._handleDetailCopy.bind(this);
    this._boundDetailLinkFocus = this._handleDetailLinkFocus.bind(this);
    this._boundUserAction = this._handleUserAction.bind(this);
    this._boundFileLogsClose = this._handleFileLogsClose.bind(this);
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-users-panel");
      if (!template) {
        console.error("Template #settings-users-panel not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    this._isAdmin = this._checkIsAdmin();
    if (!this._isAdmin) {
      console.warn("[SettingsUsersPanel] User is not admin, panel should not be visible");
      return;
    }
    this._cacheElements();
    translateElement(this);
    this._attachListeners();
    this._initSignupSections();
    this._loadSignupOverview();
    this._loadUsers();
  }
  disconnectedCallback() {
    this._detachListeners();
    this._signupSections.clear();
    this._signupOverview = null;
    this._signupDetail = null;
    this._detailHeading = null;
    this._detailDescription = null;
    this._detailStatusEl = null;
    this._detailStatusIcon = null;
    this._detailStatusText = null;
    this._detailQrContainer = null;
    this._detailLinkInput = null;
    this._detailCopyButton = null;
    this._detailCopyIcon = null;
    this._detailBackButton = null;
    this._activeDetailType = null;
    this._activeDetailExpiresAt = null;
    this._usersHeader = null;
    this._usersListSection = null;
    this._usersListStatus = null;
    this._usersListEmpty = null;
    this._usersTableBody = null;
    this._usersStatusIcon = null;
    this._usersStatusText = null;
    this._usersData = [];
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
  _cacheElements() {
    this._signupOverview = this.querySelector('[data-role="signup-overview"]');
    this._signupDetail = this.querySelector('[data-role="signup-detail"]');
    this._detailHeading = this.querySelector('[data-role="detail-heading"]');
    this._detailDescription = this.querySelector('[data-role="detail-description"]');
    this._detailStatusEl = this.querySelector('[data-role="detail-status"]');
    this._detailStatusIcon = this.querySelector('[data-role="detail-status-icon"]');
    this._detailStatusText = this.querySelector('[data-role="detail-status-text"]');
    this._detailQrContainer = this.querySelector('[data-role="detail-qr"]');
    this._detailLinkInput = this.querySelector('[data-role="detail-link"]');
    this._detailCopyButton = this.querySelector('[data-role="detail-copy"]');
    this._detailCopyIcon = this.querySelector('[data-role="detail-copy-icon"]');
    this._detailBackButton = this.querySelector('[data-role="detail-back"]');
    this._usersHeader = this.querySelector('[data-role="users-header"]');
    this._usersListSection = this.querySelector('[data-role="users-list"]');
    this._usersListStatus = this.querySelector('[data-role="users-list-status"]');
    this._usersStatusIcon = this.querySelector('[data-role="users-list-status-icon"]');
    this._usersStatusText = this.querySelector('[data-role="users-list-status-text"]');
    this._usersListEmpty = this.querySelector('[data-role="users-list-empty"]');
    this._usersTableBody = this.querySelector('[data-role="users-table-body"]');
  }
  _attachListeners() {
    const generateButtons = this.querySelectorAll('[data-role="generate"]');
    generateButtons.forEach((btn) => {
      btn.addEventListener("click", this._boundGenerateClick);
    });
    const revokeButtons = this.querySelectorAll('[data-role="revoke"]');
    revokeButtons.forEach((btn) => {
      btn.addEventListener("click", this._boundRevokeClick);
    });
    if (this._detailBackButton) {
      this._detailBackButton.addEventListener("click", this._boundDetailBack);
    }
    if (this._detailCopyButton) {
      this._detailCopyButton.addEventListener("click", this._boundDetailCopy);
    }
    if (this._detailLinkInput) {
      this._detailLinkInput.addEventListener("focus", this._boundDetailLinkFocus);
    }
    if (this._usersTableBody) {
      this._usersTableBody.addEventListener("click", this._boundUserAction);
    }
  }
  _detachListeners() {
    const generateButtons = this.querySelectorAll('[data-role="generate"]');
    generateButtons.forEach((btn) => {
      btn.removeEventListener("click", this._boundGenerateClick);
    });
    const revokeButtons = this.querySelectorAll('[data-role="revoke"]');
    revokeButtons.forEach((btn) => {
      btn.removeEventListener("click", this._boundRevokeClick);
    });
    if (this._detailBackButton) {
      this._detailBackButton.removeEventListener("click", this._boundDetailBack);
    }
    if (this._detailCopyButton) {
      this._detailCopyButton.removeEventListener("click", this._boundDetailCopy);
    }
    if (this._detailLinkInput) {
      this._detailLinkInput.removeEventListener("focus", this._boundDetailLinkFocus);
    }
    if (this._usersTableBody) {
      this._usersTableBody.removeEventListener("click", this._boundUserAction);
    }
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
        revokeButton: card.querySelector('[data-role="revoke"]')
      };
      this._signupSections.set(normalized, section);
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
      this._detailDescription.textContent = translate(
        "settingsUsersDetailDescription",
        {
          date: expiresText
        }
      );
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
      console.error("[SettingsUsersPanel] QR generation failed", error);
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
  async _handleGenerateClick(event) {
    var _a;
    event.preventDefault();
    const button = event.currentTarget;
    const type = ((_a = button == null ? void 0 : button.getAttribute("data-token-type")) == null ? void 0 : _a.toLowerCase()) || "admin";
    const section = this._getSignupSection(type);
    if (!section) {
      return;
    }
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
        this._setDetailStatus(
          translate("settingsUsersGenerateSuccess"),
          "success"
        );
      }
    } catch (error) {
      console.error("[SettingsUsersPanel] Failed to create signup link", error);
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
    this._setSectionLoading(section, true);
    try {
      const response = await fetch(
        `/api/admin/signup-links?type=${encodeURIComponent(type)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
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
    } catch (error) {
      console.error("[SettingsUsersPanel] Failed to revoke signup links", error);
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
      this._setDetailStatus(
        translate("settingsUsersDetailCopySuccess"),
        "success"
      );
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
    } catch (error) {
      console.error("[SettingsUsersPanel] Failed to load signup overview", error);
      this._setSignupCount("admin", 0);
      this._setSignupCount("user", 0);
      if (this._activeDetailType) {
        this._setDetailStatus(translate("settingsUsersOverviewError"), "error");
      }
    }
  }
  async _loadUsers() {
    if (!this._usersListSection) {
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
      console.error("[SettingsUsersPanel] Failed to load users", error);
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
    this._usersTableBody.innerHTML = "";
    for (const user of this._usersData) {
      const row = this._createUserRow(user);
      if (row) {
        this._usersTableBody.appendChild(row);
      }
    }
  }
  _createUserRow(user) {
    var _a;
    const template = document.getElementById("settings-user-item");
    if (!template) {
      console.error("Template #settings-user-item not found");
      return null;
    }
    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector('[data-role="user-row"]');
    if (!row) {
      return null;
    }
    row.dataset.userId = String(user.id);
    const nameEl = row.querySelector('[data-role="user-name"]');
    if (nameEl) {
      nameEl.textContent = this._getDisplayName(user);
    }
    const youBadge = row.querySelector('[data-role="you-badge"]');
    if (youBadge) {
      if (user.is_current_user) {
        youBadge.classList.remove("hidden");
      } else {
        youBadge.remove();
      }
    }
    const roleLabel = row.querySelector('[data-role="role-label"]');
    const statusLabel = row.querySelector('[data-role="status-label"]');
    const metaSeparator = row.querySelector('[data-role="meta-separator"]');
    const roleLabelText = this._formatUserRole(user.role);
    const statusLabelText = this._formatUserStatus(user.active);
    if (roleLabel && roleLabelText) {
      roleLabel.textContent = roleLabelText;
    }
    if (statusLabel && statusLabelText) {
      statusLabel.textContent = statusLabelText;
      const statusClass = user.active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
      statusLabel.className = statusClass;
      if (metaSeparator) {
        metaSeparator.classList.remove("hidden");
      }
    }
    const emailEl = row.querySelector('[data-role="user-email"]');
    if (emailEl) {
      const emailText = ((_a = user.email) == null ? void 0 : _a.trim()) || "";
      emailEl.textContent = emailText || "\u2014";
    }
    const signingKeyEl = row.querySelector('[data-role="signing-key"]');
    const signingKeyTitle = (user.public_key || "").trim();
    const signingKey = this._formatKey(signingKeyTitle);
    if (signingKeyEl) {
      signingKeyEl.textContent = signingKey;
      if (signingKeyTitle) {
        signingKeyEl.title = signingKeyTitle;
      }
    }
    const encryptionKeyEl = row.querySelector('[data-role="encryption-key"]');
    const encryptionKeyTitle = (user.encryption_public_key || "").trim();
    const encryptionKey = this._formatKey(encryptionKeyTitle);
    if (encryptionKeyEl) {
      encryptionKeyEl.textContent = encryptionKey;
      if (encryptionKeyTitle) {
        encryptionKeyEl.title = encryptionKeyTitle;
      }
    }
    const copySigningBtn = row.querySelector('[data-role="copy-signing-key"]');
    if (copySigningBtn) {
      if (signingKeyTitle) {
        copySigningBtn.dataset.userAction = "copy-key";
        copySigningBtn.dataset.userId = String(user.id);
        copySigningBtn.dataset.keyValue = signingKeyTitle;
        const copyActionLabel = translate("copyLinkButton");
        const signingCopyLabel = `${copyActionLabel} \u2013 ${translate("settingsUsersKeySigning")}`;
        copySigningBtn.setAttribute("aria-label", signingCopyLabel);
        copySigningBtn.title = signingCopyLabel;
        const srLabel = copySigningBtn.querySelector(".sr-only");
        if (srLabel) {
          srLabel.textContent = signingCopyLabel;
        }
        copySigningBtn.classList.remove("hidden");
      }
    }
    const copyEncryptionBtn = row.querySelector('[data-role="copy-encryption-key"]');
    if (copyEncryptionBtn) {
      if (encryptionKeyTitle) {
        copyEncryptionBtn.dataset.userAction = "copy-key";
        copyEncryptionBtn.dataset.userId = String(user.id);
        copyEncryptionBtn.dataset.keyValue = encryptionKeyTitle;
        const copyActionLabel = translate("copyLinkButton");
        const encryptionCopyLabel = `${copyActionLabel} \u2013 ${translate("settingsUsersKeyEncryption")}`;
        copyEncryptionBtn.setAttribute("aria-label", encryptionCopyLabel);
        copyEncryptionBtn.title = encryptionCopyLabel;
        const srLabel = copyEncryptionBtn.querySelector(".sr-only");
        if (srLabel) {
          srLabel.textContent = encryptionCopyLabel;
        }
        copyEncryptionBtn.classList.remove("hidden");
      }
    }
    const sessionsEl = row.querySelector('[data-role="sessions-count"]');
    if (sessionsEl) {
      sessionsEl.textContent = Number.isFinite(user.active_sessions) ? String(user.active_sessions) : "0";
    }
    const toggleButton = row.querySelector('[data-role="toggle-button"]');
    if (toggleButton) {
      const toggleAction = user.active ? "deactivate" : "activate";
      const toggleIcon = user.active ? "ri-user-unfollow-line" : "ri-user-follow-line";
      const toggleButtonLabel = user.active ? translate("settingsUsersActionDeactivate") : translate("settingsUsersActionActivate");
      const baseButtonClass = "inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
      const deactivateButtonClass = `${baseButtonClass} text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-400/40 bg-yellow-50/60 dark:bg-yellow-900/20 hover:bg-yellow-50 dark:hover:bg-yellow-900/30`;
      const activateButtonClass = `${baseButtonClass} text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/40 bg-green-50/60 dark:bg-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/30`;
      toggleButton.className = user.active ? deactivateButtonClass : activateButtonClass;
      toggleButton.dataset.userAction = toggleAction;
      toggleButton.dataset.userId = String(user.id);
      toggleButton.setAttribute("aria-label", toggleButtonLabel);
      const toggleDisabled = user.active && user.is_current_user;
      if (toggleDisabled) {
        toggleButton.disabled = true;
        toggleButton.title = translate("settingsUsersActionDeactivateSelfError");
      }
      const toggleIconEl = toggleButton.querySelector('[data-role="toggle-icon"]');
      if (toggleIconEl) {
        toggleIconEl.className = `${toggleIcon} text-base leading-4`;
      }
    }
    const clearSessionsButton = row.querySelector('[data-role="clear-sessions-button"]');
    if (clearSessionsButton) {
      const clearDisabled = user.active_sessions === 0;
      clearSessionsButton.dataset.userAction = "clear-sessions";
      clearSessionsButton.dataset.userId = String(user.id);
      clearSessionsButton.setAttribute("aria-label", translate("settingsUsersActionClearSessions"));
      if (clearDisabled) {
        clearSessionsButton.disabled = true;
        clearSessionsButton.title = translate("settingsUsersActionClearDisabledTooltip");
      }
    }
    const deleteButton = row.querySelector('[data-role="delete-button"]');
    if (deleteButton) {
      const deleteDisabled = user.is_current_user;
      deleteButton.dataset.userAction = "delete";
      deleteButton.dataset.userId = String(user.id);
      deleteButton.setAttribute("aria-label", translate("settingsUsersActionDelete"));
      if (deleteDisabled) {
        deleteButton.disabled = true;
        deleteButton.title = translate("settingsUsersActionDeleteSelfTooltip");
      }
    }
    translateElement(row);
    return row;
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
        this._setUsersStatus(
          translate("settingsUsersActionDeactivateSelfError"),
          "error"
        );
        return;
      }
      this._setUsersStatus(
        translate("settingsUsersActionDeactivateWorking"),
        "info"
      );
      let succeeded = false;
      this._setButtonLoading(
        button,
        "ri-loader-4-line",
        translate("settingsUsersActionDeactivateWorking")
      );
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
        this._setUsersStatus(
          translate("settingsUsersActionDeactivateSuccess", {
            name: displayName
          }),
          "success"
        );
      } catch (error) {
        console.error("[SettingsUsersPanel] Failed to deactivate user", error);
        this._setUsersStatus(
          translate("settingsUsersActionDeactivateError"),
          "error"
        );
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
      return;
    }
    if (action === "activate") {
      this._setUsersStatus(
        translate("settingsUsersActionActivateWorking"),
        "info"
      );
      let succeeded = false;
      this._setButtonLoading(
        button,
        "ri-loader-4-line",
        translate("settingsUsersActionActivateWorking")
      );
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
        this._setUsersStatus(
          translate("settingsUsersActionActivateSuccess", {
            name: displayName
          }),
          "success"
        );
      } catch (error) {
        console.error("[SettingsUsersPanel] Failed to activate user", error);
        this._setUsersStatus(
          translate("settingsUsersActionActivateError"),
          "error"
        );
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
      this._setUsersStatus(
        translate("settingsUsersActionClearWorking"),
        "info"
      );
      let succeeded = false;
      this._setButtonLoading(
        button,
        "ri-loader-4-line",
        translate("settingsUsersActionClearWorking")
      );
      try {
        const response = await fetch(
          `/api/admin/users/${userID}/clear-sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
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
        this._setUsersStatus(
          translate("settingsUsersActionClearSuccess", { name: displayName }),
          "success"
        );
      } catch (error) {
        console.error("[SettingsUsersPanel] Failed to clear sessions", error);
        this._setUsersStatus(
          translate("settingsUsersActionClearError"),
          "error"
        );
      } finally {
        if (!succeeded) {
          this._restoreButton(button);
        }
      }
      return;
    }
    if (action === "logs") {
      this._showUserLogsView(user, displayName);
      return;
    }
    if (action === "delete") {
      if (user.is_current_user) {
        this._setUsersStatus(
          translate("settingsUsersActionDeleteSelfError"),
          "error"
        );
        return;
      }
      const confirmed = window.confirm(
        translate("settingsUsersActionDeleteConfirm", { name: displayName })
      );
      if (!confirmed) {
        return;
      }
      this._setUsersStatus(
        translate("settingsUsersActionDeleteWorking"),
        "info"
      );
      let succeeded = false;
      this._setButtonLoading(
        button,
        "ri-loader-4-line",
        translate("settingsUsersActionDeleteWorking")
      );
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
        this._setUsersStatus(
          translate("settingsUsersActionDeleteSuccess", { name: displayName }),
          "success"
        );
      } catch (error) {
        console.error("[SettingsUsersPanel] Failed to delete user", error);
        this._setUsersStatus(
          translate("settingsUsersActionDeleteError"),
          "error"
        );
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
  /**
   * Show logs view for a specific user
   * Creates and displays a LogsTable component with appropriate styling
   */
  _showUserLogsView(user, displayName) {
    if (!this._fileLogsViewContainer) {
      this._fileLogsViewContainer = document.createElement("div");
      this._fileLogsViewContainer.className = "flex flex-col h-full gap-4";
      this.appendChild(this._fileLogsViewContainer);
    }
    this._fileLogsViewContainer.innerHTML = "";
    const header = document.createElement("div");
    header.className = "flex items-center justify-between border-b border-grey-20 dark:border-grey-80 pb-4";
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded border border-grey-20 dark:border-grey-80 hover:border-grey-40 dark:hover:border-grey-60 transition";
    backButton.innerHTML = '<i class="ri-arrow-left-line text-base leading-4"></i><span>Back</span>';
    backButton.addEventListener("click", this._boundFileLogsClose);
    const title = document.createElement("h2");
    title.className = "text-lg font-semibold text-grey-90 dark:text-grey-10 flex items-center gap-2";
    title.innerHTML = `<i class="ri-file-list-line text-lg leading-4"></i><span>Logs for ${displayName}</span>`;
    header.appendChild(backButton);
    header.appendChild(title);
    const logsTable = document.createElement("logs-table");
    this._fileLogsViewContainer.appendChild(header);
    this._fileLogsViewContainer.appendChild(logsTable);
    if (this._usersListSection) {
      this._usersListSection.classList.add("hidden");
    }
    if (this._usersHeader) {
      this._usersHeader.classList.add("hidden");
    }
    this._fileLogsViewContainer.classList.remove("hidden");
    this._currentFileLogsView = logsTable;
  }
  /**
   * Handle close event from file logs view
   * Returns to the users list view
   */
  _handleFileLogsClose() {
    if (this._usersListSection) {
      this._usersListSection.classList.remove("hidden");
    }
    if (this._usersHeader) {
      this._usersHeader.classList.remove("hidden");
    }
    if (this._fileLogsViewContainer) {
      this._fileLogsViewContainer.classList.add("hidden");
    }
    this._currentFileLogsView = null;
    this._setUsersStatus("", "");
  }
};
customElements.define("settings-users-panel", SettingsUsersPanel);
//# sourceMappingURL=settings-users-panel-IIA7ZTWS.js.map
