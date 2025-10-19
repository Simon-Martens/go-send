class SettingsLayout extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._categoryButtons = [];
    this._panels = new Map();
    this._activeCategory = "password";
    this._boundCategoryClick = this._handleCategoryClick.bind(this);
    this._boundClose = this._handleClose.bind(this);
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

    this._cacheElements();
    this._attachListeners();
    this._selectCategory(this._activeCategory);
  }

  disconnectedCallback() {
    this._detachListeners();
    this._categoryButtons = [];
    this._panels.clear();
  }

  _cacheElements() {
    const categoryList = this.querySelector('[data-role="category-list"]');
    if (categoryList) {
      this._categoryButtons = Array.from(
        categoryList.querySelectorAll("[data-category]"),
      );
    }

    const panels = this.querySelectorAll("[data-panel]");
    this._panels = new Map();
    panels.forEach((panel) => {
      this._panels.set(panel.getAttribute("data-panel"), panel);
    });

    this._closeButton = this.querySelector('[data-action="close"]');
  }

  _attachListeners() {
    this._categoryButtons.forEach((button) => {
      button.addEventListener("click", this._boundCategoryClick);
    });
    if (this._closeButton) {
      this._closeButton.addEventListener("click", this._boundClose);
    }
  }

  _detachListeners() {
    this._categoryButtons.forEach((button) => {
      button.removeEventListener("click", this._boundCategoryClick);
    });
    if (this._closeButton) {
      this._closeButton.removeEventListener("click", this._boundClose);
    }
  }

  _handleCategoryClick(event) {
    const category = event.currentTarget.getAttribute("data-category");
    if (category) {
      this._selectCategory(category);
    }
  }

  _selectCategory(category) {
    this._activeCategory = category;
    this._updateCategoryStyles();
    this._updatePanels();
  }

  _updateCategoryStyles() {
    this._categoryButtons.forEach((button) => {
      const isActive =
        button.getAttribute("data-category") === this._activeCategory;

      button.classList.toggle("border-primary", isActive);
      button.classList.toggle("bg-primary/10", isActive);
      button.classList.toggle("text-primary", isActive);
      button.classList.toggle("text-grey-70", !isActive);
      button.classList.toggle("dark:text-grey-30", !isActive);
      button.classList.toggle("border-transparent", !isActive);
    });
  }

  _updatePanels() {
    this._panels.forEach((panel, key) => {
      if (key === this._activeCategory) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });
  }

  _handleClose() {
    const app = document.querySelector("go-send");
    if (app && typeof app.showUploadLayout === "function") {
      app.showUploadLayout();
    }
  }
}

customElements.define("settings-layout", SettingsLayout);
