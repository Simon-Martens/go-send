import { bytes, secondsToL10nId, translateElement } from "../utils.mjs";
import storage from "../storage.mjs";

/**
 * <file-edit-view> - Edit metadata for uploaded files
 *
 * Responsibilities:
 * - Display read-only file info (name, size, created date)
 * - Allow editing: name, download limit, expiry time, password
 * - Validate changes and call OwnedFile update methods
 * - Dispatch save/cancel events
 */
class FileEditView extends HTMLElement {
  constructor() {
    super();

    this.ownedFile = null;
    this._templateMounted = false;
    this._postMountFrame = null;

    // Track changes
    this._originalName = "";
    this._originalDlimit = null;
    this._originalExpiresAt = null;
    this._originalHasPassword = false;

    this._newName = "";
    this._newDlimit = null;
    this._newTimeLimit = null; // Seconds from now
    this._newPassword = "";
    this._passwordEnabled = false;
    this._isMultiFile = false;

    // UI elements
    this.elements = {
      currentFileName: null,
      fileMeta: null,
      fileIcon: null,
      nameContainer: null,
      fileNameInput: null,
      nameError: null,
      archiveNameContainer: null,
      archiveNameInput: null,
      archiveNameError: null,
      downloadLimit: null,
      timeLimit: null,
      passwordToggle: null,
      passwordToggleIcon: null,
      passwordField: null,
      passwordInput: null,
      passwordHint: null,
      passwordVisibilityButton: null,
      passwordVisibilityIcon: null,
      error: null,
      saveButton: null,
      cancelButton: null,
    };

    // Bound handlers
    this._boundHandlers = {
      save: this.handleSave.bind(this),
      cancel: this.handleCancel.bind(this),
      downloadChange: this.handleDownloadLimitChange.bind(this),
      timeChange: this.handleTimeLimitChange.bind(this),
      nameInput: this.handleNameInput.bind(this),
      archiveNameInput: this.handleArchiveNameInput.bind(this),
      passwordToggle: this.handlePasswordToggle.bind(this),
      passwordInput: this.handlePasswordInput.bind(this),
      passwordVisibility: this.togglePasswordVisibility.bind(this),
    };
  }

  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("file-edit-view");
      if (!template) {
        console.error("Template #file-edit-view not found");
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

      this._queryElements();
      this._attachListeners();
      translateElement(this);
    });
  }

  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }

    this._detachListeners();
  }

  _queryElements() {
    this.elements.currentFileName = this.querySelector(
      '[data-role="current-file-name"]',
    );
    this.elements.fileMeta = this.querySelector('[data-role="file-meta"]');
    this.elements.fileIcon = this.querySelector('[data-role="file-icon"]');
    this.elements.nameContainer = this.querySelector(
      '[data-role="name-container"]',
    );
    this.elements.fileNameInput = this.querySelector(
      '[data-role="file-name-input"]',
    );
    this.elements.nameError = this.querySelector('[data-role="name-error"]');
    this.elements.archiveNameContainer = this.querySelector(
      '[data-role="archive-name-container"]',
    );
    this.elements.archiveNameInput = this.querySelector(
      '[data-role="archive-name-input"]',
    );
    this.elements.archiveNameError = this.querySelector(
      '[data-role="archive-name-error"]',
    );
    this.elements.downloadLimit = this.querySelector(
      '[data-role="download-limit"]',
    );
    this.elements.timeLimit = this.querySelector('[data-role="time-limit"]');
    this.elements.passwordToggle = this.querySelector(
      '[data-role="password-toggle"]',
    );
    this.elements.passwordToggleIcon = this.querySelector(
      '[data-role="password-toggle-icon"]',
    );
    this.elements.passwordField = this.querySelector(
      '[data-role="password-field"]',
    );
    this.elements.passwordInput = this.querySelector(
      '[data-role="password-input"]',
    );
    this.elements.passwordHint = this.querySelector(
      '[data-role="password-hint"]',
    );
    this.elements.passwordVisibilityButton = this.querySelector(
      '[data-role="password-visibility"]',
    );
    this.elements.passwordVisibilityIcon = this.querySelector(
      '[data-role="password-visibility-icon"]',
    );
    this.elements.error = this.querySelector('[data-role="error"]');
    this.elements.saveButton = this.querySelector('[data-action="save"]');
    this.elements.cancelButton = this.querySelector('[data-action="cancel"]');
  }

  _attachListeners() {
    if (this.elements.saveButton) {
      console.log("[FileEditView] Attaching save button listener");
      this.elements.saveButton.addEventListener(
        "click",
        this._boundHandlers.save,
      );
      // Add debug click handler to see if clicks are registering
      this.elements.saveButton.addEventListener("click", (e) => {
        console.log("[FileEditView] Save button clicked (debug handler)", e);
      });
    }
    if (this.elements.cancelButton) {
      this.elements.cancelButton.addEventListener(
        "click",
        this._boundHandlers.cancel,
      );
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.addEventListener(
        "change",
        this._boundHandlers.downloadChange,
      );
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.addEventListener(
        "change",
        this._boundHandlers.timeChange,
      );
    }
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.addEventListener(
        "input",
        this._boundHandlers.nameInput,
      );
    }
    if (this.elements.archiveNameInput) {
      this.elements.archiveNameInput.addEventListener(
        "input",
        this._boundHandlers.archiveNameInput,
      );
    }
    if (this.elements.passwordToggle) {
      this.elements.passwordToggle.addEventListener(
        "click",
        this._boundHandlers.passwordToggle,
      );
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener(
        "input",
        this._boundHandlers.passwordInput,
      );
    }
    if (this.elements.passwordVisibilityButton) {
      this.elements.passwordVisibilityButton.addEventListener(
        "click",
        this._boundHandlers.passwordVisibility,
      );
    }
  }

  _detachListeners() {
    if (this.elements.saveButton) {
      this.elements.saveButton.removeEventListener(
        "click",
        this._boundHandlers.save,
      );
    }
    if (this.elements.cancelButton) {
      this.elements.cancelButton.removeEventListener(
        "click",
        this._boundHandlers.cancel,
      );
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.removeEventListener(
        "change",
        this._boundHandlers.downloadChange,
      );
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.removeEventListener(
        "change",
        this._boundHandlers.timeChange,
      );
    }
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.removeEventListener(
        "input",
        this._boundHandlers.nameInput,
      );
    }
    if (this.elements.archiveNameInput) {
      this.elements.archiveNameInput.removeEventListener(
        "input",
        this._boundHandlers.archiveNameInput,
      );
    }
    if (this.elements.passwordToggle) {
      this.elements.passwordToggle.removeEventListener(
        "click",
        this._boundHandlers.passwordToggle,
      );
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.removeEventListener(
        "input",
        this._boundHandlers.passwordInput,
      );
    }
    if (this.elements.passwordVisibilityButton) {
      this.elements.passwordVisibilityButton.removeEventListener(
        "click",
        this._boundHandlers.passwordVisibility,
      );
    }
  }

  /**
   * Public API: Set the file to edit
   */
  setFile(ownedFile) {
    if (!ownedFile) {
      console.error("[FileEditView] setFile called with null/undefined");
      return;
    }

    console.log("[FileEditView] setFile called, template mounted:", this._templateMounted);
    console.log("[FileEditView] Elements available:", {
      currentFileName: !!this.elements.currentFileName,
      fileNameInput: !!this.elements.fileNameInput,
      downloadLimit: !!this.elements.downloadLimit,
    });

    this.ownedFile = ownedFile;
    this._isMultiFile =
      ownedFile.manifest &&
      ownedFile.manifest.files &&
      ownedFile.manifest.files.length > 1;

    // Store original values
    this._originalName = ownedFile.name || "";
    this._originalDlimit = ownedFile.dlimit || 1;
    this._originalExpiresAt = ownedFile.expiresAt || Date.now();
    this._originalHasPassword = ownedFile.hasPassword || false;

    // Initialize editable state
    this._newName = this._originalName;
    this._newDlimit = this._originalDlimit;
    this._newPassword = "";
    this._passwordEnabled = this._originalHasPassword;

    // Calculate time limit from expiresAt
    const now = Date.now();
    const remainingMs = this._originalExpiresAt - now;
    this._newTimeLimit = Math.max(0, Math.floor(remainingMs / 1000));

    // If elements aren't ready yet, wait for them
    if (!this._templateMounted || !this.elements.currentFileName) {
      console.log("[FileEditView] Template not ready, waiting...");
      requestAnimationFrame(() => {
        console.log("[FileEditView] Retrying setFile after animation frame");
        this.setFile(ownedFile);
      });
      return;
    }

    // Render UI
    this._renderFileInfo();
    this._renderNameInput();
    this._renderExpiryControls();
    this._renderPasswordState();
    this._clearError();

    // Re-enable save button (in case it was disabled from previous save)
    if (this.elements.saveButton) {
      this.elements.saveButton.disabled = false;
    }

    // Reset password toggle styling (in case it was disabled)
    if (this.elements.passwordToggle && !this._originalHasPassword) {
      this.elements.passwordToggle.disabled = false;
      this.elements.passwordToggle.style.opacity = "";
      this.elements.passwordToggle.style.cursor = "";
    }
    if (this.elements.passwordInput && !this._originalHasPassword) {
      this.elements.passwordInput.disabled = false;
      this.elements.passwordInput.style.cursor = "";
    }

    console.log("[FileEditView] UI rendered successfully");
  }

  _renderFileInfo() {
    if (!this.ownedFile) {
      return;
    }

    // Set file icon
    if (this.elements.fileIcon && this.ownedFile.name) {
      const fileName = this.ownedFile.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        this.elements.fileIcon.className =
          "ri-folder-6-line h-8 w-8 flex-shrink-0 text-primary mr-3 text-3xl leading-8";
      } else {
        this.elements.fileIcon.className =
          "ri-file-ai-line h-8 w-8 flex-shrink-0 text-primary mr-3 text-3xl leading-8";
      }
    }

    // Set current file name (read-only display)
    if (this.elements.currentFileName) {
      this.elements.currentFileName.textContent = this.ownedFile.name || "Untitled";
    }

    // Set file meta info
    if (this.elements.fileMeta) {
      const sizeLabel = bytes(this.ownedFile.size || 0);
      const createdDate = this._formatDate(this.ownedFile.createdAt);
      this.elements.fileMeta.textContent = `${sizeLabel} • ${this._translateText("uploadedLabel", "Uploaded")} ${createdDate}`;
    }
  }

  _renderNameInput() {
    if (this._isMultiFile) {
      // Show archive name input
      if (this.elements.nameContainer) {
        this.elements.nameContainer.classList.add("hidden");
      }
      if (this.elements.archiveNameContainer) {
        this.elements.archiveNameContainer.classList.remove("hidden");
      }
      if (this.elements.archiveNameInput) {
        // Remove .zip extension for editing
        const nameWithoutExt = this._originalName.replace(/\.zip$/i, "");
        this.elements.archiveNameInput.value = nameWithoutExt;
      }
    } else {
      // Show single file name input
      if (this.elements.archiveNameContainer) {
        this.elements.archiveNameContainer.classList.add("hidden");
      }
      if (this.elements.nameContainer) {
        this.elements.nameContainer.classList.remove("hidden");
      }
      if (this.elements.fileNameInput) {
        this.elements.fileNameInput.value = this._originalName;
      }
    }
  }

  _renderExpiryControls() {
    if (!window.LIMITS || !window.DEFAULTS) {
      console.warn("[FileEditView] Missing LIMITS or DEFAULTS configuration");
      return;
    }

    // Populate download limit select
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.innerHTML = "";

      // Get current download count to filter options
      const currentDtotal = this.ownedFile.dtotal || 0;

      const downloadCounts = (window.DEFAULTS.DOWNLOAD_COUNTS || []).filter(
        (count) => {
          const max = window.LIMITS.MAX_DOWNLOADS;
          const withinMax = max ? count <= max : true;
          // Only show counts >= current download count
          return withinMax && count >= currentDtotal;
        },
      );

      downloadCounts.forEach((count) => {
        const option = document.createElement("option");
        option.value = String(count);
        option.textContent = this._translateText(
          "downloadCount",
          `${count}`,
          { num: count },
        );
        this.elements.downloadLimit.appendChild(option);
      });

      // Set current value
      if (
        downloadCounts.includes(this._originalDlimit) ||
        downloadCounts.length === 0
      ) {
        this.elements.downloadLimit.value = String(this._originalDlimit);
      } else {
        // If current dlimit not in options, select closest valid option
        const closest = downloadCounts.reduce((prev, curr) =>
          Math.abs(curr - this._originalDlimit) <
          Math.abs(prev - this._originalDlimit)
            ? curr
            : prev,
        );
        this.elements.downloadLimit.value = String(closest);
        this._newDlimit = closest;
      }
    }

    // Populate time limit select
    if (this.elements.timeLimit) {
      this.elements.timeLimit.innerHTML = "";

      // Calculate minimum time needed (time already passed since creation)
      const now = Date.now();
      const timeSinceCreation = now - (this.ownedFile.createdAt || now);
      const minTimeSeconds = Math.ceil(timeSinceCreation / 1000);

      const expireTimes = (window.DEFAULTS.EXPIRE_TIMES_SECONDS || []).filter(
        (seconds) => {
          const max = window.LIMITS.MAX_EXPIRE_SECONDS;
          const withinMax = max ? seconds <= max : true;
          // Only show times that would extend beyond current time
          return withinMax && seconds > minTimeSeconds;
        },
      );

      expireTimes.forEach((seconds) => {
        const option = document.createElement("option");
        option.value = String(seconds);
        option.textContent = this._formatExpireOption(seconds);
        this.elements.timeLimit.appendChild(option);
      });

      // Set value closest to remaining time
      if (expireTimes.length === 0) {
        console.warn("[FileEditView] No valid expiry times available");
        return;
      }

      if (expireTimes.includes(this._newTimeLimit)) {
        this.elements.timeLimit.value = String(this._newTimeLimit);
      } else {
        const closest = expireTimes.reduce((prev, curr) =>
          Math.abs(curr - this._newTimeLimit) < Math.abs(prev - this._newTimeLimit)
            ? curr
            : prev,
        );
        this.elements.timeLimit.value = String(closest);
        this._newTimeLimit = closest;
      }
    }
  }

  _renderPasswordState() {
    if (!this.elements.passwordField || !this.elements.passwordToggleIcon) {
      return;
    }

    const lockIcon = this.elements.passwordToggleIcon.querySelector(
      '[data-role="lock-icon"]',
    );

    // If file already has a password, disable the toggle
    if (this._originalHasPassword) {
      if (this.elements.passwordToggle) {
        this.elements.passwordToggle.disabled = true;
        this.elements.passwordToggle.style.opacity = "0.5";
        this.elements.passwordToggle.style.cursor = "not-allowed";
      }

      // Force password enabled state
      this._passwordEnabled = true;

      this.elements.passwordField.removeAttribute("hidden");
      if (lockIcon) {
        lockIcon.classList.remove("hidden");
      }
      this.elements.passwordToggleIcon.classList.add("bg-primary");

      if (this.elements.passwordInput) {
        this.elements.passwordInput.disabled = true;
        this.elements.passwordInput.value = "••••••••";
        this.elements.passwordInput.style.cursor = "not-allowed";
      }

      if (this.elements.passwordHint) {
        this.elements.passwordHint.textContent = this._translateText(
          "passwordAlreadySet",
          "Password already set (cannot be changed here)"
        );
      }

      return;
    }

    // Normal password state handling for files without password
    if (this._passwordEnabled) {
      this.elements.passwordField.removeAttribute("hidden");

      if (lockIcon) {
        lockIcon.classList.remove("hidden");
      }

      this.elements.passwordToggleIcon.classList.add("bg-primary");

      if (this.elements.passwordInput) {
        this.elements.passwordInput.value = this._newPassword || "";
        this.elements.passwordInput.type = "password";
      }
      if (this.elements.passwordVisibilityIcon) {
        this.elements.passwordVisibilityIcon.src = "/eye.svg";
      }
    } else {
      this.elements.passwordField.setAttribute("hidden", "hidden");

      if (lockIcon) {
        lockIcon.classList.add("hidden");
      }

      this.elements.passwordToggleIcon.classList.remove("bg-primary");

      if (this.elements.passwordInput) {
        this.elements.passwordInput.value = "";
        this.elements.passwordInput.type = "password";
      }
      if (this.elements.passwordVisibilityIcon) {
        this.elements.passwordVisibilityIcon.src = "/eye.svg";
      }
    }
  }

  /**
   * Event Handlers
   */

  handleNameInput(event) {
    this._newName = event.target.value;
    this._clearNameError();
  }

  handleArchiveNameInput(event) {
    const value = event.target.value;
    this._newName = value ? `${value.trim()}.zip` : value;
    this._clearNameError();
  }

  handleDownloadLimitChange(event) {
    this._newDlimit = Number.parseInt(event.target.value, 10);
    console.log("[FileEditView] Download limit changed to:", this._newDlimit);
    console.log("[FileEditView] Save button disabled?", this.elements.saveButton?.disabled);
  }

  handleTimeLimitChange(event) {
    this._newTimeLimit = Number.parseInt(event.target.value, 10);
    console.log("[FileEditView] Time limit changed to:", this._newTimeLimit);
    console.log("[FileEditView] Save button disabled?", this.elements.saveButton?.disabled);
  }

  handlePasswordToggle(event) {
    event.preventDefault();
    this._passwordEnabled = !this._passwordEnabled;
    if (!this._passwordEnabled) {
      this._newPassword = "";
    }
    this._renderPasswordState();

    if (this._passwordEnabled && this.elements.passwordInput) {
      this.elements.passwordInput.focus();
    }
  }

  handlePasswordInput(event) {
    this._newPassword = event.target.value;
    this._updatePasswordHint(this._newPassword.length);
  }

  togglePasswordVisibility(event) {
    event.preventDefault();
    if (!this.elements.passwordInput || !this.elements.passwordVisibilityIcon) {
      return;
    }

    const input = this.elements.passwordInput;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    this.elements.passwordVisibilityIcon.src = isPassword
      ? "/eye-off.svg"
      : "/eye.svg";
    input.focus();
  }

  async handleSave(event) {
    event.preventDefault();
    console.log("[FileEditView] handleSave called");
    console.log("[FileEditView] Changes:", {
      nameChanged: this._newName !== this._originalName,
      dlimitChanged: this._newDlimit !== this._originalDlimit,
      expiryChanged: Math.abs((Date.now() + this._newTimeLimit * 1000) - this._originalExpiresAt) > 1000,
      passwordEnabled: this._passwordEnabled,
    });

    if (!this.ownedFile) {
      console.error("[FileEditView] No file set");
      return;
    }

    // Disable save button
    if (this.elements.saveButton) {
      console.log("[FileEditView] Disabling save button");
      this.elements.saveButton.disabled = true;
    }

    this._clearError();

    try {
      // Validate and update name if changed
      if (this._newName !== this._originalName) {
        const validationError = this._validateName(this._newName);
        if (validationError) {
          this._showNameError(validationError);
          if (this.elements.saveButton) {
            this.elements.saveButton.disabled = false;
          }
          return;
        }

        await this.ownedFile.updateName(this._newName);
      }

      // Update download limit if changed
      if (this._newDlimit !== this._originalDlimit) {
        await this.ownedFile.changeLimit(this._newDlimit);
      }

      // Update expiry if changed
      const newExpiresAt = Date.now() + this._newTimeLimit * 1000;
      if (Math.abs(newExpiresAt - this._originalExpiresAt) > 1000) {
        // Allow 1s tolerance
        await this.ownedFile.updateExpiry(newExpiresAt);
      }

      // Update password if changed (only for files without existing password)
      if (!this._originalHasPassword && this._passwordEnabled && this._newPassword) {
        await this.ownedFile.setPassword(this._newPassword);
      }

      // Persist changes to local storage
      storage.writeFile(this.ownedFile);
      console.log("[FileEditView] Changes persisted to storage");

      // Re-enable save button on success
      if (this.elements.saveButton) {
        this.elements.saveButton.disabled = false;
      }

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent("save", {
          bubbles: true,
          detail: { ownedFile: this.ownedFile },
        }),
      );
    } catch (error) {
      console.error("[FileEditView] Save failed", error);
      this._showError(
        this._translateText("fileSaveError", "Failed to save changes"),
      );

      if (this.elements.saveButton) {
        this.elements.saveButton.disabled = false;
      }
    }
  }

  handleCancel(event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true,
      }),
    );
  }

  /**
   * Validation
   */

  _validateName(name) {
    if (!name || !name.trim()) {
      return "fileNameRequired";
    }

    const trimmed = name.trim();

    // Forbidden characters
    const forbiddenCharsRegex = /[<>:"/\\|?*]/;
    if (forbiddenCharsRegex.test(trimmed)) {
      return "archiveNameInvalidChars";
    }

    // Can't end with dot or space
    if (/[.\s]$/.test(trimmed)) {
      return "archiveNameInvalidEnd";
    }

    // Windows reserved names
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    const nameWithoutExt = trimmed.replace(/\.[^.]+$/, ""); // Remove any extension

    if (reservedNames.test(nameWithoutExt)) {
      return "archiveNameReserved";
    }

    return null;
  }

  /**
   * UI Updates
   */

  _showNameError(errorKey) {
    const errorEl = this._isMultiFile
      ? this.elements.archiveNameError
      : this.elements.nameError;
    const inputEl = this._isMultiFile
      ? this.elements.archiveNameInput
      : this.elements.fileNameInput;

    if (!errorEl || !inputEl) {
      return;
    }

    const errorMessage = this._translateText(errorKey, "Invalid filename");
    errorEl.textContent = errorMessage;
    errorEl.classList.remove("hidden");

    inputEl.classList.add("border-red-500", "dark:border-red-500");
  }

  _clearNameError() {
    if (this.elements.nameError) {
      this.elements.nameError.textContent = "";
      this.elements.nameError.classList.add("hidden");
    }
    if (this.elements.archiveNameError) {
      this.elements.archiveNameError.textContent = "";
      this.elements.archiveNameError.classList.add("hidden");
    }
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.classList.remove(
        "border-red-500",
        "dark:border-red-500",
      );
    }
    if (this.elements.archiveNameInput) {
      this.elements.archiveNameInput.classList.remove(
        "border-red-500",
        "dark:border-red-500",
      );
    }
  }

  _showError(message) {
    if (!this.elements.error) {
      return;
    }
    this.elements.error.textContent = message;
    this.elements.error.classList.remove("hidden");
  }

  _clearError() {
    if (!this.elements.error) {
      return;
    }
    this.elements.error.textContent = "";
    this.elements.error.classList.add("hidden");
  }

  _updatePasswordHint(length) {
    if (!this.elements.passwordHint) {
      return;
    }

    if (length >= 4096) {
      this.elements.passwordHint.textContent = this._translateText(
        "maxPasswordLength",
        "Maximum password length",
        { length: 4096 },
      );
    } else {
      this.elements.passwordHint.textContent = "";
    }
  }

  /**
   * Helpers
   */

  _formatDate(timestamp) {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const uploadDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const locale = document.documentElement.lang || navigator.language || "en";

    if (uploadDate.getTime() === today.getTime()) {
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    if (date.getFullYear() === now.getFullYear()) {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
      }).format(date);
    }

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  _formatExpireOption(seconds) {
    const l10n = secondsToL10nId(seconds);
    const fallback = this._formatDuration(seconds);
    return this._translateText(l10n.id, fallback, l10n);
  }

  _formatDuration(seconds) {
    const MINUTE = 60;
    const HOUR = 3600;
    const DAY = 86400;

    if (seconds % DAY === 0) {
      const days = seconds / DAY;
      return days === 1 ? "1 day" : `${days} days`;
    }
    if (seconds % HOUR === 0) {
      const hours = seconds / HOUR;
      return hours === 1 ? "1 hour" : `${hours} hours`;
    }
    if (seconds % MINUTE === 0) {
      const minutes = seconds / MINUTE;
      return minutes === 1 ? "1 minute" : `${minutes} minutes`;
    }
    return `${seconds} seconds`;
  }

  _translateText(key, fallback, params) {
    try {
      if (typeof window.translate === "function") {
        const result = window.translate(key, params);
        if (result) {
          return result;
        }
      }
    } catch (err) {
      // Ignore missing translation
    }
    return fallback;
  }
}

// Register the custom element
customElements.define("file-edit-view", FileEditView);
