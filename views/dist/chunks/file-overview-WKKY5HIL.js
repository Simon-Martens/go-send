import {
  bytes,
  timeLeft,
  translateElement
} from "./chunk-6DFT5NXM.js";
import "./chunk-IFG75HHC.js";

// src/ui/file-overview.mjs
var FileOverviewElement = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._postMountFrame = null;
    this.fileInfo = null;
    this._boundHandlers = {
      download: this.handleDownload.bind(this)
    };
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("file-overview-view");
      if (!template) {
        console.error("Template #file-overview-view not found");
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
      translateElement(this);
      this.setupHandlers();
    });
  }
  disconnectedCallback() {
    if (this._postMountFrame !== null) {
      cancelAnimationFrame(this._postMountFrame);
      this._postMountFrame = null;
    }
    this.teardownHandlers();
  }
  setupHandlers() {
    const downloadBtn = this.querySelector('[data-action="download"]');
    if (downloadBtn) {
      downloadBtn.addEventListener("click", this._boundHandlers.download);
    }
  }
  teardownHandlers() {
    const downloadBtn = this.querySelector('[data-action="download"]');
    if (downloadBtn) {
      downloadBtn.removeEventListener("click", this._boundHandlers.download);
    }
  }
  handleDownload(event) {
    event.preventDefault();
    const event2 = new CustomEvent("download-start", {
      detail: { fileInfo: this.fileInfo },
      bubbles: true
    });
    this.dispatchEvent(event2);
    console.log("[file-overview] Download started");
  }
  /**
   * Public API: Set file info and render
   */
  setFileInfo(fileInfo) {
    this.fileInfo = fileInfo;
    this.render();
  }
  render() {
    if (!this.fileInfo) {
      return;
    }
    const nameEl = this.querySelector('[data-role="file-name"]');
    if (nameEl) {
      nameEl.textContent = this.fileInfo.name || "Unknown file";
    }
    const sizeEl = this.querySelector('[data-role="file-size"]');
    if (sizeEl && this.fileInfo.size) {
      sizeEl.textContent = bytes(this.fileInfo.size);
    }
    const iconEl = this.querySelector('[data-role="file-icon"]');
    if (iconEl && this.fileInfo.name) {
      const fileName = this.fileInfo.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        iconEl.className = "ri-folder-6-line h-12 w-12 flex-shrink-0 text-primary mr-4 text-5xl leading-[3rem]";
      }
    }
    this.renderExpiryInfo();
    if (this.isArchive()) {
      this.renderFileList();
    } else {
      const listContainer = this.querySelector('[data-role="file-list-container"]');
      if (listContainer) {
        listContainer.classList.add("hidden");
      }
    }
  }
  renderExpiryInfo() {
    const expiryEl = this.querySelector('[data-role="expiry-info"]');
    if (!expiryEl) {
      return;
    }
    if (!this.fileInfo.dlimit || !this.fileInfo.expiresAt) {
      expiryEl.classList.add("hidden");
      return;
    }
    const downloadsRemaining = this.fileInfo.dlimit - (this.fileInfo.dtotal || 0);
    const timeLeftData = timeLeft(this.fileInfo.expiresAt - Date.now());
    const translate = window.translate || ((key) => key);
    const downloadCountText = translate("downloadCount", { num: downloadsRemaining });
    const timeText = translate(timeLeftData.id, timeLeftData);
    const expiryText = translate("archiveExpiryInfo", {
      downloadCount: downloadCountText,
      timespan: timeText
    });
    expiryEl.innerHTML = expiryText;
    expiryEl.classList.remove("hidden");
  }
  renderFileList() {
    const listContainer = this.querySelector('[data-role="file-list-container"]');
    if (!listContainer) {
      return;
    }
    const manifest = this.fileInfo.manifest;
    if (!manifest || !manifest.files || manifest.files.length === 0) {
      listContainer.classList.add("hidden");
      return;
    }
    listContainer.classList.remove("hidden");
    const fileListTemplate = document.getElementById("file-overview-file-list");
    if (!fileListTemplate) {
      console.error("Template #file-overview-file-list not found");
      return;
    }
    const fileListEl = fileListTemplate.content.cloneNode(true);
    const fileCountEl = fileListEl.querySelector('[data-role="file-count"]');
    if (fileCountEl) {
      const translate = window.translate || ((key) => key);
      fileCountEl.textContent = translate("fileCount", { num: manifest.files.length });
    }
    const fileListInner = fileListEl.querySelector('[data-role="file-list"]');
    if (fileListInner) {
      manifest.files.forEach((file) => {
        const itemEl = this.createFileListItem(file);
        fileListInner.appendChild(itemEl);
      });
    }
    listContainer.innerHTML = "";
    listContainer.appendChild(fileListEl);
  }
  createFileListItem(file) {
    const itemTemplate = document.getElementById("file-overview-file-item");
    if (!itemTemplate) {
      const div = document.createElement("div");
      div.textContent = `${file.name} (${bytes(file.size)})`;
      div.className = "text-sm text-grey-80 dark:text-grey-30 p-2";
      return div;
    }
    const itemEl = itemTemplate.content.cloneNode(true);
    const nameEl = itemEl.querySelector('[data-role="item-name"]');
    if (nameEl) {
      nameEl.textContent = file.name;
    }
    const sizeEl = itemEl.querySelector('[data-role="item-size"]');
    if (sizeEl) {
      sizeEl.textContent = bytes(file.size);
    }
    const iconEl = itemEl.querySelector('[data-role="file-icon"]');
    if (iconEl && file.name) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        iconEl.className = "ri-folder-6-line h-6 w-6 text-primary flex-shrink-0 text-2xl leading-6";
      }
    }
    return itemEl;
  }
  /**
   * Check if file is an archive (multiple files)
   */
  isArchive() {
    return this.fileInfo.type === "send-archive" && this.fileInfo.manifest && this.fileInfo.manifest.files && this.fileInfo.manifest.files.length > 1;
  }
};
customElements.define("file-overview-view", FileOverviewElement);
//# sourceMappingURL=file-overview-WKKY5HIL.js.map
