import {
  storage_default
} from "./chunk-3WTCPM2E.js";
import {
  fetchLogs
} from "./chunk-WXWAAH3Q.js";
import {
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/settings-logs-panel.mjs
var SettingsLogsPanel = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._refreshButton = null;
    this._statusContainer = null;
    this._statusIcon = null;
    this._statusText = null;
    this._tableBody = null;
    this._emptyState = null;
    this._countText = null;
    this._nextButton = null;
    this._currentPage = 1;
    this._totalCount = 0;
    this._currentLogCount = 0;
    this._isLoading = false;
    this._boundRefresh = this._handleRefresh.bind(this);
    this._boundNext = this._handleNext.bind(this);
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-logs-panel");
      if (!template) {
        console.error("Template #settings-logs-panel not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    this._cacheElements();
    translateElement(this);
    this._attachListeners();
    requestAnimationFrame(() => {
      this._fetchLogs(1);
    });
  }
  disconnectedCallback() {
    this._detachListeners();
    this._refreshButton = null;
    this._statusContainer = null;
    this._statusIcon = null;
    this._statusText = null;
    this._tableBody = null;
    this._emptyState = null;
    this._countText = null;
    this._nextButton = null;
  }
  _cacheElements() {
    var _a, _b;
    this._refreshButton = this.querySelector('[data-role="logs-refresh"]');
    this._statusContainer = this.querySelector('[data-role="logs-status"]');
    this._statusIcon = (_a = this._statusContainer) == null ? void 0 : _a.querySelector('[data-role="logs-status-icon"]');
    this._statusText = (_b = this._statusContainer) == null ? void 0 : _b.querySelector('[data-role="logs-status-text"]');
    this._tableBody = this.querySelector('[data-role="logs-body"]');
    this._emptyState = this.querySelector('[data-role="logs-empty"]');
    this._countText = this.querySelector('[data-role="logs-count"]');
    this._nextButton = this.querySelector('[data-role="logs-next"]');
  }
  _attachListeners() {
    if (this._refreshButton) {
      this._refreshButton.addEventListener("click", this._boundRefresh);
    }
    if (this._nextButton) {
      this._nextButton.addEventListener("click", this._boundNext);
    }
  }
  _detachListeners() {
    if (this._refreshButton) {
      this._refreshButton.removeEventListener("click", this._boundRefresh);
    }
    if (this._nextButton) {
      this._nextButton.removeEventListener("click", this._boundNext);
    }
  }
  async _handleRefresh() {
    this._fetchLogs(1);
  }
  async _handleNext() {
    this._fetchLogs(this._currentPage + 1);
  }
  async _fetchLogs(page) {
    if (this._isLoading) return;
    this._isLoading = true;
    this._setStatus("Loading logs...", "loading");
    try {
      const data = await fetchLogs(page);
      this._currentPage = data.currentPage;
      this._totalCount = data.totalCount;
      this._currentLogCount = data.logs.length;
      if (!data.logs || data.logs.length === 0) {
        this._setStatus("No logs available.", "empty");
        this._showEmptyState();
      } else {
        this._setStatus("");
        this._renderLogs(data.logs);
      }
      this._updatePaginationUI();
    } catch (error) {
      console.error("[SettingsLogsPanel] Error fetching logs:", error);
      this._setStatus("Failed to load logs.", "error");
    } finally {
      this._isLoading = false;
    }
  }
  _setStatus(message, type) {
    if (!this._statusContainer) return;
    if (!message) {
      this._statusContainer.classList.add("hidden");
      return;
    }
    this._statusContainer.classList.remove("hidden");
    if (this._statusIcon) {
      this._statusIcon.classList.remove("ri-loader-4-line", "ri-error-warning-line", "ri-inbox-line");
      this._statusIcon.classList.add("hidden");
    }
    switch (type) {
      case "loading":
        if (this._statusIcon) {
          this._statusIcon.classList.remove("hidden");
          this._statusIcon.classList.add("ri-loader-4-line", "animate-spin");
        }
        break;
      case "error":
        if (this._statusIcon) {
          this._statusIcon.classList.remove("hidden");
          this._statusIcon.classList.add("ri-error-warning-line", "text-red-600", "dark:text-red-400");
        }
        break;
      case "empty":
        if (this._statusIcon) {
          this._statusIcon.classList.remove("hidden");
          this._statusIcon.classList.add("ri-inbox-line", "text-grey-60", "dark:text-grey-50");
        }
        break;
    }
    if (this._statusText) {
      this._statusText.textContent = message;
    }
  }
  _showEmptyState() {
    if (this._emptyState) {
      this._emptyState.classList.remove("hidden");
    }
    if (this._tableBody) {
      this._tableBody.innerHTML = "";
    }
  }
  _renderLogs(logs) {
    if (!this._tableBody) return;
    if (this._emptyState) {
      this._emptyState.classList.add("hidden");
    }
    this._tableBody.innerHTML = "";
    logs.forEach((log) => {
      const row = this._createLogRow(log);
      this._tableBody.appendChild(row);
    });
  }
  _createLogRow(log) {
    const template = document.getElementById("settings-logs-row");
    if (!template) {
      console.error("Template #settings-logs-row not found");
      return document.createElement("tr");
    }
    const row = template.content.cloneNode(true);
    const typeIcon = row.querySelector('[data-role="log-type-icon"]');
    const typeText = row.querySelector('[data-role="log-type"]');
    if (typeIcon && typeText) {
      if (log.type === "upload") {
        typeIcon.className = "ri-upload-cloud-2-line text-lg leading-4";
        typeText.textContent = "Upload";
      } else if (log.type === "download") {
        typeIcon.className = "ri-download-cloud-2-line text-lg leading-4";
        typeText.textContent = "Download";
      }
    }
    const timestampEl = row.querySelector('[data-role="log-timestamp"]');
    if (timestampEl && log.timestamp) {
      const date = new Date(log.timestamp);
      timestampEl.textContent = date.toLocaleString();
      timestampEl.title = log.timestamp;
    }
    const durationEl = row.querySelector('[data-role="log-duration"]');
    if (durationEl) {
      const ms = log.duration;
      let formatted;
      if (ms < 1e3) {
        formatted = `${ms}ms`;
      } else if (ms < 6e4) {
        const seconds = (ms / 1e3).toFixed(2);
        formatted = `${seconds}s`;
      } else {
        const minutes = Math.floor(ms / 6e4);
        const seconds = Math.floor(ms % 6e4 / 1e3);
        formatted = `${minutes}m ${seconds}s`;
      }
      durationEl.textContent = formatted;
    }
    const statusEl = row.querySelector('[data-role="log-status"]');
    if (statusEl && log.statusCode) {
      const code = log.statusCode;
      statusEl.textContent = code;
      if (code >= 200 && code < 300) {
        statusEl.className = "text-xs font-mono font-semibold text-green-600 dark:text-green-400";
      } else if (code >= 300 && code < 400) {
        statusEl.className = "text-xs font-mono font-semibold text-blue-600 dark:text-blue-400";
      } else if (code >= 400 && code < 500) {
        statusEl.className = "text-xs font-mono font-semibold text-orange-600 dark:text-orange-400";
      } else if (code >= 500) {
        statusEl.className = "text-xs font-mono font-semibold text-red-600 dark:text-red-400";
      } else {
        statusEl.className = "text-xs font-mono text-grey-60 dark:text-grey-40";
      }
    }
    const fileIdEl = row.querySelector('[data-role="log-file-id"]');
    if (fileIdEl && log.fileId) {
      const fileMetadata = storage_default.getFileById(log.fileId);
      if (fileMetadata && fileMetadata.name) {
        fileIdEl.textContent = fileMetadata.name;
        fileIdEl.title = `File: ${fileMetadata.name} (ID: ${log.fileId})`;
      } else {
        const abbreviated = log.fileId.substring(0, 8) + "\u2026";
        fileIdEl.textContent = abbreviated;
        fileIdEl.title = log.fileId;
      }
    }
    const ownerEl = row.querySelector('[data-role="log-owner"]');
    if (ownerEl && log.ownerName) {
      ownerEl.textContent = log.ownerName;
      ownerEl.title = `${log.ownerType === "owner" ? "Owner" : "Guest"}: ${log.ownerName}`;
    }
    const ipEl = row.querySelector('[data-role="log-ip"]');
    if (ipEl && log.ip) {
      ipEl.textContent = log.ip;
    }
    const requestDataEl = row.querySelector('[data-role="log-request-data"]');
    if (requestDataEl) {
      const parts = [];
      if (log.userAgent) parts.push(log.userAgent);
      if (log.origin) parts.push(`Origin: ${log.origin}`);
      const combined = parts.join(" \u2022 ") || "\u2014";
      requestDataEl.textContent = combined;
      requestDataEl.title = combined;
    }
    const accessedByEl = row.querySelector('[data-role="log-accessed-by"]');
    if (accessedByEl) {
      if (log.sessionUser && log.sessionUser !== "Anonymous") {
        accessedByEl.textContent = log.sessionUser;
      } else {
        accessedByEl.innerHTML = '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-grey-20 dark:bg-grey-80 text-grey-70 dark:text-grey-40">[Guest]</span>';
      }
    }
    return row;
  }
  _updatePaginationUI() {
    if (this._countText) {
      const startNum = (this._currentPage - 1) * 50 + 1;
      const endNum = startNum + this._currentLogCount - 1;
      const formatted = this._totalCount.toLocaleString();
      if (this._currentLogCount > 0) {
        this._countText.textContent = `${startNum}-${endNum} of ${formatted}`;
      } else {
        this._countText.textContent = `0 of ${formatted}`;
      }
    }
    if (this._nextButton) {
      const hasMoreLogs = this._totalCount > (this._currentPage - 1) * 50 + this._currentLogCount;
      this._nextButton.disabled = !hasMoreLogs;
    }
  }
};
customElements.define("settings-logs-panel", SettingsLogsPanel);
//# sourceMappingURL=settings-logs-panel-4VZQXJ65.js.map
