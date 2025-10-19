import { translateElement } from "../utils.mjs";
import storage from "../storage.mjs";

/**
 * <app-footer> - Site footer component
 *
 * Responsibilities:
 * - Displays site branding with status indicator
 * - Shows configured footer links (CLI, DMCA, Source, Custom)
 * - Displays dynamic login/logout link based on authentication state
 * - Handles internationalization for all footer text
 *
 * Configuration comes from window.FOOTER (set by server)
 */
class AppFooter extends HTMLElement {
  constructor() {
    super();
    this._templateMounted = false;
    this._frame = null;
    this.config = window.FOOTER || {};
    this._boundHandlers = {
      handleLogoutClick: this.handleLogoutClick.bind(this),
    };
  }

  connectedCallback() {
    // Mount template
    if (!this._templateMounted) {
      const template = document.getElementById("app-footer");
      if (!template) {
        console.error("Template #app-footer not found");
        return;
      }
      const content = template.content.cloneNode(true);
      this.appendChild(content);
      this._templateMounted = true;
    }

    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
    }

    this._frame = requestAnimationFrame(() => {
      this._frame = null;
      if (!this.isConnected) return;

      translateElement(this);
      this.setupFooter();
    });
  }

  disconnectedCallback() {
    if (this._frame !== null) {
      cancelAnimationFrame(this._frame);
      this._frame = null;
    }

    // Remove logout click handler
    const authLink = this.querySelector('[data-role="auth-link"]');
    if (authLink && authLink.href.includes('/logout')) {
      authLink.removeEventListener('click', this._boundHandlers.handleLogoutClick);
    }
  }

  setupFooter() {
    // Set up branding and source link (left side)
    const sourceLink = this.querySelector('[data-role="source-link"]');
    const brand = this.querySelector('[data-role="brand"]');

    if (this.config.SourceURL) {
      if (sourceLink) {
        sourceLink.href = this.config.SourceURL;
        sourceLink.style.display = "";
      }
      if (brand) brand.style.display = "none";
    } else {
      if (sourceLink) sourceLink.style.display = "none";
      if (brand) brand.style.display = "";
    }

    // Set up status dot (green for upload pages, blue for download pages)
    const statusDot = this.querySelector('[data-role="status-dot"]');
    if (statusDot) {
      const isDownload =
        window.location.pathname.match(/^\/download/) ||
        window.location.pathname.match(/^\/[0-9a-fA-F]{10,16}/);
      statusDot.className = isDownload
        ? "status-dot status-dot-blue"
        : "status-dot status-dot-green";
    }

    // Set up custom text/link
    const customLi = this.querySelector('[data-if-custom]');
    const customLink = this.querySelector('[data-role="custom-link"]');
    const customText = this.querySelector('[data-role="custom-text"]');

    if (this.config.CustomText) {
      if (customText) customText.textContent = this.config.CustomText;
      if (this.config.CustomURL && customLink) {
        customLink.href = this.config.CustomURL;
        customLink.target = "_blank";
      } else if (customLink) {
        // If no URL, make it plain text
        const span = document.createElement("span");
        span.textContent = this.config.CustomText;
        customLink.replaceWith(span);
      }
      if (customLi) customLi.style.display = "";
    } else {
      if (customLi) customLi.style.display = "none";
    }

    // Set up CLI link
    const cliLi = this.querySelector('[data-if-cli]');
    const cliLink = this.querySelector('[data-role="cli-link"]');
    if (this.config.CLIURL) {
      if (cliLink) {
        cliLink.href = this.config.CLIURL;
        cliLink.target = "_blank";
      }
      if (cliLi) cliLi.style.display = "";
    } else {
      if (cliLi) cliLi.style.display = "none";
    }

    // Set up DMCA link
    const dmcaLi = this.querySelector('[data-if-dmca]');
    const dmcaLink = this.querySelector('[data-role="dmca-link"]');
    if (this.config.DMCAURL) {
      if (dmcaLink) {
        dmcaLink.href = this.config.DMCAURL;
        dmcaLink.target = "_blank";
      }
      if (dmcaLi) dmcaLi.style.display = "";
    } else {
      if (dmcaLi) dmcaLi.style.display = "none";
    }

    // Set up Source link (in footer list on right side)
    const sourceLi = this.querySelector('[data-if-source]');
    const sourceFooterLink = this.querySelector('[data-role="source-link-footer"]');
    if (this.config.SourceURL) {
      if (sourceFooterLink) {
        sourceFooterLink.href = this.config.SourceURL;
        sourceFooterLink.target = "_blank";
      }
      if (sourceLi) sourceLi.style.display = "";
    } else {
      if (sourceLi) sourceLi.style.display = "none";
    }

    // Set up username display and auth link based on authentication state
    const usernameSpan = this.querySelector('[data-role="username"]');
    const authLink = this.querySelector('[data-role="auth-link"]');
    const authLabel = this.querySelector('[data-role="auth-label"]');
    const user = storage.user;

    if (usernameSpan) {
      if (user && user.name) {
        usernameSpan.textContent = user.name;
        usernameSpan.style.display = "";
      } else {
        usernameSpan.style.display = "none";
      }
    }

    if (authLink && authLabel) {
      // Remove any existing listener first
      authLink.removeEventListener('click', this._boundHandlers.handleLogoutClick);

      // Ensure target is NOT set to _blank (should open in same tab)
      authLink.removeAttribute('target');

      if (user) {
        // User is logged in - show logout
        authLink.href = "/logout";
        authLabel.id = "footerLinkLogout";
        authLabel.setAttribute("data-type", "lang");
        authLabel.textContent = "Sign out"; // Will be translated

        // Add click handler to clear localStorage before navigation
        authLink.addEventListener('click', this._boundHandlers.handleLogoutClick);
      } else {
        // User is not logged in - show login
        authLink.href = "/login";
        authLabel.id = "footerLinkLogin";
        authLabel.setAttribute("data-type", "lang");
        authLabel.textContent = "Sign in"; // Will be translated
      }

      // Re-translate after changing the text
      translateElement(this);
    }
  }

  handleLogoutClick(event) {
    // Clear all localStorage before navigating to logout endpoint
    storage.clearAll();
    // Let the browser continue with navigation to /logout
  }
}

// Register the custom element
customElements.define("app-footer", AppFooter);
