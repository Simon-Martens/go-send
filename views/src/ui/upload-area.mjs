import { bytes, timeLeft } from "../utils.mjs";
import "./upload-area-empty.mjs";
import "./upload-area-list.mjs";
import "./upload-area-uploading.mjs";
import "./upload-area-complete.mjs";
import "./upload-area-error.mjs";

const VIEW_TAGS = {
  empty: "upload-empty-view",
  list: "upload-list-view",
  uploading: "upload-uploading-view",
  complete: "upload-complete-view",
  error: "upload-error-view",
};

class UploadAreaElement extends HTMLElement {
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

    // If we're in error state, stay there until explicitly cleared
    if (this._isError) {
      this._ensureView("error");
      this._configureErrorView();
      return;
    }

    // If we're in complete state, stay there until explicitly cleared
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

    // Set file name and size
    if (archive && typeof view.setFileInfo === "function") {
      view.setFileInfo(archive.name || "File", archive.size || 0);
    }

    // Set expiry info
    if (archive && typeof view.setExpiryInfo === "function") {
      const expiresAt = Date.now() + 500 + (archive.timeLimit || 0) * 1000;
      const downloadsLeft = archive.dlimit || 1;
      const timeLeftMs = expiresAt - Date.now();
      const timeLeftData = timeLeft(timeLeftMs);

      // Get translator
      const translate = window.translate || ((key) => key);

      // Build expiry text
      const downloadCountText = translate("downloadCount", { num: downloadsLeft });
      const timeText = translate(timeLeftData.id, timeLeftData);
      const expiryText = translate("archiveExpiryInfo", {
        downloadCount: downloadCountText,
        timespan: timeText,
      });

      view.setExpiryInfo(expiryText);
    }

    // Update progress if transfer is active
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

  async handlePaste(event) {
    const state = this._getAppState();
    if (!state) {
      return;
    }

    // Don't handle paste if uploading or if we're in complete state
    if (state.uploading || this._isComplete) {
      return;
    }

    // Don't handle paste if target is an input field
    const targetType = event.target?.type;
    if (["password", "text", "email", "textarea"].includes(targetType)) {
      return;
    }

    // Don't handle paste if target is a textarea element
    if (event.target?.tagName === "TEXTAREA") {
      return;
    }

    const items = Array.from(event.clipboardData?.items || []);
    const transferFiles = items.filter(item => item.kind === "file");
    const strings = items.filter(item => item.kind === "string");

    if (transferFiles.length > 0) {
      // Handle pasted files
      const promises = transferFiles.map(async (item, i) => {
        const blob = item.getAsFile();
        if (!blob) {
          return null;
        }

        // Try to get filename from associated string
        const name = await this._getStringFromItem(strings[i]);
        const file = new File([blob], name || blob.name || "file", { type: blob.type });
        return file;
      });

      const files = (await Promise.all(promises)).filter(f => !!f);
      if (files.length > 0) {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent("addfiles", {
            bubbles: true,
            detail: { files },
          }),
        );
      }
    } else if (strings.length > 0) {
      // Handle pasted text - create a text file
      const textContent = await this._getStringFromItem(strings[0]);
      if (textContent) {
        event.preventDefault();
        const file = new File([textContent], "pasted.txt", { type: "text/plain" });
        this.dispatchEvent(
          new CustomEvent("addfiles", {
            bubbles: true,
            detail: { files: [file] },
          }),
        );
      }
    }
  }

  _getStringFromItem(item) {
    if (!item) {
      return Promise.resolve("");
    }
    return new Promise(resolve => {
      item.getAsString(resolve);
    });
  }
}

customElements.define("upload-area", UploadAreaElement);
