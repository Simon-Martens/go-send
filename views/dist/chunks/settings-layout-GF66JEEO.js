import {
  USER_ROLES,
  storage_default
} from "./chunk-BXQMQ3VC.js";
import "./chunk-PC246CWX.js";
import {
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/settings-layout.mjs
var SettingsLayout = class extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._activeCategory = null;
    this._currentPanel = null;
    this._isAdmin = false;
    this._categoryButtons = [];
    this._contentArea = null;
    this._uploadLinksNavItem = null;
    this._usersNavItem = null;
    this._boundCategoryClick = this._handleCategoryClick.bind(this);
  }
  connectedCallback() {
    if (!this._templateMounted) {
      const template = document.getElementById("settings-layout");
      if (!template) {
        console.error("Template #settings-layout not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }
    this._isAdmin = this._checkIsAdmin();
    this._cacheElements();
    this._configureAccess();
    translateElement(this);
    this._attachListeners();
    this._selectCategory("account");
  }
  disconnectedCallback() {
    this._detachListeners();
    this._unmountCurrentPanel();
    this._categoryButtons = [];
    this._contentArea = null;
    this._uploadLinksNavItem = null;
    this._usersNavItem = null;
  }
  _checkIsAdmin() {
    const user = storage_default.user;
    if (!user || user.role === void 0 || user.role === null) {
      return false;
    }
    const role = user.role;
    if (typeof role === "number") {
      return role === USER_ROLES.ADMIN;
    }
    if (typeof role === "string") {
      const trimmed = role.trim();
      if (!trimmed) {
        return false;
      }
      const asNumber = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(asNumber)) {
        return asNumber === USER_ROLES.ADMIN;
      }
      return trimmed.toLowerCase() === "admin";
    }
    return false;
  }
  _cacheElements() {
    this._contentArea = this.querySelector('[data-role="content-area"]');
    this._uploadLinksNavItem = this.querySelector('[data-role="upload-links-nav"]');
    this._usersNavItem = this.querySelector('[data-role="users-nav"]');
    const categoryList = this.querySelector('[data-role="category-list"]');
    if (categoryList) {
      this._categoryButtons = Array.from(
        categoryList.querySelectorAll("button[data-category]")
      );
    }
  }
  _configureAccess() {
    if (this._uploadLinksNavItem) {
      this._uploadLinksNavItem.classList.toggle("hidden", !this._isAdmin);
    }
    if (this._usersNavItem) {
      this._usersNavItem.classList.toggle("hidden", !this._isAdmin);
    }
  }
  _attachListeners() {
    this._categoryButtons.forEach((button) => {
      button.addEventListener("click", this._boundCategoryClick);
    });
  }
  _detachListeners() {
    this._categoryButtons.forEach((button) => {
      button.removeEventListener("click", this._boundCategoryClick);
    });
  }
  _handleCategoryClick(event) {
    const button = event.currentTarget;
    const category = button.getAttribute("data-category");
    if (!category) {
      return;
    }
    this._selectCategory(category);
  }
  _selectCategory(category) {
    if (this._activeCategory === category) {
      return;
    }
    if (!this._isAdmin && (category === "users" || category === "upload-links")) {
      console.warn(`[SettingsLayout] Non-admin attempted to access ${category}`);
      return;
    }
    this._activeCategory = category;
    this._updateCategoryStyles();
    this._mountPanel(category);
  }
  _updateCategoryStyles() {
    this._categoryButtons.forEach((button) => {
      const category = button.getAttribute("data-category");
      const isActive = category === this._activeCategory;
      if (isActive) {
        button.classList.add("border-primary", "bg-primary/5", "text-primary", "dark:text-primary");
        button.classList.remove("border-transparent", "text-grey-70", "dark:text-grey-30");
      } else {
        button.classList.remove("border-primary", "bg-primary/5", "text-primary", "dark:text-primary");
        button.classList.add("border-transparent", "text-grey-70", "dark:text-grey-30");
      }
    });
  }
  _mountPanel(category) {
    this._unmountCurrentPanel();
    if (!this._contentArea) {
      console.error("[SettingsLayout] Content area not found");
      return;
    }
    let panelElement;
    switch (category) {
      case "account":
        panelElement = document.createElement("settings-account-panel");
        break;
      case "upload-links":
        if (!this._isAdmin) return;
        panelElement = document.createElement("settings-upload-links-panel");
        break;
      case "users":
        if (!this._isAdmin) return;
        panelElement = document.createElement("settings-users-panel");
        break;
      default:
        console.warn(`[SettingsLayout] Unknown category: ${category}`);
        return;
    }
    this._currentPanel = panelElement;
    this._contentArea.appendChild(panelElement);
  }
  _unmountCurrentPanel() {
    if (this._currentPanel) {
      this._currentPanel.remove();
      this._currentPanel = null;
    }
    if (this._contentArea) {
      this._contentArea.innerHTML = "";
    }
  }
};
customElements.define("settings-layout", SettingsLayout);
//# sourceMappingURL=settings-layout-GF66JEEO.js.map
