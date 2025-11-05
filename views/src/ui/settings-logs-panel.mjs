import { fetchLogs } from "../api.mjs";
import { translateElement } from "../utils.mjs";
import storage from "../storage.mjs";

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
    this._statusIcon = this._statusContainer?.querySelector(
      '[data-role="logs-status-icon"]',
    );
    this._statusText = this._statusContainer?.querySelector(
      '[data-role="logs-status-text"]',
    );
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
      this._statusIcon.classList.remove(
        "ri-loader-4-line",
        "ri-error-warning-line",
        "ri-inbox-line",
      );
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
          this._statusIcon.classList.add(
            "ri-error-warning-line",
            "text-red-600",
            "dark:text-red-400",
          );
        }
        break;
      case "empty":
        if (this._statusIcon) {
          this._statusIcon.classList.remove("hidden");
          this._statusIcon.classList.add(
            "ri-inbox-line",
            "text-grey-60",
            "dark:text-grey-50",
          );
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

    // Duration (format based on length)
    const durationEl = row.querySelector('[data-role="log-duration"]');
    if (durationEl) {
      const ms = log.duration;
      let formatted;

      if (ms < 1000) {
        // Less than 1 second: show milliseconds
        formatted = `${ms}ms`;
      } else if (ms < 60000) {
        // Less than 1 minute: show seconds
        const seconds = (ms / 1000).toFixed(2);
        formatted = `${seconds}s`;
      } else {
        // 1 minute or more: show minutes + seconds
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        formatted = `${minutes}m ${seconds}s`;
      }

      durationEl.textContent = formatted;
    }

    // Status Code (color-coded by range)
    const statusEl = row.querySelector('[data-role="log-status"]');
    if (statusEl && log.statusCode) {
      const code = log.statusCode;
      statusEl.textContent = code;

      // Color code based on status range
      if (code >= 200 && code < 300) {
        // 2xx: Success - green
        statusEl.className =
          "text-xs font-mono font-semibold text-green-600 dark:text-green-400";
      } else if (code >= 300 && code < 400) {
        // 3xx: Redirect - blue
        statusEl.className =
          "text-xs font-mono font-semibold text-blue-600 dark:text-blue-400";
      } else if (code >= 400 && code < 500) {
        // 4xx: Client error - orange
        statusEl.className =
          "text-xs font-mono font-semibold text-orange-600 dark:text-orange-400";
      } else if (code >= 500) {
        // 5xx: Server error - red
        statusEl.className =
          "text-xs font-mono font-semibold text-red-600 dark:text-red-400";
      } else {
        // Unknown range - grey
        statusEl.className = "text-xs font-mono text-grey-60 dark:text-grey-40";
      }
    }

    // File ID or Name (check storage for metadata)
    const fileIdEl = row.querySelector('[data-role="log-file-id"]');
    if (fileIdEl && log.fileId) {
      // Try to get file metadata from storage
      const fileMetadata = storage.getFileById(log.fileId);

      if (fileMetadata && fileMetadata.name) {
        // Show file name if metadata available
        fileIdEl.textContent = fileMetadata.name;
        fileIdEl.title = `File: ${fileMetadata.name} (ID: ${log.fileId})`;
      } else {
        // Fall back to abbreviated file ID
        const abbreviated = log.fileId.substring(0, 8) + "…";
        fileIdEl.textContent = abbreviated;
        fileIdEl.title = log.fileId;
      }
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

    // Request Data (User Agent + Origin combined, truncated)
    const requestDataEl = row.querySelector('[data-role="log-request-data"]');
    if (requestDataEl) {
      const parts = [];
      if (log.userAgent) parts.push(log.userAgent);
      if (log.origin) parts.push(`Origin: ${log.origin}`);

      const combined = parts.join(" • ") || "—";
      requestDataEl.textContent = combined;
      requestDataEl.title = combined;
    }

    // Accessed By (session owner, show N/A pill for anonymous)
    const accessedByEl = row.querySelector('[data-role="log-accessed-by"]');
    if (accessedByEl) {
      if (log.sessionUser && log.sessionUser !== "Anonymous") {
        accessedByEl.textContent = log.sessionUser;
      } else {
        accessedByEl.innerHTML =
          '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-grey-20 dark:bg-grey-80 text-grey-70 dark:text-grey-40">N/A</span>';
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
      const hasMoreLogs =
        this._totalCount > (this._currentPage - 1) * 50 + this._currentLogCount;
      this._nextButton.disabled = !hasMoreLogs;
    }
  }
}

customElements.define("settings-logs-panel", SettingsLogsPanel);
