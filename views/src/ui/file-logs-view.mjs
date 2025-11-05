import { translateElement } from "../utils.mjs";

/**
 * FileLogsView component for displaying logs of a specific file
 * Shows a header with file info and uses LogsTable to display the logs
 */
class FileLogsView extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._fileId = null;
    this._fileName = null;
    this._logsTable = null;
    this._closeButton = null;
    this._boundClose = this._handleClose.bind(this);
  }

  static get observedAttributes() {
    return ["fileId", "fileName"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "fileId") {
      this._fileId = newValue || null;
    } else if (name === "fileName") {
      this._fileName = newValue || null;
    }
    // Update display if already mounted
    if (this._templateMounted) {
      this._updateHeader();
    }
  }

  connectedCallback() {
    // Extract attributes
    if (this.hasAttribute("fileId")) {
      this._fileId = this.getAttribute("fileId");
    }
    if (this.hasAttribute("fileName")) {
      this._fileName = this.getAttribute("fileName");
    }

    if (!this._templateMounted) {
      this._mountTemplate();
      this._templateMounted = true;
    }

    this._cacheElements();
    this._attachListeners();
  }

  disconnectedCallback() {
    this._detachListeners();
    this._logsTable = null;
    this._closeButton = null;
  }

  _mountTemplate() {
    // Create the view structure
    const container = document.createElement("div");
    container.className = "flex flex-col h-full gap-4";

    // Header with back button and file info
    const header = document.createElement("div");
    header.className = "flex items-center justify-between border-b border-grey-20 dark:border-grey-80 pb-4";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className =
      "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded border border-grey-20 dark:border-grey-80 hover:border-grey-40 dark:hover:border-grey-60 transition";
    backButton.innerHTML = '<i class="ri-arrow-left-line text-base leading-4"></i><span>Back</span>';
    backButton.setAttribute("data-role", "close-button");

    const title = document.createElement("h2");
    title.className =
      "text-lg font-semibold text-grey-90 dark:text-grey-10 flex items-center gap-2";
    title.setAttribute("data-role", "file-logs-title");

    header.appendChild(backButton);
    header.appendChild(title);

    // LogsTable component
    const logsTable = document.createElement("logs-table");
    if (this._fileId) {
      logsTable.setAttribute("fileId", this._fileId);
    }

    container.appendChild(header);
    container.appendChild(logsTable);

    this.appendChild(container);
    this._logsTable = logsTable;
    this._closeButton = backButton;

    // Update header with file info
    this._updateHeader();
  }

  _cacheElements() {
    // Already cached in _mountTemplate, but ensure refs are fresh
    if (!this._logsTable) {
      this._logsTable = this.querySelector("logs-table");
    }
    if (!this._closeButton) {
      this._closeButton = this.querySelector('[data-role="close-button"]');
    }
  }

  _attachListeners() {
    if (this._closeButton) {
      this._closeButton.addEventListener("click", this._boundClose);
    }
  }

  _detachListeners() {
    if (this._closeButton) {
      this._closeButton.removeEventListener("click", this._boundClose);
    }
  }

  _updateHeader() {
    const titleEl = this.querySelector('[data-role="file-logs-title"]');
    if (!titleEl) return;

    // Clear existing children except the icon
    while (titleEl.firstChild) {
      titleEl.removeChild(titleEl.firstChild);
    }

    // Add icon
    const icon = document.createElement("i");
    icon.className = "ri-file-list-line text-lg leading-4";
    titleEl.appendChild(icon);

    // Add text content
    if (this._fileName || this._fileId) {
      const fileName = this._fileName || this._fileId.substring(0, 8) + "…";
      const text = document.createTextNode(
        `Logs for ${fileName}`,
      );
      titleEl.appendChild(text);
    } else {
      const text = document.createTextNode("File Logs");
      titleEl.appendChild(text);
    }
  }

  _handleClose() {
    // Emit close event for parent to handle
    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
        detail: { fileId: this._fileId },
      }),
    );
  }

  /**
   * Public API: Set file ID (updates logs filter)
   */
  setFileId(fileId) {
    this._fileId = fileId;
    if (this._logsTable) {
      this._logsTable.setFileId(fileId);
    }
    this._updateHeader();
  }

  /**
   * Public API: Get file ID
   */
  getFileId() {
    return this._fileId;
  }

  /**
   * Public API: Get the logs table element for direct control
   */
  getLogsTable() {
    return this._logsTable;
  }
}

customElements.define("file-logs-view", FileLogsView);

export { FileLogsView };
