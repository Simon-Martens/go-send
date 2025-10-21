import storage from "../storage.mjs";
import { USER_ROLES } from "../userSecrets.mjs";
import { translate, translateElement, copyToClipboard } from "../utils.mjs";

class SettingsUploadLinksPanel extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._isAdmin = false;

    // Element refs
    this._uploadLinksAdminSection = null;
    this._uploadLinksPlaceholder = null;
    this._uploadLinksForm = null;
    this._uploadLinksLabelInput = null;
    this._uploadLinksDescriptionInput = null;
    this._uploadLinksGeneralCheckbox = null;
    this._uploadLinksSubmitButton = null;
    this._uploadLinksStatusEl = null;
    this._uploadLinksStatusIcon = null;
    this._uploadLinksStatusText = null;
    this._uploadLinksDetail = null;
    this._uploadLinksDetailLabel = null;
    this._uploadLinksDetailInput = null;
    this._uploadLinksDetailCopyButton = null;
    this._uploadLinksDetailCopyIcon = null;
    this._uploadLinksDetailStatus = null;
    this._uploadLinksTableBody = null;
    this._uploadLinksEmpty = null;

    // State
    this._uploadLinks = [];
    this._uploadLinksLoading = false;
    this._uploadLinksSubmitting = false;
    this._uploadLinksCopyResetTimeout = null;
    this._uploadLinksDetailLinkId = null;

    // Bound handlers
    this._boundUploadLinksSubmit = this._handleUploadLinksSubmit.bind(this);
    this._boundUploadLinksAction = this._handleUploadLinksAction.bind(this);
    this._boundUploadLinksCopy = this._handleUploadLinksCopy.bind(this);
  }

  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-upload-links-panel");
      if (!template) {
        console.error("Template #settings-upload-links-panel not found");
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

    // Load data if admin
    if (this._isAdmin) {
      this._loadUploadLinks();
    }
  }

  disconnectedCallback() {
    this._detachListeners();
    if (this._uploadLinksCopyResetTimeout) {
      clearTimeout(this._uploadLinksCopyResetTimeout);
      this._uploadLinksCopyResetTimeout = null;
    }
    // Clear refs
    this._uploadLinksAdminSection = null;
    this._uploadLinksPlaceholder = null;
    this._uploadLinksForm = null;
    this._uploadLinksLabelInput = null;
    this._uploadLinksDescriptionInput = null;
    this._uploadLinksGeneralCheckbox = null;
    this._uploadLinksSubmitButton = null;
    this._uploadLinksStatusEl = null;
    this._uploadLinksStatusIcon = null;
    this._uploadLinksStatusText = null;
    this._uploadLinksDetail = null;
    this._uploadLinksDetailLabel = null;
    this._uploadLinksDetailInput = null;
    this._uploadLinksDetailCopyButton = null;
    this._uploadLinksDetailCopyIcon = null;
    this._uploadLinksDetailStatus = null;
    this._uploadLinksTableBody = null;
    this._uploadLinksEmpty = null;
  }

  _checkIsAdmin() {
    const user = storage.user;
    if (!user || user.role === undefined || user.role === null) {
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
    this._uploadLinksAdminSection = this.querySelector(
      '[data-role="upload-links-admin"]',
    );
    this._uploadLinksPlaceholder = this.querySelector(
      '[data-role="upload-links-placeholder"]',
    );
    this._uploadLinksForm = this.querySelector('[data-role="upload-links-form"]');
    this._uploadLinksLabelInput = this.querySelector(
      '[data-role="upload-links-label"]',
    );
    this._uploadLinksDescriptionInput = this.querySelector(
      '[data-role="upload-links-description"]',
    );
    this._uploadLinksGeneralCheckbox = this.querySelector(
      '[data-role="upload-links-general"]',
    );
    this._uploadLinksSubmitButton = this.querySelector(
      '[data-role="upload-links-submit"]',
    );
    this._uploadLinksStatusEl = this.querySelector(
      '[data-role="upload-links-status"]',
    );
    this._uploadLinksStatusIcon = this.querySelector(
      '[data-role="upload-links-status-icon"]',
    );
    this._uploadLinksStatusText = this.querySelector(
      '[data-role="upload-links-status-text"]',
    );
    this._uploadLinksDetail = this.querySelector(
      '[data-role="upload-links-detail"]',
    );
    this._uploadLinksDetailLabel = this.querySelector(
      '[data-role="upload-links-detail-label"]',
    );
    this._uploadLinksDetailInput = this.querySelector(
      '[data-role="upload-links-detail-input"]',
    );
    this._uploadLinksDetailCopyButton = this.querySelector(
      '[data-role="upload-links-copy"]',
    );
    this._uploadLinksDetailCopyIcon = this.querySelector(
      '[data-role="upload-links-copy-icon"]',
    );
    this._uploadLinksDetailStatus = this.querySelector(
      '[data-role="upload-links-detail-status"]',
    );
    this._uploadLinksTableBody = this.querySelector(
      '[data-role="upload-links-table"]',
    );
    this._uploadLinksEmpty = this.querySelector(
      '[data-role="upload-links-empty"]',
    );
  }

  _configureAccess() {
    if (this._isAdmin) {
      if (this._uploadLinksAdminSection) {
        this._uploadLinksAdminSection.classList.remove("hidden");
      }
      if (this._uploadLinksPlaceholder) {
        this._uploadLinksPlaceholder.classList.add("hidden");
      }
    } else {
      if (this._uploadLinksAdminSection) {
        this._uploadLinksAdminSection.classList.add("hidden");
      }
      if (this._uploadLinksPlaceholder) {
        this._uploadLinksPlaceholder.classList.remove("hidden");
      }
    }
  }

  _attachListeners() {
    if (this._uploadLinksForm) {
      this._uploadLinksForm.addEventListener(
        "submit",
        this._boundUploadLinksSubmit,
      );
    }
    if (this._uploadLinksTableBody) {
      this._uploadLinksTableBody.addEventListener(
        "click",
        this._boundUploadLinksAction,
      );
    }
    if (this._uploadLinksDetailCopyButton) {
      this._uploadLinksDetailCopyButton.addEventListener(
        "click",
        this._boundUploadLinksCopy,
      );
    }
  }

  _detachListeners() {
    if (this._uploadLinksForm) {
      this._uploadLinksForm.removeEventListener(
        "submit",
        this._boundUploadLinksSubmit,
      );
    }
    if (this._uploadLinksTableBody) {
      this._uploadLinksTableBody.removeEventListener(
        "click",
        this._boundUploadLinksAction,
      );
    }
    if (this._uploadLinksDetailCopyButton) {
      this._uploadLinksDetailCopyButton.removeEventListener(
        "click",
        this._boundUploadLinksCopy,
      );
    }
  }

  async _handleUploadLinksSubmit(event) {
    event.preventDefault();
    if (!this._isAdmin || this._uploadLinksSubmitting) {
      return;
    }

    const label = (this._uploadLinksLabelInput?.value || "").trim();
    const description = (this._uploadLinksDescriptionInput?.value || "").trim();
    const isGeneral = this._uploadLinksGeneralCheckbox?.checked || false;
    const type = isGeneral ? 2 : 3; // Type 2 = general, Type 3 = user-specific

    if (!label) {
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusLabelRequired"),
        "error",
      );
      return;
    }

    this._uploadLinksSubmitting = true;
    if (this._uploadLinksSubmitButton) {
      this._uploadLinksSubmitButton.disabled = true;
      this._uploadLinksSubmitButton.classList.add("opacity-60");
    }
    this._setUploadLinksStatus(
      translate("settingsUploadLinksStatusCreating"),
      "info",
    );

    try {
      const response = await fetch("/api/admin/upload-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label,
          description,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(`upload_link_create_failed_${response.status}`);
      }

      const payload = await response.json();
      const linkURL = payload?.link || "";

      if (this._uploadLinksLabelInput) {
        this._uploadLinksLabelInput.value = "";
      }
      if (this._uploadLinksDescriptionInput) {
        this._uploadLinksDescriptionInput.value = "";
      }
      if (this._uploadLinksGeneralCheckbox) {
        this._uploadLinksGeneralCheckbox.checked = false;
      }

      const normalized = {
        id: Number.parseInt(payload?.id, 10) || payload?.id || Date.now(),
        label: payload?.label || label,
        description: payload?.description || description,
        preview: payload?.preview || "",
        active: payload?.active !== undefined ? Boolean(payload.active) : true,
        type: Number.parseInt(payload?.type, 10) || type,
        user_name: payload?.user_name || "",
        created:
          Number.parseInt(payload?.created, 10) ||
          Math.floor(Date.now() / 1000),
        created_by:
          Number.parseInt(payload?.created_by, 10) ||
          payload?.created_by ||
          null,
      };

      this._uploadLinks = [
        normalized,
        ...this._uploadLinks.filter((item) => item.id !== normalized.id),
      ].sort((a, b) => (b.created || 0) - (a.created || 0));
      this._renderUploadLinks();
      this._showUploadLinkDetail(normalized, linkURL);
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusCreated"),
        "success",
      );
    } catch (error) {
      console.error("[SettingsUploadLinksPanel] Failed to create upload link", error);
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusError"),
        "error",
      );
    } finally {
      this._uploadLinksSubmitting = false;
      if (this._uploadLinksSubmitButton) {
        this._uploadLinksSubmitButton.disabled = false;
        this._uploadLinksSubmitButton.classList.remove("opacity-60");
      }
    }
  }

  _handleUploadLinksAction(event) {
    if (!this._isAdmin) {
      return;
    }
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const action = button.dataset.action;
    const tokenId = Number.parseInt(button.dataset.tokenId, 10);
    if (!Number.isFinite(tokenId) || tokenId <= 0) {
      return;
    }

    if (action === "revoke") {
      this._revokeUploadLink(tokenId, button);
    }
  }

  async _revokeUploadLink(tokenId, button) {
    if (!this._isAdmin) {
      return;
    }
    if (button) {
      button.disabled = true;
      button.classList.add("opacity-60");
    }
    this._setUploadLinksStatus(
      translate("settingsUploadLinksStatusRevoking"),
      "info",
    );

    try {
      const response = await fetch(`/api/admin/upload-links/${tokenId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`upload_link_revoke_failed_${response.status}`);
      }

      this._uploadLinks = this._uploadLinks.map((item) =>
        item.id === tokenId ? { ...item, active: false } : item,
      );
      this._renderUploadLinks();
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusRevoked"),
        "success",
      );
      if (this._uploadLinksDetailLinkId === tokenId) {
        this._hideUploadLinkDetail();
      }
    } catch (error) {
      console.error("[SettingsUploadLinksPanel] Failed to revoke upload link", error);
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusRevokeError"),
        "error",
      );
    } finally {
      if (button && document.body.contains(button)) {
        button.disabled = false;
        button.classList.remove("opacity-60");
      }
    }
  }

  _showUploadLinkDetail(link, linkURL) {
    if (!this._uploadLinksDetail || !this._uploadLinksDetailInput) {
      return;
    }
    if (this._uploadLinksCopyResetTimeout) {
      clearTimeout(this._uploadLinksCopyResetTimeout);
      this._uploadLinksCopyResetTimeout = null;
    }

    const label = link?.label || translate("settingsUploadLinksLabelFallback");
    if (this._uploadLinksDetailLabel) {
      this._uploadLinksDetailLabel.textContent = label;
    }

    this._uploadLinksDetailInput.value = linkURL || "";
    this._uploadLinksDetailLinkId = link?.id ?? null;
    this._uploadLinksDetail.classList.remove("hidden");
    if (this._uploadLinksDetailCopyIcon) {
      const original =
        this._uploadLinksDetailCopyIcon.dataset.originalClass ||
        this._uploadLinksDetailCopyIcon.className;
      this._uploadLinksDetailCopyIcon.dataset.originalClass = original;
      this._uploadLinksDetailCopyIcon.className = original;
    }
    this._setUploadLinkDetailStatus(
      linkURL ? translate("settingsUploadLinksDetailHint") : "",
      "info",
    );
  }

  _hideUploadLinkDetail() {
    if (!this._uploadLinksDetail) {
      return;
    }
    this._uploadLinksDetail.classList.add("hidden");
    this._uploadLinksDetailLinkId = null;
    if (this._uploadLinksDetailInput) {
      this._uploadLinksDetailInput.value = "";
    }
    if (this._uploadLinksDetailLabel) {
      this._uploadLinksDetailLabel.textContent = "—";
    }
    this._setUploadLinkDetailStatus("", "info");
    if (
      this._uploadLinksDetailCopyIcon &&
      this._uploadLinksDetailCopyIcon.dataset.originalClass
    ) {
      this._uploadLinksDetailCopyIcon.className =
        this._uploadLinksDetailCopyIcon.dataset.originalClass;
    }
  }

  _setUploadLinkDetailStatus(message, variant = "info") {
    if (!this._uploadLinksDetailStatus) {
      return;
    }
    const baseClass = "text-sm min-h-[1.25rem]";
    this._uploadLinksDetailStatus.className = `${baseClass} text-grey-60 dark:text-grey-30`;
    this._uploadLinksDetailStatus.textContent = message || "";

    if (!message) {
      return;
    }

    if (variant === "success") {
      this._uploadLinksDetailStatus.className = `${baseClass} text-green-600 dark:text-green-400`;
    } else if (variant === "error") {
      this._uploadLinksDetailStatus.className = `${baseClass} text-red-600 dark:text-red-400`;
    }
  }

  _handleUploadLinksCopy(event) {
    event.preventDefault();
    if (!this._uploadLinksDetailInput) {
      return;
    }
    const value = this._uploadLinksDetailInput.value || "";
    if (!value) {
      this._setUploadLinkDetailStatus(
        translate("settingsUploadLinksCopyError"),
        "error",
      );
      return;
    }

    try {
      const ok = copyToClipboard(value);
      if (!ok) {
        throw new Error("clipboard_failed");
      }
      this._setUploadLinkDetailStatus(
        translate("settingsUploadLinksCopySuccess"),
        "success",
      );
      if (this._uploadLinksDetailCopyIcon) {
        const original =
          this._uploadLinksDetailCopyIcon.dataset.originalClass ||
          this._uploadLinksDetailCopyIcon.className;
        this._uploadLinksDetailCopyIcon.dataset.originalClass = original;
        this._uploadLinksDetailCopyIcon.className =
          "ri-check-line text-base leading-4 text-green-600 dark:text-green-400";
        if (this._uploadLinksCopyResetTimeout) {
          clearTimeout(this._uploadLinksCopyResetTimeout);
        }
        this._uploadLinksCopyResetTimeout = setTimeout(() => {
          if (
            this._uploadLinksDetailCopyIcon &&
            this._uploadLinksDetailCopyIcon.dataset.originalClass
          ) {
            this._uploadLinksDetailCopyIcon.className =
              this._uploadLinksDetailCopyIcon.dataset.originalClass;
          }
        }, 2000);
      }
    } catch (error) {
      console.error("[SettingsUploadLinksPanel] Failed to copy upload link", error);
      this._setUploadLinkDetailStatus(
        translate("settingsUploadLinksCopyError"),
        "error",
      );
      if (
        this._uploadLinksDetailCopyIcon &&
        this._uploadLinksDetailCopyIcon.dataset.originalClass
      ) {
        this._uploadLinksDetailCopyIcon.className =
          this._uploadLinksDetailCopyIcon.dataset.originalClass;
      }
    }
  }

  _setUploadLinksStatus(message, variant = "info") {
    if (!this._uploadLinksStatusEl) {
      return;
    }
    const baseClass = "text-sm min-h-[1.5rem] flex items-center gap-2";
    this._uploadLinksStatusEl.className = `${baseClass} text-grey-60 dark:text-grey-40`;

    if (this._uploadLinksStatusText) {
      this._uploadLinksStatusText.textContent = message || "";
    } else {
      this._uploadLinksStatusEl.textContent = message || "";
    }

    if (this._uploadLinksStatusIcon) {
      this._uploadLinksStatusIcon.className = "hidden";
    }

    if (!message) {
      return;
    }

    let iconClass = "ri-information-line text-grey-60 dark:text-grey-40";
    if (variant === "success") {
      this._uploadLinksStatusEl.className = `${baseClass} text-green-600 dark:text-green-400`;
      iconClass = "ri-check-line text-green-600 dark:text-green-400";
    } else if (variant === "error") {
      this._uploadLinksStatusEl.className = `${baseClass} text-red-600 dark:text-red-400`;
      iconClass = "ri-error-warning-line text-red-600 dark:text-red-400";
    }

    if (this._uploadLinksStatusIcon) {
      this._uploadLinksStatusIcon.className = iconClass;
    }
  }

  async _loadUploadLinks() {
    if (!this._isAdmin || this._uploadLinksLoading) {
      return;
    }
    this._uploadLinksLoading = true;
    this._setUploadLinksStatus(
      translate("settingsUploadLinksStatusLoading"),
      "info",
    );

    try {
      const response = await fetch("/api/admin/upload-links", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`upload_link_list_failed_${response.status}`);
      }

      const payload = await response.json();
      const list = Array.isArray(payload?.links) ? payload.links : [];
      this._uploadLinks = list
        .map((item) => ({
          id: Number.parseInt(item.id, 10) || item.id,
          label: item.label || "",
          description: item.description || "",
          preview: item.preview || "",
          active: Boolean(item.active),
          type: Number.parseInt(item.type, 10) || 0,
          user_name: item.user_name || "",
          created: Number.parseInt(item.created, 10) || 0,
          created_by:
            Number.parseInt(item.created_by, 10) || item.created_by || null,
        }))
        .sort((a, b) => (b.created || 0) - (a.created || 0));
      this._renderUploadLinks();
      this._setUploadLinksStatus("", "info");
    } catch (error) {
      console.error("[SettingsUploadLinksPanel] Failed to load upload links", error);
      this._setUploadLinksStatus(
        translate("settingsUploadLinksStatusLoadingError"),
        "error",
      );
    } finally {
      this._uploadLinksLoading = false;
    }
  }

  _renderUploadLinks() {
    if (!this._uploadLinksTableBody) {
      return;
    }

    if (!Array.isArray(this._uploadLinks) || this._uploadLinks.length === 0) {
      this._uploadLinksTableBody.innerHTML = "";
      if (this._uploadLinksEmpty) {
        this._uploadLinksEmpty.classList.remove("hidden");
      }
      return;
    }

    if (this._uploadLinksEmpty) {
      this._uploadLinksEmpty.classList.add("hidden");
    }

    this._uploadLinksTableBody.innerHTML = "";
    this._uploadLinks.forEach((link) => {
      const row = this._createUploadLinkRow(link);
      if (row) {
        this._uploadLinksTableBody.appendChild(row);
      }
    });

    if (
      this._uploadLinksDetailLinkId !== null &&
      !this._uploadLinks.some(
        (link) => link.id === this._uploadLinksDetailLinkId && link.active,
      )
    ) {
      this._hideUploadLinkDetail();
    }
  }

  _createUploadLinkRow(link) {
    const template = document.getElementById("settings-upload-link-item");
    if (!template) {
      console.error("Template #settings-upload-link-item not found");
      return null;
    }

    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector('[data-role="upload-link-row"]');
    if (!row) {
      return null;
    }

    row.dataset.tokenId = String(link.id);

    // Label
    const labelEl = row.querySelector('[data-role="label"]');
    if (labelEl) {
      labelEl.textContent =
        link.label || translate("settingsUploadLinksLabelFallback");
    }

    // Description (optional)
    const descriptionEl = row.querySelector('[data-role="description"]');
    if (descriptionEl) {
      const description = (link.description || "").trim();
      if (description) {
        descriptionEl.textContent = description;
        descriptionEl.classList.remove("hidden");
      } else {
        descriptionEl.classList.add("hidden");
      }
    }

    // Preview (use template elements instead of createElement)
    const previewBadge = row.querySelector('[data-role="preview-badge"]');
    const previewNone = row.querySelector('[data-role="preview-none"]');
    if (previewBadge && previewNone) {
      const previewValue = (link.preview || "").trim();
      if (previewValue) {
        previewBadge.textContent = previewValue;
        previewBadge.classList.remove("hidden");
        previewNone.classList.add("hidden");
      } else {
        previewBadge.classList.add("hidden");
        previewNone.classList.remove("hidden");
      }
    }

    // Type/User
    const typeUserEl = row.querySelector('[data-role="type-user"]');
    if (typeUserEl) {
      const linkType = link.type || 0;
      const userName = (link.user_name || "").trim();

      if (linkType === 2) {
        // General upload link
        typeUserEl.textContent = translate("settingsUploadLinksTypeGeneral");
      } else if (linkType === 3) {
        // User-specific upload link
        typeUserEl.textContent = userName || translate("settingsUploadLinksTypeUserFallback");
      } else {
        // Unknown type (fallback)
        typeUserEl.textContent = "—";
      }
    }

    // Status (active vs revoked)
    const statusWrapper = row.querySelector('[data-role="status"]');
    const statusIcon = statusWrapper?.querySelector('[data-role="status-icon"]');
    const statusText = statusWrapper?.querySelector('[data-role="status-text"]');
    if (statusWrapper && statusIcon && statusText) {
      const baseClass = "inline-flex items-center gap-2 text-xs font-medium";
      if (link.active) {
        statusWrapper.className = `${baseClass} text-green-600 dark:text-green-400`;
        statusIcon.className = "ri-shield-check-line text-sm leading-4";
        statusText.textContent = translate("settingsUploadLinksStatusActive");
      } else {
        statusWrapper.className = `${baseClass} text-grey-60 dark:text-grey-40`;
        statusIcon.className = "ri-forbid-2-line text-sm leading-4";
        statusText.textContent = translate("settingsUploadLinksStatusRevokedLabel");
      }
    }

    // Created date
    const createdEl = row.querySelector('[data-role="created"]');
    if (createdEl) {
      createdEl.textContent = this._formatUploadLinkTimestamp(link.created);
    }

    // Revoke button / Revoked indicator
    const revokeButton = row.querySelector('[data-role="revoke-button"]');
    const revokedBadge = row.querySelector('[data-role="revoked-indicator"]');
    if (revokeButton && revokedBadge) {
      revokeButton.dataset.action = "revoke";
      revokeButton.dataset.tokenId = String(link.id);

      // Show only the appropriate element based on active status
      if (link.active) {
        // Active link: show revoke button
        revokeButton.classList.remove("hidden");
        // Keep badge hidden
      } else {
        // Revoked link: hide button, show badge
        revokeButton.remove();
        revokedBadge.classList.remove("hidden");
      }
    }

    return row;
  }

  _formatUploadLinkTimestamp(timestamp) {
    const value = Number(timestamp);
    if (!Number.isFinite(value) || value <= 0) {
      return translate("settingsUploadLinksCreatedUnknown");
    }
    try {
      return new Date(value * 1000).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (err) {
      return translate("settingsUploadLinksCreatedUnknown");
    }
  }
}

customElements.define("settings-upload-links-panel", SettingsUploadLinksPanel);
