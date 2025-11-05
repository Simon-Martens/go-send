import {
  qrcode_default
} from "./chunk-U2YGIKKI.js";
import {
  fetchUsers
} from "./chunk-2XG27J2F.js";
import {
  bytes,
  copyToClipboard,
  secondsToL10nId,
  timeLeft,
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/upload-area-empty.mjs
var UploadEmptyView = class extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._fileInput = null;
    this._dragCounter = 0;
    this._dropZone = null;
    this._boundFileSelect = this.handleFileSelect.bind(this);
    this._boundDragEnter = this.handleDragEnter.bind(this);
    this._boundDragOver = this.handleDragOver.bind(this);
    this._boundDragLeave = this.handleDragLeave.bind(this);
    this._boundDrop = this.handleDrop.bind(this);
    this._boundDropZoneClick = this.handleDropZoneClick.bind(this);
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    if (this._fileInput) {
      this._fileInput.removeEventListener("change", this._boundFileSelect);
      this._fileInput = null;
    }
    this._removeDragListeners();
  }
  render() {
    const template = document.getElementById("upload-view-empty");
    if (!template) {
      console.error("Template #upload-view-empty not found");
      return;
    }
    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);
    this._fileInput = this.querySelector("#file-upload");
    this._errorEl = this.querySelector('[data-role="error"]');
    this._dropZone = this.querySelector(".border-2.border-dashed");
    if (this._fileInput) {
      this._fileInput.addEventListener("change", this._boundFileSelect);
    }
    this._setupDragListeners();
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
    });
  }
  setConfig({ orClickText, addFilesLabel, noticeHTML } = {}) {
    if (typeof orClickText === "string") {
      const orClickEl = this.querySelector("#orClickWithSize");
      if (orClickEl) {
        orClickEl.textContent = orClickText;
      }
    }
    if (typeof addFilesLabel === "string") {
      const addLabel = this.querySelector("#addFilesButton");
      if (addLabel) {
        addLabel.textContent = addFilesLabel;
      }
    }
    const noticeEl = this.querySelector("#upload-area-default-notice");
    if (noticeEl) {
      if (noticeHTML) {
        noticeEl.innerHTML = noticeHTML;
        noticeEl.classList.remove("hidden");
      } else {
        noticeEl.textContent = "";
        noticeEl.classList.add("hidden");
      }
    }
  }
  focusFileInput() {
    if (this._fileInput) {
      this._fileInput.focus();
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
        detail: { files }
      })
    );
    event.target.value = "";
  }
  setError(message) {
    if (!this._errorEl) {
      return;
    }
    if (message) {
      this._errorEl.textContent = message;
      this._errorEl.classList.remove("hidden");
    } else {
      this._errorEl.textContent = "";
      this._errorEl.classList.add("hidden");
    }
  }
  handleDropZoneClick(event) {
    if (event.target.closest('label[for="file-upload"]')) {
      return;
    }
    if (this._fileInput) {
      this._fileInput.click();
    }
  }
  _setupDragListeners() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.addEventListener("dragenter", this._boundDragEnter);
    this._dropZone.addEventListener("dragover", this._boundDragOver);
    this._dropZone.addEventListener("dragleave", this._boundDragLeave);
    this._dropZone.addEventListener("drop", this._boundDrop);
    this._dropZone.addEventListener("click", this._boundDropZoneClick);
  }
  _removeDragListeners() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.removeEventListener("dragenter", this._boundDragEnter);
    this._dropZone.removeEventListener("dragover", this._boundDragOver);
    this._dropZone.removeEventListener("dragleave", this._boundDragLeave);
    this._dropZone.removeEventListener("drop", this._boundDrop);
    this._dropZone.removeEventListener("click", this._boundDropZoneClick);
    this._dropZone = null;
  }
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter++;
    if (event.dataTransfer && event.dataTransfer.types.includes("Files")) {
      this._showDragFeedback();
    }
  }
  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter--;
    if (this._dragCounter === 0) {
      this._hideDragFeedback();
    }
  }
  handleDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter = 0;
    this._hideDragFeedback();
    const files = Array.from(((_a = event.dataTransfer) == null ? void 0 : _a.files) || []);
    if (files.length > 0) {
      this.dispatchEvent(
        new CustomEvent("addfiles", {
          bubbles: true,
          detail: { files }
        })
      );
    }
  }
  _showDragFeedback() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.classList.remove("border-grey-transparent", "dark:border-grey-60");
    this._dropZone.classList.add("border-primary", "bg-blue-10", "dark:bg-blue-90", "dark:border-blue-40");
  }
  _hideDragFeedback() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.classList.remove("border-primary", "bg-blue-10", "dark:bg-blue-90", "dark:border-blue-40");
    this._dropZone.classList.add("border-grey-transparent", "dark:border-grey-60");
  }
};
customElements.define("upload-empty-view", UploadEmptyView);

