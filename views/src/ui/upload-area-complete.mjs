import { translateElement, copyToClipboard } from "../utils.mjs";
import qrcode from "../qrcode.mjs";

class UploadCompleteView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._ownedFile = null;
    this._boundCopy = this.handleCopy.bind(this);
    this._boundOk = this.handleOk.bind(this);
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

    if (copyBtn) {
      copyBtn.addEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.addEventListener("click", this._boundOk);
    }
  }

  unbindEventHandlers() {
    const copyBtn = this.querySelector('[data-action="copy"]');
    const okBtn = this.querySelector('[data-action="ok"]');

    if (copyBtn) {
      copyBtn.removeEventListener("click", this._boundCopy);
    }
    if (okBtn) {
      okBtn.removeEventListener("click", this._boundOk);
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

      // Visual feedback
      const copyBtn = event.currentTarget;
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
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
}

customElements.define("upload-complete-view", UploadCompleteView);
