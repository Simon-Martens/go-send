import {
  translateElement,
  bytes,
  timeLeft,
  copyToClipboard,
} from "../utils.mjs";

/**
 * <upload-right> - Right column component
 *
 * Responsibilities:
 * - Display intro text (upload-title template)
 * - OR display list of completed uploads
 * - Emit events: delete, copy (from upload list items)
 *
 * Fine-grained rendering:
 * - showIntro() / showUploadList() replace entire template
 * - addUpload(), removeUpload() update specific list items
 */
class UploadRightElement extends HTMLElement {
  constructor() {
    super();
    this.currentTemplate = null; // 'intro' or 'list'
    this.translate = null;

    // Cached element references
    this.elements = {
      uploadList: null,
    };

    this._afterPaintFrame = null;
  }

  connectedCallback() {
    // Get translate function from global state if available
    if (window.initialState && window.initialState.translate) {
      this.translate = window.initialState.translate;
    }

    // Show intro by default
    this.showIntro();
  }

  disconnectedCallback() {
    if (this._afterPaintFrame !== null) {
      cancelAnimationFrame(this._afterPaintFrame);
      this._afterPaintFrame = null;
    }
  }

  _renderTemplate(templateId, onReady) {
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template #${templateId} not found`);
      return;
    }

    const content = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(content);

    if (this._afterPaintFrame !== null) {
      cancelAnimationFrame(this._afterPaintFrame);
    }

