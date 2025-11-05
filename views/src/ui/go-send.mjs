import { translateElement } from "../utils.mjs";
import { Controller } from "../controller.mjs";

/**
 * <go-send> - Root element
 * - Manages high-level layout switching (upload, download, error, etc.)
 * - Maintains reference to current layout only
 * - Controller handles all business logic, state initialization, and events
 */
class GoSendElement extends HTMLElement {
  constructor() {
    super();
    this.currentView = null;

    // Current layout reference (only one layout active at a time)
    this.currentLayout = null;

    // Controller handles business logic and state initialization
    // Instantiated immediately, initializes state asynchronously
    this.controller = new Controller(this);

    // Track scheduled initialization and template state
    this._initFrame = null;
    this._templateMounted = false;
  }

  /**
   * Convenience getter for state (delegates to controller)
   */
  get state() {
    return this.controller ? this.controller.state : null;
  }

  connectedCallback() {
    // Mount template first (synchronous)
    if (!this._templateMounted) {
      const template = document.getElementById("go-send");
      if (!template) {
        console.error("Template #go-send not found");
        return;
      }

      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }

    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
    }

    // Add event listener for file logs view
    this.addEventListener("show-file-logs", (event) => {
      const { fileName, fileId } = event.detail;
      this.showFileLogsView(fileName, fileId);
    });

    // Schedule async initialization
    this._initFrame = requestAnimationFrame(async () => {
      this._initFrame = null;
      if (!this.isConnected) {
        return;
      }

      // Wait for controller to initialize state
      await this.controller.ready;

      // Check again after await - component might have disconnected
      if (!this.isConnected) {
        return;
      }

      // Now we have state, can render
      translateElement(this);

      // Layout will be set by router in main.mjs
      // Don't show any layout here - let the router decide

      this.controller.hookupHandlers();
    });
  }

  disconnectedCallback() {
    if (this._initFrame !== null) {
      cancelAnimationFrame(this._initFrame);
      this._initFrame = null;
    }
    if (this.controller) {
      this.controller.destroyHandlers();
      this.controller = null;
    }
  }

  showUploadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const uploadLayout = document.createElement("upload-layout");
    slot.appendChild(uploadLayout);

    this.currentLayout = uploadLayout;
    this.currentView = "upload";

    // Initialize upload view (check for existing files on load)
    if (this.controller && typeof this.controller.initializeUploadView === 'function') {
      this.controller.initializeUploadView();
    }
  }

  showDownloadLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const downloadLayout = document.createElement("download-layout");
    slot.appendChild(downloadLayout);

    this.currentLayout = downloadLayout;
    this.currentView = "download";
  }

  showRegisterLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const registerLayout = document.createElement("register-layout");
    slot.appendChild(registerLayout);

    this.currentLayout = registerLayout;
    this.currentView = "register";
  }

  showLoginLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const loginLayout = document.createElement("login-layout");
    slot.appendChild(loginLayout);

    this.currentLayout = loginLayout;
    this.currentView = "login";
  }

  showRequestInvitationLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const requestInvitationLayout = document.createElement("request-invitation-layout");
    slot.appendChild(requestInvitationLayout);

    this.currentLayout = requestInvitationLayout;
    this.currentView = "request-invitation";
  }

  showSettingsLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const settingsLayout = document.createElement("settings-layout");
    slot.appendChild(settingsLayout);

    this.currentLayout = settingsLayout;
    this.currentView = "settings";
  }

  showFileLogsView(fileName, fileId) {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";

    // Create wrapper container for logs view
    const container = document.createElement("div");
    container.className = "h-full w-full flex flex-col";

    // Create header with back button
    const header = document.createElement("div");
    header.className =
      "flex items-center justify-between border-b border-grey-20 dark:border-grey-80 pb-4 mb-4 px-4 pt-4";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className =
      "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded border border-grey-20 dark:border-grey-80 hover:border-grey-40 dark:hover:border-grey-60 transition cursor-pointer";
    backButton.innerHTML =
      '<i class="ri-arrow-left-line text-base leading-4"></i><span data-type="lang" id="logsBack">Back</span>';
    backButton.addEventListener("click", () => {
      this.showUploadLayout();
    });

    const title = document.createElement("h2");
    title.className =
      "text-lg font-semibold text-grey-90 dark:text-grey-10 flex items-center gap-2";
    title.innerHTML = `<i class="ri-file-list-line text-lg leading-4"></i><span data-type="lang" id="logsForFile">Logs for </span><span>${fileName}</span>`;

    header.appendChild(backButton);
    header.appendChild(title);

    // Create LogsTable component
    const LogsTable = customElements.get("logs-table");
    if (!LogsTable) {
      console.error("logs-table component not registered");
      this.showUploadLayout();
      return;
    }

    const logsTable = document.createElement("logs-table");
    logsTable.setAttribute("fileId", fileId);
    logsTable.setAttribute("hideHeader", "");
    logsTable.style.padding = "0 1rem";
    logsTable.style.flex = "1";
    logsTable.style.overflowY = "auto";

    // Build the layout
    container.appendChild(header);
    container.appendChild(logsTable);
    slot.appendChild(container);

    // Translate the dynamically created elements
    translateElement(container);

    this.currentLayout = null;
    this.currentView = "file-logs";
  }

  showHelpLayout() {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    // Clear the app content - help page is server-rendered HTML
    slot.innerHTML = "";

    this.currentLayout = null;
    this.currentView = "help";
  }

  showErrorLayout(errorMessage) {
    const slot = this.querySelector("#app-content");
    if (!slot) {
      console.error("Slot #app-content not found in go-send template");
      return;
    }

    slot.innerHTML = "";
    const errorLayout = document.createElement("error-layout");
    if (errorMessage) {
      errorLayout.setAttribute("message", errorMessage);
    }
    slot.appendChild(errorLayout);

    this.currentLayout = errorLayout;
    this.currentView = "error";
  }
}

// Register the custom element
customElements.define("go-send", GoSendElement);
