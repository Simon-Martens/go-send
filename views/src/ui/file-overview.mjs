import { translateElement } from "../utils.mjs";
import { bytes, timeLeft } from "../utils.mjs";

/**
 * <file-overview-view> - Shows file details before download starts
 *
 * Responsibilities:
 * - Display file icon, name, and size
 * - Show archive contents if file is a multi-file archive
 * - Display expiry information (downloads remaining, time left)
 * - Provide download button to start download
 * - Dispatch "download-start" event when user clicks download
 */
class FileOverviewElement extends HTMLElement {
  constructor() {
    super();

    this._templateMounted = false;
    this._postMountFrame = null;
    this.fileInfo = null;

    // Bound handlers
    this._boundHandlers = {
      download: this.handleDownload.bind(this),
    };
  }

  connectedCallback() {
    // Mount template first (synchronous)
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

    // Schedule async initialization
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

    // Dispatch download-start event
    const event2 = new CustomEvent("download-start", {
      detail: { fileInfo: this.fileInfo },
      bubbles: true,
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

    // Set file name
    const nameEl = this.querySelector('[data-role="file-name"]');
    if (nameEl) {
      nameEl.textContent = this.fileInfo.name || "Unknown file";
    }

    // Set file size
    const sizeEl = this.querySelector('[data-role="file-size"]');
    if (sizeEl && this.fileInfo.size) {
      sizeEl.textContent = bytes(this.fileInfo.size);
    }

    // Set icon based on file type
    const iconEl = this.querySelector('[data-role="file-icon"]');
    if (iconEl && this.fileInfo.name) {
      const fileName = this.fileInfo.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        iconEl.className = "ri-folder-6-line h-12 w-12 flex-shrink-0 text-primary mr-4 text-5xl leading-[3rem]";
      }
    }

    // Render expiry info if available
    this.renderExpiryInfo();

    // Render file list if archive
    if (this.isArchive()) {
      this.renderFileList();
    } else {
      // Hide file list container
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

    // Check if we have expiry data from fileInfo
    // (After metadata fetch, fileInfo should have dlimit, dtotal, expiresAt)
    if (!this.fileInfo.dlimit || !this.fileInfo.expiresAt) {
      expiryEl.classList.add("hidden");
      return;
    }

    const downloadsRemaining = this.fileInfo.dlimit - (this.fileInfo.dtotal || 0);
    const timeLeftData = timeLeft(this.fileInfo.expiresAt - Date.now());

    // Get translator
    const translate = window.translate || ((key) => key);

    // Build expiry text
    const downloadCountText = translate("downloadCount", { num: downloadsRemaining });
    const timeText = translate(timeLeftData.id, timeLeftData);
    const expiryText = translate("archiveExpiryInfo", {
      downloadCount: downloadCountText,
      timespan: timeText,
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

    // Show container
    listContainer.classList.remove("hidden");

    // Load file list template
    const fileListTemplate = document.getElementById("file-overview-file-list");
    if (!fileListTemplate) {
      console.error("Template #file-overview-file-list not found");
      return;
    }

    // Clone template
    const fileListEl = fileListTemplate.content.cloneNode(true);

    // Set file count in summary
    const fileCountEl = fileListEl.querySelector('[data-role="file-count"]');
    if (fileCountEl) {
      const translate = window.translate || ((key) => key);
      fileCountEl.textContent = translate("fileCount", { num: manifest.files.length });
    }

    // Populate file list
    const fileListInner = fileListEl.querySelector('[data-role="file-list"]');
    if (fileListInner) {
      manifest.files.forEach((file) => {
        const itemEl = this.createFileListItem(file);
        fileListInner.appendChild(itemEl);
      });
    }

    // Append to container
    listContainer.innerHTML = "";
    listContainer.appendChild(fileListEl);
  }

  createFileListItem(file) {
    const itemTemplate = document.getElementById("file-overview-file-item");
    if (!itemTemplate) {
      // Fallback: create simple div
      const div = document.createElement("div");
      div.textContent = `${file.name} (${bytes(file.size)})`;
      div.className = "text-sm text-grey-80 dark:text-grey-30 p-2";
      return div;
    }

    const itemEl = itemTemplate.content.cloneNode(true);

    // Set file name
    const nameEl = itemEl.querySelector('[data-role="item-name"]');
    if (nameEl) {
      nameEl.textContent = file.name;
    }

    // Set file size
    const sizeEl = itemEl.querySelector('[data-role="item-size"]');
    if (sizeEl) {
      sizeEl.textContent = bytes(file.size);
    }

    // Set icon based on file type
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
    return (
      this.fileInfo.type === "send-archive" &&
      this.fileInfo.manifest &&
      this.fileInfo.manifest.files &&
      this.fileInfo.manifest.files.length > 1
    );
  }
}

// Register the custom element
customElements.define("file-overview-view", FileOverviewElement);