    this._afterPaintFrame = requestAnimationFrame(() => {
      this._afterPaintFrame = null;
      if (!this.isConnected) {
        return;
      }

      translateElement(this);

      if (typeof onReady === "function") {
        onReady();
      }
    });
  }

  /**
   * Template Switching Methods
   */

  /**
   * Show intro/welcome text
   * Uses template: #upload-title
   */
  showIntro() {
    this._renderTemplate("upload-title", () => {
      this.currentTemplate = "intro";
    });
  }

  /**
   * Show list of completed uploads
   * Uses template: #upload-list
   * @param {Array} files - Array of OwnedFile objects from storage
   */
  showUploadList(files = []) {
    this._renderTemplate("upload-list", () => {
      this.elements.uploadList = this.querySelector("#upload-list-container");
      this.currentTemplate = "list";

      // Populate with files
      if (files && files.length > 0) {
        // Filter expired and reverse (newest first)
        const activeFiles = files.filter((f) => !f.expired).reverse();
        activeFiles.forEach((file) => this.addUpload(file));
      }
    });
  }

  /**
   * Fine-Grained Update Methods
   */

  /**
   * Add a completed upload to the list (when in 'list' template)
   */
  addUpload(ownedFile) {
    if (this.currentTemplate !== "list" || !this.elements.uploadList) {
      console.warn("addUpload called but not in list template");
      return;
    }

    const itemTemplate = document.getElementById("upload-tile-item");
    if (!itemTemplate) {
      console.error("Template #upload-tile-item not found");
      return;
    }

    const item = itemTemplate.content.cloneNode(true);
    const li = item.querySelector("li");

    // Set upload ID
    li.setAttribute("data-upload-id", ownedFile.id);

    // Set file name
    const nameEl = item.querySelector('[data-role="file-name"]');
    if (nameEl) {
      nameEl.textContent = ownedFile.name;
    }

    // Set file size
    const sizeEl = item.querySelector('[data-role="file-size"]');
    if (sizeEl) {
      sizeEl.textContent = bytes(ownedFile.size);
    }

    // Set expiry info
    const expiryEl = item.querySelector('[data-role="expiry-info"]');
    if (expiryEl) {
      expiryEl.innerHTML = this._createExpiryHTML(ownedFile);
    }

    // Set file details (for multi-file uploads)
    const detailsEl = item.querySelector('[data-role="file-details"]');
    if (
      detailsEl &&
      ownedFile.manifest &&
      ownedFile.manifest.files &&
      ownedFile.manifest.files.length > 1
    ) {
      detailsEl.innerHTML = this._createFileDetailsHTML(
        ownedFile.manifest.files,
      );
    }

    // Set download link
    const downloadLink = item.querySelector('[data-role="download-link"]');
    if (downloadLink) {
      downloadLink.href = ownedFile.url;
    }

    // Attach event listeners
    const deleteBtn = item.querySelector('[data-action="delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) =>
        this._handleDeleteClick(e, ownedFile),
      );
    }

    const copyBtn = item.querySelector('[data-action="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) =>
        this._handleCopyClick(e, ownedFile.url),
      );
    }

    // Prepend to list (newest first)
    this.elements.uploadList.prepend(li);

    // Translate any translatable elements
    requestAnimationFrame(() => {
      translateElement(li);
    });
  }

  /**
   * Remove an upload from the list (when in 'list' template)
   */
  removeUpload(fileId) {
    if (this.currentTemplate !== "list" || !this.elements.uploadList) {
      console.warn("removeUpload called but not in list template");
      return;
    }

    const uploadElement = this.querySelector(`[data-upload-id="${fileId}"]`);
    if (uploadElement) {
      uploadElement.remove();
    }

    // If list is now empty, switch back to intro
    if (this.elements.uploadList.children.length === 0) {
      this.showIntro();
    }
  }

  /**
   * Refresh entire list with new files
   */
  refreshList(files) {
    if (this.currentTemplate !== "list") {
      return;
    }

    // Clear list
    if (this.elements.uploadList) {
      this.elements.uploadList.innerHTML = "";
    }

    // Filter expired and reverse
    const activeFiles = files.filter((f) => !f.expired).reverse();

    if (activeFiles.length === 0) {
      this.showIntro();
      return;
    }

    activeFiles.forEach((file) => this.addUpload(file));
  }

  /**
   * Helper Methods
   */

  _createExpiryHTML(ownedFile) {
    const downloadsLeft = ownedFile.dlimit - ownedFile.dtotal;
    const timeLeftMs = ownedFile.expiresAt - Date.now();

    if (timeLeftMs < 0 || downloadsLeft <= 0) {
      return this._translateText("linkExpiredAlt", "Link expired");
    }

    const timeL10n = timeLeft(timeLeftMs);
    const downloadCountText = this._translateText(
      "downloadCount",
      `${downloadsLeft} downloads`,
      { num: downloadsLeft },
    );
    const timespanText = this._translateText(
      timeL10n.id,
      this._formatTimeLeft(timeLeftMs),
      timeL10n,
    );

    return this._translateText(
      "archiveExpiryInfo",
      `Expires after ${downloadCountText} or ${timespanText}`,
      { downloadCount: downloadCountText, timespan: timespanText },
    );
  }

  _createFileDetailsHTML(files) {
    const fileCount = this._translateText(
      "fileCount",
      `${files.length} files`,
      { num: files.length },
    );

    // Clone the details template
    const detailsTemplate = document.getElementById("upload-file-details");
    if (!detailsTemplate) {
      console.error("Template #upload-file-details not found");
      return "";
    }

    const detailsFragment = detailsTemplate.content.cloneNode(true);
    const details = detailsFragment.querySelector("details");

    // Set file count
    const fileCountEl = details.querySelector('[data-role="file-count"]');
    if (fileCountEl) {
      fileCountEl.textContent = fileCount;
    }

    // Get the file list container
    const fileListEl = details.querySelector('[data-role="file-list"]');
    if (!fileListEl) {
      console.error("File list container not found");
      return details.outerHTML;
    }

    // Clone file item template for each file
    const itemTemplate = document.getElementById("upload-file-details-item");
    if (!itemTemplate) {
      console.error("Template #upload-file-details-item not found");
      return details.outerHTML;
    }

    files.forEach((f) => {
      const itemFragment = itemTemplate.content.cloneNode(true);

      const nameEl = itemFragment.querySelector('[data-role="item-name"]');
      if (nameEl) {
        nameEl.textContent = f.name;
      }

      const sizeEl = itemFragment.querySelector('[data-role="item-size"]');
      if (sizeEl) {
        sizeEl.textContent = bytes(f.size);
      }

      fileListEl.appendChild(itemFragment);
    });

    return details.outerHTML;
  }

  _formatTimeLeft(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else if (hours >= 1) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (minutes >= 1) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    return "< 1 minute";
  }

  _translateText(key, fallback, args = {}) {
    if (this.translate) {
      try {
        return this.translate(key, args);
      } catch (e) {
        // Fall through to fallback
      }
    }
    return fallback;
  }

  /**
   * Event Handlers
   */

  _handleCopyClick(event, url) {
    event.preventDefault();
    event.stopPropagation();

    const success = copyToClipboard(url);

    if (success) {
      // Dispatch copy event to bubble up
      this.dispatchEvent(
        new CustomEvent("copy", {
          bubbles: true,
          detail: { url },
        }),
      );

      // Visual feedback
      const copyBtn = event.currentTarget;
      const textSpan = copyBtn.querySelector('[id="copyLinkButton"]');
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.textContent = this._translateText("copiedUrl", "Copied!");
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 1000);
      }
    }
  }

  _handleDeleteClick(event, ownedFile) {
    event.preventDefault();
    event.stopPropagation();

    // Dispatch delete event to bubble up to controller
    this.dispatchEvent(
      new CustomEvent("delete", {
        bubbles: true,
        detail: { ownedFile },
      }),
    );
  }
}

// Register the custom element
customElements.define("upload-right", UploadRightElement);