// src/ui/upload-area-list.mjs
var UploadListView = class extends HTMLElement {
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
      dropZone: null,
      archiveNameContainer: null,
      archiveNameInput: null,
      recipientSelect: null
    };
    this._afterFrame = null;
    this._users = [];
    this._recipientUserId = null;
    this._recipientPublicKey = null;
    this._recipientListenerAttached = false;
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
    this._dragCounter = 0;
    this._boundFileSelect = this.handleFileSelect.bind(this);
    this._boundUploadClick = this.handleUploadClick.bind(this);
    this._boundTimeChange = this.handleTimeLimitChange.bind(this);
    this._boundDownloadChange = this.handleDownloadLimitChange.bind(this);
    this._boundPasswordInput = this.handlePasswordInput.bind(this);
    this._boundPasswordToggle = null;
    this._boundPasswordVisibility = null;
    this._boundDragEnter = this.handleDragEnter.bind(this);
    this._boundDragOver = this.handleDragOver.bind(this);
    this._boundDragLeave = this.handleDragLeave.bind(this);
    this._boundDrop = this.handleDrop.bind(this);
    this._boundArchiveNameInput = this.handleArchiveNameInput.bind(this);
    this._boundRecipientChange = this.handleRecipientChange.bind(this);
    this._archiveNameValid = true;
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    this._detachListeners();
    this._removeDragListeners();
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
    this.elements.totalSize = this.querySelector(
      '[data-role="total-size-value"]'
    );
    this.elements.fileCount = this.querySelector(
      '[data-role="file-count-value"]'
    );
    this.elements.addMoreLabel = this.querySelector(
      '[data-role="add-more-label"]'
    );
    this.elements.error = this.querySelector('[data-role="error"]');
    this.elements.dropZone = this.querySelector(".flex.flex-col");
    const optionsContainer = this.querySelector("#upload-area-options-slot");
    if (optionsContainer) {
      const optionsTemplate = document.getElementById(
        "upload-view-list-options"
      );
      if (optionsTemplate && optionsContainer.childElementCount === 0) {
        optionsContainer.appendChild(optionsTemplate.content.cloneNode(true));
      }
      this.elements.expiryContainer = optionsContainer.querySelector(
        '[data-role="expiry-container"]'
      );
      this.elements.downloadLimit = optionsContainer.querySelector(
        'select[data-role="download-limit"]'
      );
      this.elements.timeLimit = optionsContainer.querySelector(
        'select[data-role="time-limit"]'
      );
      this.elements.orLabel = optionsContainer.querySelector(
        '[data-role="or-label"]'
      );
      this.elements.expiryLabelTop = optionsContainer.querySelector(
        '[data-role="expiry-label-top"]'
      );
      this.elements.expiryLabelBottom = optionsContainer.querySelector(
        '[data-role="expiry-label-bottom"]'
      );
      this.elements.passwordToggle = optionsContainer.querySelector(
        '[data-role="password-toggle"]'
      );
      this.elements.passwordToggleIcon = optionsContainer.querySelector(
        '[data-role="password-toggle-icon"]'
      );
      this.elements.passwordField = optionsContainer.querySelector(
        '[data-role="password-field"]'
      );
      this.elements.passwordInput = optionsContainer.querySelector(
        '[data-role="password"]'
      );
      this.elements.passwordHint = optionsContainer.querySelector(
        '[data-role="password-hint"]'
      );
      this.elements.passwordVisibilityButton = optionsContainer.querySelector(
        '[data-role="password-visibility"]'
      );
      this.elements.passwordVisibilityIcon = optionsContainer.querySelector(
        '[data-role="password-visibility-icon"]'
      );
      this.elements.archiveNameContainer = optionsContainer.querySelector(
        '[data-role="archive-name-container"]'
      );
      this.elements.archiveNameInput = optionsContainer.querySelector(
        '[data-role="archive-name"]'
      );
    }
    const recipientSlot = this.querySelector("#upload-recipient-slot");
    if (recipientSlot) {
      const recipientTemplate = document.getElementById("upload-view-recipient");
      if (recipientTemplate && recipientSlot.childElementCount === 0) {
        recipientSlot.appendChild(recipientTemplate.content.cloneNode(true));
      }
      this.elements.recipientSelect = recipientSlot.querySelector(
        '[data-role="recipient-select"]'
      );
    }
    this._loadUsers();
    this._attachBaseListeners();
    this._setupDragListeners();
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
    password = ""
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
    this._updateArchiveNameVisibility();
    this.applyPasswordState();
    this.updatePasswordHint(this._password.length);
    this.setError(this._errorMessage);
    this._updateUploadButtonState();
  }
  updateTotalSize(totalSize) {
    this._updateTotalSize(totalSize);
  }
  setUploadEnabled(enabled) {
    if (this.elements.uploadButton) {
      this.elements.uploadButton.disabled = !enabled;
    }
  }
  updateProgress() {
  }
  updateProgressText() {
  }
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
      const iconEl = fragment.querySelector('[data-role="file-icon"]');
      if (nameEl) {
        nameEl.textContent = file.name || "Untitled";
      }
      if (metaEl) {
        const path = file.webkitRelativePath || "";
        const sizeLabel = bytes(file.size || 0);
        metaEl.textContent = path ? `${sizeLabel} \u2022 ${path}` : sizeLabel;
      }
      if (iconEl && file.name) {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith(".zip")) {
          iconEl.className = "ri-folder-6-line h-8 w-8 flex-shrink-0 text-primary mr-3 text-3xl leading-8";
        }
      }
      if (srLabel) {
        srLabel.textContent = this._translateText(
          "deleteButtonHover",
          "Remove file"
        );
      }
      if (removeButton) {
        removeButton.dataset.index = String(index);
        removeButton.addEventListener(
          "click",
          (event) => this.handleRemoveClick(event)
        );
      }
      if (item) {
        this.elements.fileList.appendChild(fragment);
      }
    });
  }
  _renderExpiryControls() {
    var _a, _b;
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
    const translated = this._translateText("archiveExpiryInfo", fallback, {
      downloadCount: downloadToken,
      timespan: timeToken
    });
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
      const suffixText = afterTime.trim() || this._translateText("expiresAfterSuffix", "");
      this.elements.expiryLabelBottom.textContent = suffixText;
    }
    this._downloadLimit = this._populateSelect(
      downloadSelect,
      (((_a = this._defaults) == null ? void 0 : _a.DOWNLOAD_COUNTS) || []).filter((count) => {
        var _a2;
        const max = (_a2 = this._limits) == null ? void 0 : _a2.MAX_DOWNLOADS;
        return max ? count <= max : true;
      }),
      this._downloadLimit,
      (value) => this._translateText("downloadCount", `${value}`, { num: value })
    );
    this._timeLimit = this._populateSelect(
      timeSelect,
      (((_b = this._defaults) == null ? void 0 : _b.EXPIRE_TIMES_SECONDS) || []).filter((seconds) => {
        var _a2;
        const max = (_a2 = this._limits) == null ? void 0 : _a2.MAX_EXPIRE_SECONDS;
        return max ? seconds <= max : true;
      }),
      this._timeLimit,
      (value) => this._formatExpireOption(value)
    );
    this._attachOptionListeners();
  }
  _populateSelect(select, values, selected, formatter) {
    if (!select) {
      return selected;
    }
    const desired = selected !== null && selected !== void 0 ? String(selected) : null;
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
    if (this.elements.downloadLimit && this._downloadLimit !== null && this._downloadLimit !== void 0) {
      const value = String(this._downloadLimit);
      if (Array.from(this.elements.downloadLimit.options).some(
        (opt) => opt.value === value
      )) {
        this.elements.downloadLimit.value = value;
      }
    }
    if (this.elements.timeLimit && this._timeLimit !== null && this._timeLimit !== void 0) {
      const value = String(this._timeLimit);
      if (Array.from(this.elements.timeLimit.options).some(
        (opt) => opt.value === value
      )) {
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
    const label = this._translateText(
      "fileCount",
      count === 1 ? "1 file" : `${count} files`,
      { num: count }
    );
    const max = this._maxFiles ? this._translateText("maxFilesPerArchive", `Max ${this._maxFiles}`, {
      num: this._maxFiles
    }) : "";
    this.elements.fileCount.textContent = max ? `${label} \u2022 ${max}` : label;
  }
  _updateTotalSize(totalSize) {
    if (!this.elements.totalSize) {
      return;
    }
    const sizeLabel = bytes(totalSize || 0);
    const translated = this._translateText("totalSize", `${sizeLabel}`, {
      size: sizeLabel
    });
    this.elements.totalSize.textContent = translated;
  }
  _updateStaticLabels(totalSize) {
    if (this.elements.addMoreLabel) {
      this.elements.addMoreLabel.textContent = this._translateText(
        "addFilesButton",
        "Add more files"
      );
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
  _updateArchiveNameVisibility() {
    if (!this.elements.archiveNameContainer) {
      return;
    }
    if (this._files.length > 1) {
      const wasHidden = this.elements.archiveNameContainer.classList.contains("hidden");
      this.elements.archiveNameContainer.classList.remove("hidden");
      if (wasHidden) {
        translateElement(this.elements.archiveNameContainer);
      }
      if (this.elements.archiveNameInput && !this.elements.archiveNameInput.value) {
        this.elements.archiveNameInput.value = "Send-Archive";
      }
    } else {
      this.elements.archiveNameContainer.classList.add("hidden");
      this._archiveNameValid = true;
      this._showArchiveNameError(null);
    }
  }
  _attachBaseListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.addEventListener(
        "click",
        this._boundUploadClick
      );
    }
    if (this.elements.passwordToggle) {
      this._boundPasswordToggle = this._boundPasswordToggle || this.handlePasswordToggle.bind(this);
      this.elements.passwordToggle.addEventListener(
        "click",
        this._boundPasswordToggle
      );
    }
    if (this.elements.passwordVisibilityButton) {
      this._boundPasswordVisibility = this._boundPasswordVisibility || this.togglePasswordVisibility.bind(this);
      this.elements.passwordVisibilityButton.addEventListener(
        "click",
        this._boundPasswordVisibility
      );
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener(
        "input",
        this._boundPasswordInput
      );
    }
    if (this.elements.archiveNameInput) {
      this.elements.archiveNameInput.addEventListener(
        "input",
        this._boundArchiveNameInput
      );
    }
  }
  _attachOptionListeners() {
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.addEventListener(
        "change",
        this._boundDownloadChange
      );
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.addEventListener("change", this._boundTimeChange);
    }
  }
  _detachOptionListeners() {
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.removeEventListener(
        "change",
        this._boundDownloadChange
      );
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.removeEventListener(
        "change",
        this._boundTimeChange
      );
    }
  }
  _detachListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.removeEventListener(
        "change",
        this._boundFileSelect
      );
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.removeEventListener(
        "click",
        this._boundUploadClick
      );
    }
    if (this.elements.passwordToggle && this._boundPasswordToggle) {
      this.elements.passwordToggle.removeEventListener(
        "click",
        this._boundPasswordToggle
      );
    }
    if (this.elements.passwordVisibilityButton && this._boundPasswordVisibility) {
      this.elements.passwordVisibilityButton.removeEventListener(
        "click",
        this._boundPasswordVisibility
      );
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.removeEventListener(
        "input",
        this._boundPasswordInput
      );
    }
    if (this.elements.archiveNameInput) {
      this.elements.archiveNameInput.removeEventListener(
        "input",
        this._boundArchiveNameInput
      );
    }
    this._detachRecipientListener();
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
    }
    return fallback;
  }
  updatePasswordHint(length) {
    if (!this.elements.passwordHint) {
      return;
    }
    if (length >= 4096) {
      this.elements.passwordHint.textContent = this._translateText(
        "maxPasswordLength",
        "Maximum password length",
        { length: 4096 }
      );
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
        detail: { files }
      })
    );
    event.target.value = "";
  }
  handleUploadClick(event) {
    event.preventDefault();
    if (this._files.length > 1 && this.elements.archiveNameInput) {
      const archiveName = this.elements.archiveNameInput.value;
      const validationError = this._validateArchiveName(archiveName);
      if (validationError) {
        this._archiveNameValid = false;
        this._showArchiveNameError(validationError);
        this._updateUploadButtonState();
        return;
      }
    }
    this.dispatchEvent(
      new CustomEvent("upload", {
        bubbles: true
      })
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
    this._updateArchiveNameVisibility();
    this._updateUploadButtonState();
    this.dispatchEvent(
      new CustomEvent("removeupload", {
        bubbles: true,
        detail: { file, index }
      })
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
        detail: { timeLimit: value }
      })
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
        detail: { downloadLimit: value }
      })
    );
  }
  handlePasswordInput(event) {
    this._password = event.target.value;
    this._passwordEnabled = true;
    this.updatePasswordHint(this._password.length);
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { password: this._password || null }
      })
    );
  }
  handleArchiveNameInput(event) {
    const archiveName = event.target.value;
    const validationError = this._validateArchiveName(archiveName);
    if (validationError) {
      this._archiveNameValid = false;
      this._showArchiveNameError(validationError);
      this._updateUploadButtonState();
      return;
    }
    this._archiveNameValid = true;
    this._showArchiveNameError(null);
    this._updateUploadButtonState();
    const trimmedName = archiveName.trim();
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { archiveName: trimmedName || null }
      })
    );
  }
  _validateArchiveName(name) {
    if (!name || !name.trim()) {
      return null;
    }
    const trimmed = name.trim();
    const forbiddenCharsRegex = /[<>:"/\\|?*]/;
    if (forbiddenCharsRegex.test(trimmed)) {
      return "archiveNameInvalidChars";
    }
    if (/[.\s]$/.test(trimmed)) {
      return "archiveNameInvalidEnd";
    }
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    const nameWithoutExt = trimmed.replace(/\.zip$/i, "");
    if (reservedNames.test(nameWithoutExt)) {
      return "archiveNameReserved";
    }
    return null;
  }
  _showArchiveNameError(errorKey) {
    var _a;
    if (!this.elements.archiveNameInput) {
      return;
    }
    const errorEl = (_a = this.elements.archiveNameContainer) == null ? void 0 : _a.querySelector(
      '[data-role="archive-name-error"]'
    );
    if (!errorEl) {
      return;
    }
    if (errorKey) {
      let errorMessage = "Invalid filename";
      try {
        const translate = window.translate || this._translate;
        if (typeof translate === "function") {
          const translated = translate(errorKey);
          if (translated && translated !== errorKey) {
            errorMessage = translated;
          }
        }
      } catch (err) {
        console.warn(`Translation failed for key: ${errorKey}`, err);
      }
      errorEl.textContent = errorMessage;
      errorEl.classList.remove("hidden");
      this.elements.archiveNameInput.classList.add(
        "border-red-500",
        "dark:border-red-500"
      );
    } else {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
      this.elements.archiveNameInput.classList.remove(
        "border-red-500",
        "dark:border-red-500"
      );
    }
  }
  _updateUploadButtonState() {
    if (!this.elements.uploadButton) {
      return;
    }
    const shouldDisable = this._files.length > 1 && !this._archiveNameValid;
    this.elements.uploadButton.disabled = shouldDisable;
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
          detail: { password: null }
        })
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
    const lockIcon = this.elements.passwordToggleIcon.querySelector(
      '[data-role="lock-icon"]'
    );
    if (this._passwordEnabled) {
      this.elements.passwordField.removeAttribute("hidden");
      if (lockIcon) {
        lockIcon.classList.remove("hidden");
      }
      this.elements.passwordToggleIcon.classList.add("bg-primary");
      if (this.elements.passwordInput) {
        this.elements.passwordInput.value = this._password || "";
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
  _setupDragListeners() {
    if (!this.elements.dropZone) {
      return;
    }
    this.elements.dropZone.addEventListener("dragenter", this._boundDragEnter);
    this.elements.dropZone.addEventListener("dragover", this._boundDragOver);
    this.elements.dropZone.addEventListener("dragleave", this._boundDragLeave);
    this.elements.dropZone.addEventListener("drop", this._boundDrop);
  }
  _removeDragListeners() {
    if (!this.elements.dropZone) {
      return;
    }
    this.elements.dropZone.removeEventListener(
      "dragenter",
      this._boundDragEnter
    );
    this.elements.dropZone.removeEventListener("dragover", this._boundDragOver);
    this.elements.dropZone.removeEventListener(
      "dragleave",
      this._boundDragLeave
    );
    this.elements.dropZone.removeEventListener("drop", this._boundDrop);
    this.elements.dropZone = null;
  }
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter++;
    if (event.dataTransfer && event.dataTransfer.types.includes("Files")) {
      this._showDragFeedback();
    }
  }
  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter--;
    if (this._dragCounter === 0) {
      this._hideDragFeedback();
    }
  }
  handleDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    this._dragCounter = 0;
    this._hideDragFeedback();
    const files = Array.from(((_a = event.dataTransfer) == null ? void 0 : _a.files) || []);
    if (files.length > 0) {
      this.dispatchEvent(
        new CustomEvent("addfiles", {
          bubbles: true,
          detail: { files }
        })
      );
    }
  }
  _showDragFeedback() {
    if (!this.elements.dropZone) {
      return;
    }
    this.elements.dropZone.classList.add(
      "ring-2",
      "ring-primary",
      "ring-inset",
      "bg-blue-10",
      "dark:bg-blue-90"
    );
  }
  _hideDragFeedback() {
    if (!this.elements.dropZone) {
      return;
    }
    this.elements.dropZone.classList.remove(
      "ring-2",
      "ring-primary",
      "ring-inset",
      "bg-blue-10",
      "dark:bg-blue-90"
    );
  }
  async _loadUsers() {
    if (!this.elements.recipientSelect) {
      return;
    }
    try {
      const users = await fetchUsers();
      this._users = users || [];
      this._populateRecipientSelect();
    } catch (err) {
      console.warn("[UploadListView] Failed to load users for recipient selection", err);
      this._users = [];
    }
  }
  _populateRecipientSelect() {
    if (!this.elements.recipientSelect) {
      return;
    }
    const unspecifiedOption = this.elements.recipientSelect.querySelector('[data-role="recipient-unspecified"]');
    this.elements.recipientSelect.innerHTML = "";
    if (unspecifiedOption) {
      this.elements.recipientSelect.appendChild(unspecifiedOption.cloneNode(true));
    }
    this._users.forEach((user) => {
      const option = document.createElement("option");
      option.value = String(user.id);
      option.textContent = user.name || user.email;
      option.dataset.publicKey = user.encryption_public_key;
      this.elements.recipientSelect.appendChild(option);
    });
    if (this._users.length === 1) {
      const user = this._users[0];
      this.elements.recipientSelect.value = String(user.id);
      this.elements.recipientSelect.disabled = true;
      this._recipientUserId = user.id;
      this._recipientPublicKey = user.encryption_public_key;
      this._updateRecipientHint(true, user.name || user.email);
      this.dispatchEvent(
        new CustomEvent("updateoptions", {
          bubbles: true,
          detail: {
            recipientUserId: user.id,
            recipientPublicKey: user.encryption_public_key,
            recipientName: user.name || user.email
          }
        })
      );
    } else {
      this.elements.recipientSelect.disabled = false;
    }
    this._attachRecipientListener();
  }
  _attachRecipientListener() {
    if (this.elements.recipientSelect && !this._recipientListenerAttached) {
      this.elements.recipientSelect.addEventListener("change", this._boundRecipientChange);
      this._recipientListenerAttached = true;
    }
  }
  _detachRecipientListener() {
    if (this.elements.recipientSelect && this._recipientListenerAttached) {
      this.elements.recipientSelect.removeEventListener("change", this._boundRecipientChange);
      this._recipientListenerAttached = false;
    }
  }
  handleRecipientChange(event) {
    var _a;
    const selectedValue = event.target.value;
    if (!selectedValue) {
      this._recipientUserId = null;
      this._recipientPublicKey = null;
      this._updateRecipientHint(false);
      this.dispatchEvent(
        new CustomEvent("updateoptions", {
          bubbles: true,
          detail: {
            recipientUserId: null,
            recipientPublicKey: null,
            recipientName: null
          }
        })
      );
      return;
    }
    const userId = Number.parseInt(selectedValue, 10);
    if (Number.isNaN(userId)) {
      console.warn("[UploadListView] Invalid recipient user ID", selectedValue);
      return;
    }
    const selectedOption = event.target.selectedOptions[0];
    const publicKey = selectedOption == null ? void 0 : selectedOption.dataset.publicKey;
    const recipientName = ((_a = selectedOption == null ? void 0 : selectedOption.textContent) == null ? void 0 : _a.trim()) || "";
    if (!publicKey) {
      console.warn("[UploadListView] Selected user has no public key", userId);
      return;
    }
    this._recipientUserId = userId;
    this._recipientPublicKey = publicKey;
    this._updateRecipientHint(true);
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: {
          recipientUserId: userId,
          recipientPublicKey: publicKey,
          recipientName
        }
      })
    );
  }
  _updateRecipientHint(hasRecipient, recipientName = null) {
    const recipientSlot = this.querySelector("#upload-recipient-slot");
    if (!recipientSlot) {
      return;
    }
    const hintElement = recipientSlot.querySelector("#recipientHint");
    if (!hintElement) {
      return;
    }
    if (hasRecipient) {
      const hintTextSpan = hintElement.querySelector('[data-type="lang"]');
      if (hintTextSpan) {
        if (recipientName && this.elements.recipientSelect && this.elements.recipientSelect.disabled) {
          hintTextSpan.textContent = this._translateText(
            "recipientLockedHint",
            `This upload link is restricted to uploads for ${recipientName}`,
            { userName: recipientName }
          );
        } else {
          hintTextSpan.textContent = this._translateText(
            "recipientHintSelected",
            "The recipient can see, download and decrypt the file."
          );
        }
      }
      hintElement.classList.remove("hidden");
    } else {
      hintElement.classList.add("hidden");
    }
  }
};
customElements.define("upload-list-view", UploadListView);

