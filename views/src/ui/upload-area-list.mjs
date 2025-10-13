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
      timeLimit: null,
      downloadLimit: null,
      passwordInput: null,
    };

    this._afterFrame = null;
    this._files = [];
    this._limits = null;
    this._defaults = null;
    this._maxFiles = 0;
    this._translate = null;
    this._password = "";
    this._timeLimit = null;
    this._downloadLimit = null;

    this._boundFileSelect = this.handleFileSelect.bind(this);
    this._boundUploadClick = this.handleUploadClick.bind(this);
    this._boundTimeChange = this.handleTimeLimitChange.bind(this);
    this._boundDownloadChange = this.handleDownloadLimitChange.bind(this);
    this._boundPasswordInput = this.handlePasswordInput.bind(this);
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

    const optionsContainer = this.querySelector("#upload-area-options-slot");
    if (optionsContainer) {
      const optionsTemplate = document.getElementById("upload-view-list-options");
      if (optionsTemplate && optionsContainer.childElementCount === 0) {
        optionsContainer.appendChild(optionsTemplate.content.cloneNode(true));
      }
      this.elements.expiryContainer = optionsContainer.querySelector('[data-role="expiry-container"]');
      this.elements.passwordInput = optionsContainer.querySelector('[data-role="password"]');
    }

    this._attachBaseListeners();

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }
    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
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
    this._timeLimit = timeLimit;
    this._downloadLimit = downloadLimit;
    this._password = password || "";

    const resolvedTotalSize = totalSize || this._files.reduce((sum, file) => sum + (file.size || 0), 0);

    this._renderFileList();
    this._updateFileCount();
    this._updateTotalSize(resolvedTotalSize);
    this._renderExpiryControls();
    this._updateOptionValues();
    this._updateStaticLabels(resolvedTotalSize);
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
    // list view does not show uploading progress (handled by uploading view)
  }

  updateProgressText() {
    // no-op for symmetry
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
    if (!container) {
      return;
    }

    const downloadSelect = this._buildSelect({
      values: (this._defaults?.DOWNLOAD_COUNTS || []).filter((count) => {
        const max = this._limits?.MAX_DOWNLOADS;
        return max ? count <= max : true;
      }),
      selected: this._downloadLimit,
      formatter: (value) => this._translateText("downloadCount", `${value}`, { num: value }),
      role: "download-limit",
    });

    const timeSelect = this._buildSelect({
      values: (this._defaults?.EXPIRE_TIMES_SECONDS || []).filter((seconds) => {
        const max = this._limits?.MAX_EXPIRE_SECONDS;
        return max ? seconds <= max : true;
      }),
      selected: this._timeLimit,
      formatter: (value) => this._formatExpireOption(value),
      role: "time-limit",
    });

    const downloadToken = '<span data-slot="download"></span>';
    const timeToken = '<span data-slot="timespan"></span>';
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

    const topLabelText = beforeDownload.trim() || this._translateText("expiresAfterLabel", "Expires after");
    const orText = between.trim() || this._translateText("or", "or");
    const bottomLabelText = afterTime.trim() || this._translateText("expiresAfterSuffix", "Ends");

    container.innerHTML = "";

    const labelTop = document.createElement('div');
    labelTop.className = 'font-medium mb-1';
    labelTop.textContent = topLabelText;

    const inlineWrapper = document.createElement('div');
    inlineWrapper.className = 'flex items-center gap-3';
    inlineWrapper.appendChild(downloadSelect);

    const orLabel = document.createElement('span');
    orLabel.className = 'text-xs tracking-wide text-grey-60 dark:text-grey-40 font-medium px-2';
    orLabel.textContent = orText;
    inlineWrapper.appendChild(orLabel);

    inlineWrapper.appendChild(timeSelect);

    const labelBottom = document.createElement('div');
    labelBottom.className = 'font-medium mt-1 text-right';
    labelBottom.textContent = bottomLabelText;

    container.appendChild(labelTop);
    container.appendChild(inlineWrapper);
    container.appendChild(labelBottom);

    this._detachOptionListeners();
    this.elements.downloadLimit = downloadSelect;
    this.elements.timeLimit = timeSelect;
    this._attachOptionListeners();
  }

  _buildSelect({ values, selected, formatter, role }) {
    const select = document.createElement('select');
    select.dataset.role = role;
    select.className = 'w-full rounded-default border border-grey-30 bg-white px-3 py-2 text-sm dark:bg-grey-80 dark:border-grey-60';

    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = formatter(value);
      select.appendChild(option);
    });

    if (selected !== null && selected !== undefined) {
      const desired = String(selected);
      if (Array.from(select.options).some((opt) => opt.value === desired)) {
        select.value = desired;
      }
    }

    if (select.selectedIndex === -1 && select.options.length > 0) {
      select.selectedIndex = 0;
    }

    return select;
  }

  _updateOptionValues() {
    if (this.elements.timeLimit && this._timeLimit !== null && this._timeLimit !== undefined) {
      const value = String(this._timeLimit);
      if (Array.from(this.elements.timeLimit.options).some((opt) => opt.value === value)) {
        this.elements.timeLimit.value = value;
      }
    }
    if (this.elements.downloadLimit && this._downloadLimit !== null && this._downloadLimit !== undefined) {
      const value = String(this._downloadLimit);
      if (Array.from(this.elements.downloadLimit.options).some((opt) => opt.value === value)) {
        this.elements.downloadLimit.value = value;
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
    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener("input", this._boundPasswordInput);
    }
  }

  _attachOptionListeners() {
    if (this.elements.timeLimit) {
      this.elements.timeLimit.addEventListener("change", this._boundTimeChange);
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.addEventListener("change", this._boundDownloadChange);
    }
  }

  _detachOptionListeners() {
    if (this.elements.timeLimit) {
      this.elements.timeLimit.removeEventListener("change", this._boundTimeChange);
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.removeEventListener("change", this._boundDownloadChange);
    }
  }

  _detachListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.removeEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.removeEventListener("click", this._boundUploadClick);
    }
    this._detachOptionListeners();
    if (this.elements.passwordInput) {
      this.elements.passwordInput.removeEventListener("input", this._boundPasswordInput);
    }
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
    this.dispatchEvent(
      new CustomEvent("updateoptions", {
        bubbles: true,
        detail: { password: this._password },
      }),
    );
  }
}

customElements.define("upload-list-view", UploadListView);
