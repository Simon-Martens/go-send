import { bytes, secondsToL10nId, translateElement } from "../utils.mjs";

class UploadListView extends HTMLElement {
  constructor() {
    super();

    this.elements = {
      fileInput: null,
      fileList: null,
      uploadButton: null,
      totalSize: null,
      fileCount: null,
      addMoreLabel: null,
      expiryContainer: null,
      downloadLimit: null,
      timeLimit: null,
      orLabel: null,
      expiryLabelTop: null,
      expiryLabelBottom: null,
      passwordToggle: null,
      passwordToggleIcon: null,
      passwordField: null,
      passwordInput: null,
      passwordHint: null,
      passwordVisibilityButton: null,
      passwordVisibilityIcon: null,
    };

    this._afterFrame = null;
    this._files = [];
    this._limits = null;
    this._defaults = null;
    this._maxFiles = 0;
    this._translate = null;
    this._password = "";
    this._passwordEnabled = false;
    this._timeLimit = null;
    this._downloadLimit = null;
    this._errorMessage = null;

    this._boundFileSelect = this.handleFileSelect.bind(this);
    this._boundUploadClick = this.handleUploadClick.bind(this);
    this._boundTimeChange = this.handleTimeLimitChange.bind(this);
    this._boundDownloadChange = this.handleDownloadLimitChange.bind(this);
    this._boundPasswordInput = this.handlePasswordInput.bind(this);
    this._boundPasswordToggle = null;
    this._boundPasswordVisibility = null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this._detachListeners();
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
  }

  render() {
    const template = document.getElementById("upload-view-list");
    if (!template) {
      console.error("Template #upload-view-list not found");
      return;
    }

    this._detachListeners();

    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);

    this.elements.fileInput = this.querySelector("#file-upload");
    this.elements.fileList = this.querySelector('[data-role="file-list"]');
    this.elements.uploadButton = this.querySelector('[data-action="upload"]');
    this.elements.totalSize = this.querySelector('[data-role="total-size-value"]');
    this.elements.fileCount = this.querySelector('[data-role="file-count-value"]');
    this.elements.addMoreLabel = this.querySelector('[data-role="add-more-label"]');
    this.elements.error = this.querySelector('[data-role="error"]');

    const optionsContainer = this.querySelector("#upload-area-options-slot");
    if (optionsContainer) {
      const optionsTemplate = document.getElementById("upload-view-list-options");
      if (optionsTemplate && optionsContainer.childElementCount === 0) {
        optionsContainer.appendChild(optionsTemplate.content.cloneNode(true));
      }
      this.elements.expiryContainer = optionsContainer.querySelector('[data-role="expiry-container"]');
      this.elements.downloadLimit = optionsContainer.querySelector('select[data-role="download-limit"]');
      this.elements.timeLimit = optionsContainer.querySelector('select[data-role="time-limit"]');
      this.elements.orLabel = optionsContainer.querySelector('[data-role="or-label"]');
      this.elements.expiryLabelTop = optionsContainer.querySelector('[data-role="expiry-label-top"]');
      this.elements.expiryLabelBottom = optionsContainer.querySelector('[data-role="expiry-label-bottom"]');
      this.elements.passwordToggle = optionsContainer.querySelector('[data-role="password-toggle"]');
      this.elements.passwordToggleIcon = optionsContainer.querySelector('[data-role="password-toggle-icon"]');
      this.elements.passwordField = optionsContainer.querySelector('[data-role="password-field"]');
      this.elements.passwordInput = optionsContainer.querySelector('[data-role="password"]');
      this.elements.passwordHint = optionsContainer.querySelector('[data-role="password-hint"]');
      this.elements.passwordVisibilityButton = optionsContainer.querySelector('[data-role="password-visibility"]');
      this.elements.passwordVisibilityIcon = optionsContainer.querySelector('[data-role="password-visibility-icon"]');
    }