// src/ui/upload-area-uploading.mjs
var UploadUploadingView = class extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._progressBar = null;
    this._progressPercent = null;
    this._boundHandleCancel = this.handleCancel.bind(this);
  }
  connectedCallback() {
    this.render();
    this.addEventListener("click", this._boundHandleCancel);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._boundHandleCancel);
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
  }
  render() {
    const template = document.getElementById("upload-view-uploading");
    if (!template) {
      console.error("Template #upload-view-uploading not found");
      return;
    }
    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);
    this._progressBar = this.querySelector('[data-role="progress-bar"]');
    this._progressPercent = this.querySelector('[data-role="progress-percent"]');
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
    });
  }
  handleCancel(event) {
    const target = event.target.closest('[data-action="cancel"]');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent("cancel", {
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Update upload progress
   * @param {number} ratio - Progress ratio from 0.0 to 1.0
   * @param {number} bytesUploaded - Bytes uploaded so far
   * @param {number} totalBytes - Total bytes to upload
   */
  updateProgress(ratio, bytesUploaded, totalBytes) {
    if (this._progressBar) {
      this._progressBar.value = ratio;
    }
    if (this._progressPercent) {
      const percent = Math.round(ratio * 100);
      this._progressPercent.textContent = `${percent}%`;
    }
  }
  /**
   * Set file information
   * @param {string} name - File name
   * @param {number} size - File size in bytes
   */
  setFileInfo(name, size) {
    const nameEl = this.querySelector('[data-role="file-name"]');
    const sizeEl = this.querySelector('[data-role="file-size"]');
    if (nameEl) {
      nameEl.textContent = name;
    }
    if (sizeEl) {
      sizeEl.textContent = bytes(size);
    }
  }
  /**
   * Set expiry information
   * @param {string} expiryText - Formatted expiry text
   */
  setExpiryInfo(expiryText) {
    const expiryEl = this.querySelector('[data-role="expiry-info"]');
    if (expiryEl) {
      expiryEl.textContent = expiryText;
    }
  }
};
customElements.define("upload-uploading-view", UploadUploadingView);

// src/ui/upload-area-complete.mjs
var UploadCompleteView = class extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._ownedFile = null;
    this._boundCopy = this.handleCopy.bind(this);
    this._boundOk = this.handleOk.bind(this);
    this._boundLinkClick = this.handleLinkClick.bind(this);
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    this.unbindEventHandlers();
  }
  render() {
    const template = document.getElementById("upload-view-complete");
    if (!template) {
      console.error("Template #upload-view-complete not found");
      return;
    }
    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);
    this.bindEventHandlers();
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
      if (this._ownedFile) {
        this.setUploadedFile(this._ownedFile);
      }
    });
  }
  bindEventHandlers() {
    const copyBtn = this.querySelector('[data-action="copy"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    const linkInput = this.querySelector('[data-role="download-link"]');
    if (copyBtn) {
      copyBtn.addEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.addEventListener("click", this._boundOk);
    }
    if (linkInput) {
      linkInput.addEventListener("click", this._boundLinkClick);
    }
  }
  unbindEventHandlers() {
    const copyBtn = this.querySelector('[data-action="copy"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    const linkInput = this.querySelector('[data-role="download-link"]');
    if (copyBtn) {
      copyBtn.removeEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.removeEventListener("click", this._boundOk);
    }
    if (linkInput) {
      linkInput.removeEventListener("click", this._boundLinkClick);
    }
  }
  setUploadedFile(ownedFile) {
    if (!ownedFile) {
      console.warn("No ownedFile provided to setUploadedFile");
      return;
    }
    this._ownedFile = ownedFile;
    const filenameEl = this.querySelector('[data-role="filename"]');
    if (filenameEl && ownedFile.name) {
      filenameEl.textContent = ownedFile.name;
    }
    const linkInput = this.querySelector('[data-role="download-link"]');
    if (linkInput && ownedFile.url) {
      linkInput.value = ownedFile.url;
      requestAnimationFrame(() => {
        linkInput.select();
        linkInput.focus();
      });
    }
    this.generateQRCode(ownedFile.url);
    const copySection = this.querySelector('[data-role="copy-section"]');
    const recipientNotice = this.querySelector('[data-role="recipient-notice-complete"]');
    if (ownedFile.recipients && ownedFile.recipients.length > 0) {
      if (copySection) {
        copySection.classList.add("hidden");
      }
      if (recipientNotice) {
        recipientNotice.classList.remove("hidden");
      }
    } else {
      if (copySection) {
        copySection.classList.remove("hidden");
      }
      if (recipientNotice) {
        recipientNotice.classList.add("hidden");
      }
    }
  }
  generateQRCode(url) {
    if (!url) {
      return;
    }
    const container = this.querySelector('[data-role="qr-container"]');
    if (!container) {
      return;
    }
    try {
      const qr = qrcode_default(0, "L");
      qr.addData(url);
      qr.make();
      const svg = qr.createSvgTag({
        scalable: true,
        cellSize: 4,
        margin: 4
      });
      container.innerHTML = svg;
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        svgEl.style.maxWidth = "200px";
        svgEl.style.height = "auto";
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      container.innerHTML = '<p class="text-sm text-grey-60">QR code unavailable</p>';
    }
  }
  handleCopy(event) {
    event.preventDefault();
    const linkInput = this.querySelector('[data-role="download-link"]');
    if (!linkInput || !linkInput.value) {
      return;
    }
    const url = linkInput.value;
    const success = copyToClipboard(url);
    if (success) {
      this.dispatchEvent(
        new CustomEvent("copy", {
          bubbles: true,
          detail: { url }
        })
      );
      const copyBtn = event.currentTarget;
      const iconEl = copyBtn.querySelector('[data-role="copy-icon"]');
      if (iconEl) {
        const originalClass = iconEl.className;
        iconEl.className = "ri-check-line text-lg leading-4";
        setTimeout(() => {
          iconEl.className = originalClass;
        }, 2e3);
      }
    }
  }
  handleOk(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("complete-acknowledged", {
        bubbles: true,
        detail: { file: this._ownedFile }
      })
    );
  }
  handleLinkClick(event) {
    event.currentTarget.select();
  }
};
customElements.define("upload-complete-view", UploadCompleteView);

