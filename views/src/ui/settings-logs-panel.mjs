import { fetchLogs } from "../api.mjs";
import { translateElement } from "../utils.mjs";

class SettingsLogsPanel extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;

    // Element refs
    this._refreshButton = null;
    this._statusContainer = null;
    this._statusIcon = null;
    this._statusText = null;
    this._tableBody = null;
    this._emptyState = null;
    this._countText = null;
    this._nextButton = null;

    // State
    this._currentPage = 1;
    this._totalCount = 0;
    this._currentLogCount = 0;
    this._isLoading = false;

    // Bound handlers
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

    // Schedule initial fetch
    requestAnimationFrame(() => {
      this._fetchLogs(1);
    });
  }

  disconnectedCallback() {
    this._detachListeners();
    // Clear refs
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
    this._refreshButton = this.querySelector('[data-role="logs-refresh"]');
    this._statusContainer = this.querySelector('[data-role="logs-status"]');
    this._statusIcon = this._statusContainer?.querySelector('[data-role="logs-status-icon"]');
    this._statusText = this._statusContainer?.querySelector('[data-role="logs-status-text"]');
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

    // Clear previous icon classes
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

    // Type and icon
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

    // Timestamp (absolute time)
    const timestampEl = row.querySelector('[data-role="log-timestamp"]');
    if (timestampEl && log.timestamp) {
      const date = new Date(log.timestamp);
      timestampEl.textContent = date.toLocaleString();
      timestampEl.title = log.timestamp;
    }

    // Duration (in milliseconds)
    const durationEl = row.querySelector('[data-role="log-duration"]');
    if (durationEl) {
      durationEl.textContent = `${log.duration}ms`;
    }

    // File ID (abbreviated to first 4 chars)
    const fileIdEl = row.querySelector('[data-role="log-file-id"]');
    if (fileIdEl && log.fileId) {
      const abbreviated = log.fileId.substring(0, 4) + "…";
      fileIdEl.textContent = abbreviated;
      fileIdEl.title = log.fileId;
    }

    // Owner/Guest name
    const ownerEl = row.querySelector('[data-role="log-owner"]');
    if (ownerEl && log.ownerName) {
      ownerEl.textContent = log.ownerName;
      ownerEl.title = `${log.ownerType === "owner" ? "Owner" : "Guest"}: ${log.ownerName}`;
    }

    // IP address
    const ipEl = row.querySelector('[data-role="log-ip"]');
    if (ipEl && log.ip) {
      ipEl.textContent = log.ip;
    }

    // User Agent
    const userAgentEl = row.querySelector('[data-role="log-user-agent"]');
    if (userAgentEl && log.userAgent) {
      userAgentEl.textContent = log.userAgent;
      userAgentEl.title = log.userAgent;
    }

    // Origin
    const originEl = row.querySelector('[data-role="log-origin"]');
    if (originEl && log.origin) {
      originEl.textContent = log.origin;
      originEl.title = log.origin;
    }

    // Session user (download only, shows who accessed the file)
    const sessionUserEl = row.querySelector('[data-role="log-session-user"]');
    if (sessionUserEl) {
      if (log.type === "download" && log.sessionUser) {
        sessionUserEl.textContent = log.sessionUser;
      } else if (log.type === "upload") {
        sessionUserEl.textContent = "—";
      } else {
        sessionUserEl.textContent = log.sessionUser || "—";
      }
    }

    return row;
  }

  _updatePaginationUI() {
    // Update log count display: "1-50 of 1,234"
    if (this._countText) {
      const startNum = (this._currentPage - 1) * 50 + 1; // Assuming 50 per page (server-side)
      const endNum = startNum + this._currentLogCount - 1;
      const formatted = this._totalCount.toLocaleString();

      if (this._currentLogCount > 0) {
        this._countText.textContent = `${startNum}-${endNum} of ${formatted}`;
      } else {
        this._countText.textContent = `0 of ${formatted}`;
      }
    }

    // Show next button only if there are more logs available
    if (this._nextButton) {
      const hasMoreLogs = this._totalCount > (this._currentPage - 1) * 50 + this._currentLogCount;
      this._nextButton.disabled = !hasMoreLogs;
    }
  }
}

customElements.define("settings-logs-panel", SettingsLogsPanel);
