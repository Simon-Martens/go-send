import { translateElement, copyToClipboard } from "../utils.mjs";
import qrcode from "../qrcode.mjs";

class UploadCompleteView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._ownedFile = null;
    this._boundCopy = this.handleCopy.bind(this);
    this._boundOk = this.handleOk.bind(this);
    this._boundLinkClick = this.handleLinkClick.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    this.unbindEventHandlers();
  }

  render() {
    const template = document.getElementById("upload-view-complete");
    if (!template) {
      console.error("Template #upload-view-complete not found");
      return;
    }

    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);

    this.bindEventHandlers();

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }

    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);

      // Re-apply file data after translation
      if (this._ownedFile) {
        this.setUploadedFile(this._ownedFile);
      }
    });
  }

  bindEventHandlers() {
    const copyBtn = this.querySelector('[data-action="copy"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    const linkInput = this.querySelector('[data-role="download-link"]');

    if (copyBtn) {
      copyBtn.addEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.addEventListener("click", this._boundOk);
    }
    if (linkInput) {
      linkInput.addEventListener("click", this._boundLinkClick);
    }
  }

  unbindEventHandlers() {
    const copyBtn = this.querySelector('[data-action="copy"]');
    const okBtn = this.querySelector('[data-action="ok"]');
    const linkInput = this.querySelector('[data-role="download-link"]');

    if (copyBtn) {
      copyBtn.removeEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.removeEventListener("click", this._boundOk);
    }
    if (linkInput) {
      linkInput.removeEventListener("click", this._boundLinkClick);
    }
  }

  setUploadedFile(ownedFile) {
    if (!ownedFile) {
      console.warn("No ownedFile provided to setUploadedFile");
      return;
    }

    this._ownedFile = ownedFile;

    // Set filename
    const filenameEl = this.querySelector('[data-role="filename"]');
    if (filenameEl && ownedFile.name) {
      filenameEl.textContent = ownedFile.name;
    }

    // Set download link
    const linkInput = this.querySelector('[data-role="download-link"]');
    if (linkInput && ownedFile.url) {
      linkInput.value = ownedFile.url;

      // Auto-select the text after a brief delay to ensure rendering is complete
      requestAnimationFrame(() => {
        linkInput.select();
        linkInput.focus();
      });
    }

    // Generate QR code
    this.generateQRCode(ownedFile.url);
  }

  generateQRCode(url) {
    if (!url) {
      return;
    }

    const container = this.querySelector('[data-role="qr-container"]');
    if (!container) {
      return;
    }

    try {
      const qr = qrcode(0, "L"); // Type 0 = auto-detect size, error correction level L
      qr.addData(url);
      qr.make();

      const svg = qr.createSvgTag({
        scalable: true,
        cellSize: 4,
        margin: 4,
      });

      container.innerHTML = svg;

      // Style the SVG
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        svgEl.style.maxWidth = "200px";
        svgEl.style.height = "auto";
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      container.innerHTML =
        '<p class="text-sm text-grey-60">QR code unavailable</p>';
    }
  }

  handleCopy(event) {
    event.preventDefault();

    const linkInput = this.querySelector('[data-role="download-link"]');
    if (!linkInput || !linkInput.value) {
      return;
    }

    const url = linkInput.value;
    const success = copyToClipboard(url);

    if (success) {
      // Dispatch copy event to bubble up
      this.dispatchEvent(
        new CustomEvent("copy", {
          bubbles: true,
          detail: { url },
        }),
      );

      // Visual feedback - change icon to check
      const copyBtn = event.currentTarget;
      const iconEl = copyBtn.querySelector('[data-role="copy-icon"]');

      if (iconEl) {
        const originalClass = iconEl.className;
        iconEl.className = "ri-check-line text-lg leading-4";
        setTimeout(() => {
          iconEl.className = originalClass;
        }, 2000);
      }
    }
  }

  handleOk(event) {
    event.preventDefault();

    // Dispatch event to signal completion
    this.dispatchEvent(
      new CustomEvent("complete-acknowledged", {
        bubbles: true,
        detail: { file: this._ownedFile },
      }),
    );
  }

  handleLinkClick(event) {
    // Select all text when clicking the input field
    event.currentTarget.select();
  }
}

customElements.define("upload-complete-view", UploadCompleteView);
