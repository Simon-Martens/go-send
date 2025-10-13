import { translateElement } from "../utils.mjs";

class UploadEmptyView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._fileInput = null;
    this._boundFileSelect = this.handleFileSelect.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
      this._afterFrame = null;
    }
    if (this._fileInput) {
      this._fileInput.removeEventListener("change", this._boundFileSelect);
      this._fileInput = null;
    }
  }

  render() {
    const template = document.getElementById("upload-view-empty");
    if (!template) {
      console.error("Template #upload-view-empty not found");
      return;
    }

    const fragment = template.content.cloneNode(true);
    this.innerHTML = "";
    this.appendChild(fragment);

    this._fileInput = this.querySelector("#file-upload");
    if (this._fileInput) {
      this._fileInput.addEventListener("change", this._boundFileSelect);
    }

    if (this._afterFrame !== null) {
      cancelAnimationFrame(this._afterFrame);
    }

    this._afterFrame = requestAnimationFrame(() => {
      this._afterFrame = null;
      translateElement(this);
    });
  }

  setConfig({ orClickText, addFilesLabel, noticeHTML } = {}) {
    if (typeof orClickText === "string") {
      const orClickEl = this.querySelector("#orClickWithSize");
      if (orClickEl) {
        orClickEl.textContent = orClickText;
      }
    }
    if (typeof addFilesLabel === "string") {
      const addLabel = this.querySelector("#addFilesButton");
      if (addLabel) {
        addLabel.textContent = addFilesLabel;
      }
    }
    const noticeEl = this.querySelector("#upload-area-default-notice");
    if (noticeEl) {
      if (noticeHTML) {
        noticeEl.innerHTML = noticeHTML;
        noticeEl.classList.remove("hidden");
      } else {
        noticeEl.textContent = "";
        noticeEl.classList.add("hidden");
      }
    }
  }

  focusFileInput() {
    if (this._fileInput) {
      this._fileInput.focus();
    }
  }

  handleFileSelect(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("addfiles", {
        bubbles: true,
        detail: { files },
      }),
    );

    event.target.value = "";
  }
}

customElements.define("upload-empty-view", UploadEmptyView);