    this._attachBaseListeners();

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
      this.applyPasswordState();
    });
  }

  setState({
    files = [],
    totalSize = 0,
    maxFiles = 0,
    limits = null,
    defaults = null,
    translate = null,
    timeLimit = null,
    downloadLimit = null,
    password = "",
  } = {}) {
    this._files = Array.from(files);
    this._maxFiles = maxFiles || 0;
    this._limits = limits;
    this._defaults = defaults;
    this._translate = translate;

    if (typeof timeLimit === "number" && !Number.isNaN(timeLimit)) {
      this._timeLimit = timeLimit;
    }

    if (typeof downloadLimit === "number" && !Number.isNaN(downloadLimit)) {
      this._downloadLimit = downloadLimit;
    }

    const hasServerPassword = typeof password === "string" && password.length > 0;
    if (this._files.length === 0) {
      this._passwordEnabled = false;
      this._password = "";
    } else if (hasServerPassword) {
      this._passwordEnabled = true;
      this._password = password;
    } else if (password === null && !this._passwordEnabled) {
      this._password = "";
    }

    const resolvedTotalSize = totalSize || this._files.reduce((sum, file) => sum + (file.size || 0), 0);

    this._renderFileList();
    this._updateFileCount();
    this._updateTotalSize(resolvedTotalSize);
    this._renderExpiryControls();
    this._updateOptionValues();
    this._updateStaticLabels(resolvedTotalSize);
    this.applyPasswordState();
    this.updatePasswordHint(this._password.length);
    this.setError(this._errorMessage);
  }

  updateTotalSize(totalSize) {
    this._updateTotalSize(totalSize);
  }

  setUploadEnabled(enabled) {
    if (this.elements.uploadButton) {
      this.elements.uploadButton.disabled = !enabled;
    }
  }

  updateProgress() {}

  updateProgressText() {}

  _renderFileList() {
    if (!this.elements.fileList) {
      return;
    }

    this.elements.fileList.innerHTML = "";

    const template = document.getElementById("upload-view-list-item");
    if (!template) {
      console.error("Template #upload-view-list-item not found");
      return;
    }

    this._files.forEach((file, index) => {
      const fragment = template.content.cloneNode(true);
      const item = fragment.querySelector("li");
      const nameEl = fragment.querySelector('[data-role="file-name"]');
      const metaEl = fragment.querySelector('[data-role="file-meta"]');
      const removeButton = fragment.querySelector('[data-action="remove"]');
      const srLabel = fragment.querySelector('[data-role="remove-label"]');

      if (nameEl) {
        nameEl.textContent = file.name || "Untitled";
      }

      if (metaEl) {
        const path = file.webkitRelativePath || "";
        const sizeLabel = bytes(file.size || 0);
        metaEl.textContent = path ? `${sizeLabel} • ${path}` : sizeLabel;
      }

      if (srLabel) {
        srLabel.textContent = this._translateText("deleteButtonHover", "Remove file");
      }

      if (removeButton) {
        removeButton.dataset.index = String(index);
        removeButton.addEventListener("click", (event) => this.handleRemoveClick(event));
      }

      if (item) {
        this.elements.fileList.appendChild(fragment);
      }
    });
  }

  _renderExpiryControls() {
    const container = this.elements.expiryContainer;
    const downloadSelect = this.elements.downloadLimit;
    const timeSelect = this.elements.timeLimit;
    if (!container || !downloadSelect || !timeSelect) {
      return;
    }

    this._detachOptionListeners();

    const downloadToken = "__DOWNLOAD__";
    const timeToken = "__TIMESPAN__";
    const fallback = `Expires after ${downloadToken} ${this._translateText("or", "or")} ${timeToken} ends`;

    const translated = this._translateText(
      "archiveExpiryInfo",
      fallback,
      {
        downloadCount: downloadToken,
        timespan: timeToken,
      },
    );

    const downloadSplit = translated.split(downloadToken);
    const beforeDownload = downloadSplit[0] || "";
    const afterDownloadRaw = downloadSplit[1] || "";
    const timeSplit = afterDownloadRaw.split(timeToken);
    const between = timeSplit[0] || "";
    const afterTime = timeSplit[1] || "";

    if (this.elements.expiryLabelTop) {
      const labelText = beforeDownload.trim() || this._translateText("expiresAfterLabel", "Expires after");
      this.elements.expiryLabelTop.textContent = labelText;
    }
    if (this.elements.orLabel) {
      const orText = between.trim() || this._translateText("or", "or");
      this.elements.orLabel.textContent = orText;
    }
    if (this.elements.expiryLabelBottom) {
      const suffixText = afterTime.trim() || this._translateText("expiresAfterSuffix", "Ends");
      this.elements.expiryLabelBottom.textContent = suffixText;
    }

    this._downloadLimit = this._populateSelect(
      downloadSelect,
      (this._defaults?.DOWNLOAD_COUNTS || []).filter((count) => {
        const max = this._limits?.MAX_DOWNLOADS;
        return max ? count <= max : true;
      }),
      this._downloadLimit,
      (value) => this._translateText("downloadCount", `${value}`, { num: value }),
    );

    this._timeLimit = this._populateSelect(
      timeSelect,
      (this._defaults?.EXPIRE_TIMES_SECONDS || []).filter((seconds) => {
        const max = this._limits?.MAX_EXPIRE_SECONDS;
        return max ? seconds <= max : true;
      }),
      this._timeLimit,
      (value) => this._formatExpireOption(value),
    );

    this._attachOptionListeners();
  }

  _populateSelect(select, values, selected, formatter) {
    if (!select) {
      return selected;
    }

    const desired = selected !== null && selected !== undefined ? String(selected) : null;
    select.innerHTML = "";

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = formatter(value);
      select.appendChild(option);
    });

    if (desired && Array.from(select.options).some((opt) => opt.value === desired)) {
      select.value = desired;
    } else if (select.options.length > 0) {
      select.selectedIndex = 0;
    }

    return select.options.length > 0 ? Number(select.value) : selected;
  }

  _updateOptionValues() {
    if (this.elements.downloadLimit && this._downloadLimit !== null && this._downloadLimit !== undefined) {
      const value = String(this._downloadLimit);
      if (Array.from(this.elements.downloadLimit.options).some((opt) => opt.value === value)) {
        this.elements.downloadLimit.value = value;
      }
    }

    if (this.elements.timeLimit && this._timeLimit !== null && this._timeLimit !== undefined) {
      const value = String(this._timeLimit);
      if (Array.from(this.elements.timeLimit.options).some((opt) => opt.value === value)) {
        this.elements.timeLimit.value = value;
      }
    }

    if (this.elements.passwordInput) {
      this.elements.passwordInput.value = this._password || "";
    }
  }

  _updateFileCount() {
    if (!this.elements.fileCount) {
      return;
    }
    const count = this._files.length;
    const label = this._translateText("fileCount", count === 1 ? "1 file" : `${count} files`, { num: count });
    const max = this._maxFiles
      ? this._translateText("maxFilesPerArchive", `Max ${this._maxFiles}`, { num: this._maxFiles })
      : "";
    this.elements.fileCount.textContent = max ? `${label} • ${max}` : label;
  }

  _updateTotalSize(totalSize) {
    if (!this.elements.totalSize) {
      return;
    }
    const sizeLabel = bytes(totalSize || 0);
    const translated = this._translateText("totalSize", `${sizeLabel}`, { size: sizeLabel });
    this.elements.totalSize.textContent = translated;
  }

  _updateStaticLabels(totalSize) {
    if (this.elements.addMoreLabel) {
      this.elements.addMoreLabel.textContent = this._translateText("addFilesButton", "Add more files");
    }
    if (this.elements.uploadButton) {
      const uploadLabel = this._translateText("uploadButton", "Upload");
      const uploadSpan = this.elements.uploadButton.querySelector("#uploadButton");
      if (uploadSpan) {
        uploadSpan.textContent = uploadLabel;
      } else {
        this.elements.uploadButton.textContent = uploadLabel;
      }
    }
    this._updateTotalSize(totalSize);
  }

  _attachBaseListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.addEventListener("click", this._boundUploadClick);
    }
    if (this.elements.passwordToggle) {
      this._boundPasswordToggle = this._boundPasswordToggle || this.handlePasswordToggle.bind(this);
      this.elements.passwordToggle.addEventListener("click", this._boundPasswordToggle);
    }
    if (this.elements.passwordVisibilityButton) {
      this._boundPasswordVisibility = this._boundPasswordVisibility || this.togglePasswordVisibility.bind(this);
      this.elements.passwordVisibilityButton.addEventListener("click", this._boundPasswordVisibility);
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener("input", this._boundPasswordInput);
    }
  }

  _attachOptionListeners() {
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.addEventListener("change", this._boundDownloadChange);
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.addEventListener("change", this._boundTimeChange);
    }
  }

  _detachOptionListeners() {
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.removeEventListener("change", this._boundDownloadChange);
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.removeEventListener("change", this._boundTimeChange);
    }
  }

  _detachListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.removeEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.removeEventListener("click", this._boundUploadClick);
    }
    if (this.elements.passwordToggle && this._boundPasswordToggle) {
      this.elements.passwordToggle.removeEventListener("click", this._boundPasswordToggle);
    }
    if (this.elements.passwordVisibilityButton && this._boundPasswordVisibility) {
      this.elements.passwordVisibilityButton.removeEventListener("click", this._boundPasswordVisibility);
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.removeEventListener("input", this._boundPasswordInput);
    }
    this._detachOptionListeners();
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
      if (typeof this._translate === "function") {
        const result = this._translate(key, params);
        if (result) {
          return result;
        }
      } else if (typeof window.translate === "function") {
        const result = window.translate(key, params);
        if (result) {
          return result;
        }
      }
    } catch (err) {
      // ignore missing translation
    }
    return fallback;
  }

  updatePasswordHint(length) {
    if (!this.elements.passwordHint) {
      return;
    }

    if (length >= 4096) {
      this.elements.passwordHint.textContent = this._translateText("maxPasswordLength", "Maximum password length", { length: 4096 });
    } else {
      this.elements.passwordHint.textContent = "";
    }
  }

  handleFileSelect(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("addfiles", {
        bubbles: true,
        detail: { files },
      }),
    );

    event.target.value = "";
  }

  handleUploadClick(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("upload", {
        bubbles: true,
      }),
    );
  }

  handleRemoveClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const index = Number.parseInt(event.currentTarget.dataset.index, 10);
    if (Number.isNaN(index) || index < 0 || index >= this._files.length) {
      return;
    }

    const [file] = this._files.splice(index, 1);
    this._renderFileList();
    const total = this._files.reduce((sum, f) => sum + (f.size || 0), 0);
    this._updateFileCount();
    this._updateTotalSize(total);

    this.dispatchEvent(
      new CustomEvent("removeupload", {
        bubbles: true,
        detail: { file, index },
      }),
    );
  }

  handleTimeLimitChange(event) {
    const value = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(value)) {
      return;
    }
    this._timeLimit = value;
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { timeLimit: value },
      }),
    );
  }

  handleDownloadLimitChange(event) {
    const value = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(value)) {
      return;
    }
    this._downloadLimit = value;
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { downloadLimit: value },
      }),
    );
  }

  handlePasswordInput(event) {
    this._password = event.target.value;
    this._passwordEnabled = true;
    this.updatePasswordHint(this._password.length);
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { password: this._password || null },
      }),
    );
  }

  setError(message) {
    this._errorMessage = message;
    if (!this.elements.error) {
      return;
    }
    if (message) {
      this.elements.error.textContent = message;
      this.elements.error.classList.remove("hidden");
    } else {
      this.elements.error.textContent = "";
      this.elements.error.classList.add("hidden");
    }
  }

  handlePasswordToggle(event) {
    event.preventDefault();
    if (!this.elements.passwordField || !this.elements.passwordToggleIcon) {
      return;
    }

    this._passwordEnabled = !this._passwordEnabled;
    if (!this._passwordEnabled) {
      this._password = "";
      this.updatePasswordHint(0);
      this.dispatchEvent(
        new CustomEvent("updateoptions", {
          bubbles: true,
          detail: { password: null },
        }),
      );
    }

    this.applyPasswordState();

    if (this._passwordEnabled && this.elements.passwordInput) {
      this.elements.passwordInput.focus();
    }
  }

  togglePasswordVisibility(event) {
    event.preventDefault();
    if (!this.elements.passwordInput || !this.elements.passwordVisibilityIcon) {
      return;
    }

    const input = this.elements.passwordInput;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    this.elements.passwordVisibilityIcon.src = isPassword ? "/eye-off.svg" : "/eye.svg";
    input.focus();
  }

  applyPasswordState() {
    if (!this.elements.passwordField || !this.elements.passwordToggleIcon) {
      return;
    }

    if (this._passwordEnabled) {
      this.elements.passwordField.removeAttribute("hidden");
      this.elements.passwordToggleIcon.innerHTML = '<img src="/lock.svg" alt="" class="h-4 w-4" />';
      if (this.elements.passwordInput) {
        this.elements.passwordInput.value = this._password || "";
        this.elements.passwordInput.type = "password";
      }
      if (this.elements.passwordVisibilityIcon) {
        this.elements.passwordVisibilityIcon.src = "/eye.svg";
      }
    } else {
      this.elements.passwordField.setAttribute("hidden", "hidden");
      this.elements.passwordToggleIcon.innerHTML = "";
      if (this.elements.passwordInput) {
        this.elements.passwordInput.value = "";
        this.elements.passwordInput.type = "password";
      }
      if (this.elements.passwordVisibilityIcon) {
        this.elements.passwordVisibilityIcon.src = "/eye.svg";
      }
    }
  }
}

customElements.define("upload-list-view", UploadListView);
