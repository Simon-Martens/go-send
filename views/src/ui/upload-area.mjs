import { bytes } from "../utils.mjs";
import "./upload-area-empty.mjs";
import "./upload-area-list.mjs";
import "./upload-area-uploading.mjs";

const VIEW_TAGS = {
  empty: "upload-empty-view",
  list: "upload-list-view",
  uploading: "upload-uploading-view",
};

class UploadAreaElement extends HTMLElement {
  constructor() {
    super();
    this._currentView = null;
    this._currentViewKey = null;
    this._app = null;
    this._errorMessage = null;
  }

  connectedCallback() {
    if (!this._app) {
      this._app = this.closest("go-send");
    }
    this.refresh();
  }

  disconnectedCallback() {
    this._currentView = null;
  }

  refresh() {
    const state = this._getAppState();
    if (!state) {
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
    if (this._currentViewKey === "uploading" && this._currentView && typeof this._currentView.setProgress === "function") {
      const uploadedLabel = bytes(bytesUploaded || 0);
      const totalLabel = bytes(totalBytes || 0);
      const label = `${uploadedLabel} / ${totalLabel}`;
      this._currentView.setProgress({ percent: ratio, label });
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
    const view = this._currentView;
    if (!view || typeof view.setConfig !== "function") {
      return;
    }

    const limits = state.LIMITS || {};
    const sizeLabel = bytes(limits.MAX_FILE_SIZE || 0);
    const orClickText = this._translate("orClickWithSize", `or click to select files (max ${sizeLabel})`, { size: sizeLabel }, state);
    const addFilesLabel = this._translate("addFilesButton", "Select files", null, state);
    const noticeHTML = state.WEB_UI?.UPLOAD_AREA_NOTICE_HTML || "";

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
      files: archive?.files || [],
      totalSize: archive?.size || 0,
      maxFiles: limits.MAX_FILES_PER_ARCHIVE || 0,
      limits,
      defaults,
      translate: state.translate,
      timeLimit: archive?.timeLimit ?? null,
      downloadLimit: archive?.dlimit ?? null,
      password: archive?.password ?? "",
    });
  }

  showError(message) {
    this._errorMessage = message || null;
    this._applyErrorMessage();
  }

  clearError() {
    this.showError(null);
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

    const transfer = state.transfer;
    if (transfer && typeof view.setProgress === "function") {
      const ratio = transfer.progressRatio || 0;
      const [uploadedBytes = 0, totalBytes = 0] = transfer.progress || [];
      const uploadedLabel = bytes(uploadedBytes);
      const totalLabel = bytes(totalBytes);
      view.setProgress({ percent: ratio, label: `${uploadedLabel} / ${totalLabel}` });
    }
  }

  _getAppState() {
    if (!this._app || !this._app.state) {
      this._app = this.closest("go-send");
    }
    return this._app?.state || null;
  }

  _translate(key, fallback, params, state) {
    const translator = state?.translate || window.translate;
    if (typeof translator === "function") {
      try {
        const value = translator(key, params);
        if (value) {
          return value;
        }
      } catch (err) {
        // ignore missing key
      }
    }
    return fallback;
  }
}

customElements.define("upload-area", UploadAreaElement);
