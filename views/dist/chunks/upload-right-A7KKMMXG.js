import {
  bytes,
  copyToClipboard,
  timeLeft,
  translateElement
} from "./chunk-6DFT5NXM.js";
import "./chunk-IFG75HHC.js";

// src/ui/upload-right.mjs
var UploadRightElement = class extends HTMLElement {
  constructor() {
    super();
    this.currentTemplate = null;
    this.translate = null;
    this.elements = {
      uploadList: null
    };
    this._afterPaintFrame = null;
  }
  connectedCallback() {
    if (window.initialState && window.initialState.translate) {
      this.translate = window.initialState.translate;
    }
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
      if (files && files.length > 0) {
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
    li.setAttribute("data-upload-id", ownedFile.id);
    const nameEl = item.querySelector('[data-role="file-name"]');
    if (nameEl) {
      nameEl.textContent = ownedFile.name;
    }
    const sizeEl = item.querySelector('[data-role="file-size"]');
    if (sizeEl) {
      sizeEl.textContent = bytes(ownedFile.size);
    }
    const dateEl = item.querySelector('[data-role="upload-date"]');
    if (dateEl) {
      dateEl.textContent = this._formatDate(ownedFile.createdAt);
    }
    const expiryEl = item.querySelector('[data-role="expiry-info"]');
    if (expiryEl) {
      expiryEl.innerHTML = this._createExpiryHTML(ownedFile);
    }
    const iconEl = item.querySelector('[data-role="file-icon"]');
    if (iconEl && ownedFile.name) {
      const fileName = ownedFile.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        iconEl.className = "ri-folder-6-line h-8 w-8 flex-shrink-0 text-primary text-3xl leading-8";
      }
    }
    const detailsEl = item.querySelector('[data-role="file-details"]');
    if (detailsEl && ownedFile.manifest && ownedFile.manifest.files && ownedFile.manifest.files.length > 1) {
      detailsEl.innerHTML = this._createFileDetailsHTML(
        ownedFile.manifest.files
      );
    }
    const downloadLink = item.querySelector('[data-role="download-link"]');
    if (downloadLink) {
      downloadLink.href = ownedFile.url;
    }
    const deleteBtn = item.querySelector('[data-action="delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener(
        "click",
        (e) => this._handleDeleteClick(e, ownedFile)
      );
    }
    const copyBtn = item.querySelector('[data-action="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener(
        "click",
        (e) => this._handleCopyClick(e, ownedFile.url)
      );
    }
    this.elements.uploadList.prepend(li);
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
    if (this.elements.uploadList) {
      this.elements.uploadList.innerHTML = "";
    }
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
      { num: downloadsLeft }
    );
    const timespanText = this._translateText(
      timeL10n.id,
      this._formatTimeLeft(timeLeftMs),
      timeL10n
    );
    return this._translateText(
      "archiveExpiryInfo",
      `Expires after ${downloadCountText} or ${timespanText}`,
      { downloadCount: downloadCountText, timespan: timespanText }
    );
  }
  _createFileDetailsHTML(files) {
    const fileCount = this._translateText(
      "fileCount",
      `${files.length} files`,
      { num: files.length }
    );
    const detailsTemplate = document.getElementById("upload-file-details");
    if (!detailsTemplate) {
      console.error("Template #upload-file-details not found");
      return "";
    }
    const detailsFragment = detailsTemplate.content.cloneNode(true);
    const details = detailsFragment.querySelector("details");
    const fileCountEl = details.querySelector('[data-role="file-count"]');
    if (fileCountEl) {
      fileCountEl.textContent = fileCount;
    }
    const fileListEl = details.querySelector('[data-role="file-list"]');
    if (!fileListEl) {
      console.error("File list container not found");
      return details.outerHTML;
    }
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
      const iconEl = itemFragment.querySelector('[data-role="file-icon"]');
      if (iconEl && f.name) {
        const fileName = f.name.toLowerCase();
        if (fileName.endsWith(".zip")) {
          iconEl.className = "ri-folder-6-line h-6 w-6 text-primary flex-shrink-0 text-2xl leading-6";
        }
      }
      fileListEl.appendChild(itemFragment);
    });
    return details.outerHTML;
  }
  _formatTimeLeft(milliseconds) {
    const seconds = Math.floor(milliseconds / 1e3);
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
  _formatDate(timestamp) {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const uploadDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const locale = document.documentElement.lang || navigator.language || "en";
    if (uploadDate.getTime() === today.getTime()) {
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    if (date.getFullYear() === now.getFullYear()) {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric"
      }).format(date);
    }
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }
  _translateText(key, fallback, args = {}) {
    if (this.translate) {
      try {
        return this.translate(key, args);
      } catch (e) {
      }
    }
    if (window.translate) {
      try {
        return window.translate(key, args);
      } catch (e) {
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
      this.dispatchEvent(
        new CustomEvent("copy", {
          bubbles: true,
          detail: { url }
        })
      );
      const copyBtn = event.currentTarget;
      const iconEl = copyBtn.querySelector('[data-role="copy-icon"]');
      const textSpan = copyBtn.querySelector('[id="copyLinkButton"]');
      if (iconEl) {
        const originalClass = iconEl.className;
        iconEl.className = "ri-check-line h-4 w-4 mr-2 text-base leading-4";
        setTimeout(() => {
          iconEl.className = originalClass;
        }, 1e3);
      }
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.textContent = this._translateText("copiedUrl", "Copied!");
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 1e3);
      }
    }
  }
  _handleDeleteClick(event, ownedFile) {
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("delete", {
        bubbles: true,
        detail: { ownedFile }
      })
    );
  }
};
customElements.define("upload-right", UploadRightElement);
//# sourceMappingURL=upload-right-A7KKMMXG.js.map