// src/ui/upload-area-error.mjs
var UploadErrorView = class extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._errorMessage = null;
    this._boundRetry = this.handleRetry.bind(this);
    this._boundOk = this.handleOk.bind(this);
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    this.unbindEventHandlers();
  }
  render() {
    const template = document.getElementById("upload-view-error");
    if (!template) {
      console.error("Template #upload-view-error not found");
      return;
    }
    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);
    this.bindEventHandlers();
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
      if (this._errorMessage) {
        this.setErrorMessage(this._errorMessage);
      }
    });
  }
  bindEventHandlers() {
    const retryBtn = this.querySelector('[data-action="retry"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    console.log("[UploadErrorView] Binding event handlers", { retryBtn, okBtn });
    if (retryBtn) {
      retryBtn.addEventListener("click", this._boundRetry);
    }
    if (okBtn) {
      okBtn.addEventListener("click", this._boundOk);
    }
  }
  unbindEventHandlers() {
    const retryBtn = this.querySelector('[data-action="retry"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    if (retryBtn) {
      retryBtn.removeEventListener("click", this._boundRetry);
    }
    if (okBtn) {
      okBtn.removeEventListener("click", this._boundOk);
    }
  }
  setErrorMessage(message) {
    this._errorMessage = message;
    const messageEl = this.querySelector('[data-role="error-message"]');
    if (messageEl && message) {
      messageEl.textContent = message;
    }
  }
  handleRetry(event) {
    console.log("[UploadErrorView] Retry button clicked");
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("retry", {
        bubbles: true
      })
    );
    console.log("[UploadErrorView] Retry event dispatched");
  }
  handleOk(event) {
    console.log("[UploadErrorView] OK button clicked");
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("error-dismiss", {
        bubbles: true
      })
    );
    console.log("[UploadErrorView] Error-dismiss event dispatched");
  }
};
customElements.define("upload-error-view", UploadErrorView);

