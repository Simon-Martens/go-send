import { bytes, secondsToL10nId, translateElement } from "../utils.mjs";

class UploadListView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;

    this.elements = {
      fileInput: null,
      fileList: null,
      uploadButton: null,
      totalSize: null,
      fileCount: null,
      timeLimit: null,
      downloadLimit: null,
      passwordInput: null,
      addMoreLabel: null,
    };

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
      this.elements.timeLimit = optionsContainer.querySelector('[data-role="time-limit"]');
      this.elements.downloadLimit = optionsContainer.querySelector('[data-role="download-limit"]');
      this.elements.passwordInput = optionsContainer.querySelector('[data-role="password"]');
    }

    this._attachListeners();

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
    this._populateOptions();
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

  updateProgress(ratio) {
    // Placeholder: list view does not display progress; uploading view handles this
  }

  updateProgressText() {
    // Placeholder for symmetry
  }

  _renderFileList() {
    if (!this.elements.fileList) {
      return;
    }

    const template = document.getElementById("upload-view-list-item");
    if (!template) {
      console.error("Template #upload-view-list-item not found");
      return;
    }

    this.elements.fileList.innerHTML = "";

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

  _populateOptions() {
    const expireOptions = (this._defaults?.EXPIRE_TIMES_SECONDS || []).filter((seconds) => {
      const maxExpire = this._limits?.MAX_EXPIRE_SECONDS;
      return maxExpire ? seconds <= maxExpire : true;
    });
    const downloadCounts = (this._defaults?.DOWNLOAD_COUNTS || []).filter((count) => {
      const maxDownloads = this._limits?.MAX_DOWNLOADS;
      return maxDownloads ? count <= maxDownloads : true;
    });

    if (this.elements.timeLimit) {
      this._setSelectOptions({
        element: this.elements.timeLimit,
        values: expireOptions,
        formatter: (value) => this._formatExpireOption(value),
      });
    }

    if (this.elements.downloadLimit) {
      this._setSelectOptions({
        element: this.elements.downloadLimit,
        values: downloadCounts,
        formatter: (value) => this._translateText("downloadCount", `${value}`, { num: value }),
      });
    }
  }

  _updateOptionValues() {
    if (this.elements.timeLimit && this._timeLimit !== null) {
      this.elements.timeLimit.value = String(this._timeLimit);
    }
    if (this.elements.downloadLimit && this._downloadLimit !== null) {
      this.elements.downloadLimit.value = String(this._downloadLimit);
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
    const max = this._maxFiles ? this._translateText(
      "maxFilesPerArchive",
      `Max ${this._maxFiles} files`,
      { num: this._maxFiles },
    ) : "";
    this.elements.fileCount.textContent = max ? `${label} • ${max}` : label;
  }

  _updateTotalSize(totalSize) {
    if (!this.elements.totalSize) {
      return;
    }
    const sizeLabel = bytes(totalSize || 0);
    const translated = this._translateText("totalSize", `Total size: ${sizeLabel}`, { size: sizeLabel });
    this.elements.totalSize.textContent = translated;
  }

  _updateStaticLabels(totalSize) {
    if (this.elements.addMoreLabel) {
      this.elements.addMoreLabel.textContent = this._translateText("addFilesButton", "Add more files");
    }
    if (this.elements.uploadButton) {
      const uploadLabel = this._translateText("uploadButton", "Upload");
      const uploadLabelSpan = this.elements.uploadButton.querySelector("#uploadButton");
      if (uploadLabelSpan) {
        uploadLabelSpan.textContent = uploadLabel;
      } else {
        this.elements.uploadButton.textContent = uploadLabel;
      }
    }
    this._updateTotalSize(totalSize);
  }

  _attachListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.addEventListener("click", this._boundUploadClick);
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.addEventListener("change", this._boundTimeChange);
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.addEventListener("change", this._boundDownloadChange);
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener("input", this._boundPasswordInput);
    }
  }

  _detachListeners() {
    if (this.elements.fileInput) {
      this.elements.fileInput.removeEventListener("change", this._boundFileSelect);
    }
    if (this.elements.uploadButton) {
      this.elements.uploadButton.removeEventListener("click", this._boundUploadClick);
    }
    if (this.elements.timeLimit) {
      this.elements.timeLimit.removeEventListener("change", this._boundTimeChange);
    }
    if (this.elements.downloadLimit) {
      this.elements.downloadLimit.removeEventListener("change", this._boundDownloadChange);
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.removeEventListener("input", this._boundPasswordInput);
    }
  }

  _setSelectOptions({ element, values, formatter }) {
    if (!element) {
      return;
    }
    const previous = element.value;
    element.innerHTML = "";

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = formatter(value);
      element.appendChild(option);
    });

    if (values.length === 0) {
      return;
    }

    if (previous && Array.from(element.options).some((opt) => opt.value === previous)) {
      element.value = previous;
    } else {
      element.selectedIndex = 0;
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
      // ignore missing translations
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
    this._updateFileCount();
    this._updateTotalSize(this._files.reduce((size, f) => size + (f.size || 0), 0));

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