// src/ui/upload-area.mjs
var VIEW_TAGS = {
  empty: "upload-empty-view",
  list: "upload-list-view",
  uploading: "upload-uploading-view",
  complete: "upload-complete-view",
  error: "upload-error-view"
};
var UploadAreaElement = class extends HTMLElement {
  constructor() {
    super();
    this._currentView = null;
    this._currentViewKey = null;
    this._app = null;
    this._errorMessage = null;
    this._isComplete = false;
    this._isError = false;
    this._uploadedFile = null;
    this._boundPaste = this.handlePaste.bind(this);
  }
  connectedCallback() {
    if (!this._app) {
      this._app = this.closest("go-send");
    }
    window.addEventListener("paste", this._boundPaste);
    this.refresh();
  }
  disconnectedCallback() {
    window.removeEventListener("paste", this._boundPaste);
    this._currentView = null;
  }
  refresh() {
    const state = this._getAppState();
    if (!state) {
      return;
    }
    if (this._isError) {
      this._ensureView("error");
      this._configureErrorView();
      return;
    }
    if (this._isComplete) {
      this._ensureView("complete");
      this._configureCompleteView();
      return;
    }
    const archive = state.archive;
    const isUploading = Boolean(state.uploading && state.transfer);
    const hasFiles = Boolean(archive && archive.files && archive.files.length > 0);
    let desiredView = "empty";
    if (isUploading) {
      desiredView = "uploading";
    } else if (hasFiles) {
      desiredView = "list";
    }
    this._ensureView(desiredView);
    switch (desiredView) {
      case "empty":
        this._configureEmptyView(state);
        break;
      case "list":
        this._configureListView(state);
        break;
      case "uploading":
        this._configureUploadingView(state);
        break;
      default:
        break;
    }
    this._applyErrorMessage();
  }
  setUploadButtonEnabled(enabled) {
    if (this._currentViewKey === "list" && this._currentView && typeof this._currentView.setUploadEnabled === "function") {
      this._currentView.setUploadEnabled(enabled);
    }
  }
  updateProgress(ratio, bytesUploaded, totalBytes) {
    if (this._currentViewKey === "uploading" && this._currentView && typeof this._currentView.updateProgress === "function") {
      this._currentView.updateProgress(ratio, bytesUploaded, totalBytes);
    } else if (this._currentViewKey === "list" && this._currentView && typeof this._currentView.updateProgress === "function") {
      this._currentView.updateProgress(ratio, bytesUploaded, totalBytes);
    }
  }
  updateProgressText(text) {
    if (this._currentViewKey === "uploading" && this._currentView && typeof this._currentView.setStatus === "function") {
      this._currentView.setStatus(text);
    } else if (this._currentViewKey === "list" && this._currentView && typeof this._currentView.updateProgressText === "function") {
      this._currentView.updateProgressText(text);
    }
  }
  ensureView(viewKey) {
    this._ensureView(viewKey);
  }
  setUploadedFile(ownedFile) {
    this._isComplete = true;
    this._uploadedFile = ownedFile;
    if (this._currentViewKey === "complete" && this._currentView && typeof this._currentView.setUploadedFile === "function") {
      this._currentView.setUploadedFile(ownedFile);
    }
  }
  clearComplete() {
    this._isComplete = false;
    this._uploadedFile = null;
    this.refresh();
  }
  showErrorView(message) {
    console.log("[UploadArea] showErrorView() called with message:", message);
    this._errorMessage = message;
    this._isComplete = false;
    this._isError = true;
    this._ensureView("error");
    this._configureErrorView();
    console.log("[UploadArea] Error view displayed");
  }
  clearError() {
    console.log("[UploadArea] clearError() called");
    this._isError = false;
    this._errorMessage = null;
    console.log("[UploadArea] Error state cleared, calling refresh()");
    this.refresh();
  }
  _configureErrorView() {
    const view = this._currentView;
    if (!view || typeof view.setErrorMessage !== "function") {
      return;
    }
    if (this._errorMessage) {
      view.setErrorMessage(this._errorMessage);
    }
  }
  _ensureView(viewKey) {
    if (this._currentViewKey === viewKey && this._currentView && this._currentView.parentElement === this) {
      return;
    }
    this.innerHTML = "";
    const tagName = VIEW_TAGS[viewKey] || VIEW_TAGS.empty;
    const view = document.createElement(tagName);
    this.appendChild(view);
    this._currentView = view;
    this._currentViewKey = viewKey;
    this._applyErrorMessage();
  }
  _configureEmptyView(state) {
    var _a;
    const view = this._currentView;
    if (!view || typeof view.setConfig !== "function") {
      return;
    }
    const limits = state.LIMITS || {};
    const sizeLabel = bytes(limits.MAX_FILE_SIZE || 0);
    const orClickText = this._translate("orClickWithSize", `or click to select files (max ${sizeLabel})`, { size: sizeLabel }, state);
    const addFilesLabel = this._translate("addFilesButton", "Select files", null, state);
    const noticeHTML = ((_a = state.WEB_UI) == null ? void 0 : _a.UPLOAD_AREA_NOTICE_HTML) || "";
    view.setConfig({ orClickText, addFilesLabel, noticeHTML });
  }
  _configureListView(state) {
    const view = this._currentView;
    if (!view || typeof view.setState !== "function") {
      return;
    }
    const archive = state.archive;
    const limits = state.LIMITS || {};
    const defaults = state.DEFAULTS || {};
    view.setState({
      files: (archive == null ? void 0 : archive.files) || [],
      totalSize: (archive == null ? void 0 : archive.size) || 0,
      maxFiles: limits.MAX_FILES_PER_ARCHIVE || 0,
      limits,
      defaults,
      translate: state.translate,
      timeLimit: (archive == null ? void 0 : archive.timeLimit) ?? null,
      downloadLimit: (archive == null ? void 0 : archive.dlimit) ?? null,
      password: (archive == null ? void 0 : archive.password) ?? ""
    });
  }
  showError(message) {
    this._errorMessage = message || null;
    this._applyErrorMessage();
  }
  _applyErrorMessage() {
    if (this._currentView && typeof this._currentView.setError === "function") {
      this._currentView.setError(this._errorMessage);
    }
  }
  _configureUploadingView(state) {
    const view = this._currentView;
    if (!view) {
      return;
    }
    const archive = state.archive;
    if (archive && typeof view.setFileInfo === "function") {
      view.setFileInfo(archive.name || "File", archive.size || 0);
    }
    if (archive && typeof view.setExpiryInfo === "function") {
      const expiresAt = Date.now() + 500 + (archive.timeLimit || 0) * 1e3;
      const downloadsLeft = archive.dlimit || 1;
      const timeLeftMs = expiresAt - Date.now();
      const timeLeftData = timeLeft(timeLeftMs);
      const translate = window.translate || ((key) => key);
      const downloadCountText = translate("downloadCount", { num: downloadsLeft });
      const timeText = translate(timeLeftData.id, timeLeftData);
      const expiryText = translate("archiveExpiryInfo", {
        downloadCount: downloadCountText,
        timespan: timeText
      });
      view.setExpiryInfo(expiryText);
    }
    const transfer = state.transfer;
    if (transfer && typeof view.updateProgress === "function") {
      const ratio = transfer.progressRatio || 0;
      const [uploadedBytes = 0, totalBytes = 0] = transfer.progress || [];
      view.updateProgress(ratio, uploadedBytes, totalBytes);
    }
  }
  _configureCompleteView() {
    const view = this._currentView;
    if (!view || !this._uploadedFile) {
      return;
    }
    if (typeof view.setUploadedFile === "function") {
      view.setUploadedFile(this._uploadedFile);
    }
  }
  _getAppState() {
    var _a;
    if (!this._app || !this._app.state) {
      this._app = this.closest("go-send");
    }
    return ((_a = this._app) == null ? void 0 : _a.state) || null;
  }
  _translate(key, fallback, params, state) {
    const translator = (state == null ? void 0 : state.translate) || window.translate;
    if (typeof translator === "function") {
      try {
        const value = translator(key, params);
        if (value) {
          return value;
        }
      } catch (err) {
      }
    }
    return fallback;
  }
  async handlePaste(event) {
    var _a, _b, _c;
    const state = this._getAppState();
    if (!state) {
      return;
    }
    if (state.uploading || this._isComplete) {
      return;
    }
    const targetType = (_a = event.target) == null ? void 0 : _a.type;
    if (["password", "text", "email", "textarea"].includes(targetType)) {
      return;
    }
    if (((_b = event.target) == null ? void 0 : _b.tagName) === "TEXTAREA") {
      return;
    }
    const items = Array.from(((_c = event.clipboardData) == null ? void 0 : _c.items) || []);
    const transferFiles = items.filter((item) => item.kind === "file");
    const strings = items.filter((item) => item.kind === "string");
    if (transferFiles.length > 0) {
      const promises = transferFiles.map(async (item, i) => {
        const blob = item.getAsFile();
        if (!blob) {
          return null;
        }
        const name = await this._getStringFromItem(strings[i]);
        const file = new File([blob], name || blob.name || "file", { type: blob.type });
        return file;
      });
      const files = (await Promise.all(promises)).filter((f) => !!f);
      if (files.length > 0) {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent("addfiles", {
            bubbles: true,
            detail: { files }
          })
        );
      }
    } else if (strings.length > 0) {
      const textContent = await this._getStringFromItem(strings[0]);
      if (textContent) {
        event.preventDefault();
        const file = new File([textContent], "pasted.txt", { type: "text/plain" });
        this.dispatchEvent(
          new CustomEvent("addfiles", {
            bubbles: true,
            detail: { files: [file] }
          })
        );
      }
    }
  }
  _getStringFromItem(item) {
    if (!item) {
      return Promise.resolve("");
    }
    return new Promise((resolve) => {
      item.getAsString(resolve);
    });
  }
};
customElements.define("upload-area", UploadAreaElement);
//# sourceMappingURL=upload-area-NPGAGIFA.js.map
