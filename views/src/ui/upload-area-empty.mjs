import { translateElement } from "../utils.mjs";

class UploadEmptyView extends HTMLElement {
  constructor() {
    super();
    this._afterFrame = null;
    this._fileInput = null;
    this._dragCounter = 0;
    this._dropZone = null;
    this._boundFileSelect = this.handleFileSelect.bind(this);
    this._boundDragEnter = this.handleDragEnter.bind(this);
    this._boundDragOver = this.handleDragOver.bind(this);
    this._boundDragLeave = this.handleDragLeave.bind(this);
    this._boundDrop = this.handleDrop.bind(this);
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
    this._removeDragListeners();
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
    this._errorEl = this.querySelector('[data-role="error"]');
    this._dropZone = this.querySelector(".border-2.border-dashed");

    if (this._fileInput) {
      this._fileInput.addEventListener("change", this._boundFileSelect);
    }

    this._setupDragListeners();

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

  setError(message) {
    if (!this._errorEl) {
      return;
    }
    if (message) {
      this._errorEl.textContent = message;
      this._errorEl.classList.remove("hidden");
    } else {
      this._errorEl.textContent = "";
      this._errorEl.classList.add("hidden");
    }
  }

  _setupDragListeners() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.addEventListener("dragenter", this._boundDragEnter);
    this._dropZone.addEventListener("dragover", this._boundDragOver);
    this._dropZone.addEventListener("dragleave", this._boundDragLeave);
    this._dropZone.addEventListener("drop", this._boundDrop);
  }

  _removeDragListeners() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.removeEventListener("dragenter", this._boundDragEnter);
    this._dropZone.removeEventListener("dragover", this._boundDragOver);
    this._dropZone.removeEventListener("dragleave", this._boundDragLeave);
    this._dropZone.removeEventListener("drop", this._boundDrop);
    this._dropZone = null;
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    this._dragCounter++;

    // Only show visual feedback when dragging files
    if (event.dataTransfer && event.dataTransfer.types.includes("Files")) {
      this._showDragFeedback();
    }
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this._dragCounter--;

    if (this._dragCounter === 0) {
      this._hideDragFeedback();
    }
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this._dragCounter = 0;
    this._hideDragFeedback();

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) {
      this.dispatchEvent(
        new CustomEvent("addfiles", {
          bubbles: true,
          detail: { files },
        }),
      );
    }
  }

  _showDragFeedback() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.classList.remove("border-grey-transparent", "dark:border-grey-60");
    this._dropZone.classList.add("border-primary", "bg-blue-10", "dark:bg-blue-90", "dark:border-blue-40");
  }

  _hideDragFeedback() {
    if (!this._dropZone) {
      return;
    }
    this._dropZone.classList.remove("border-primary", "bg-blue-10", "dark:bg-blue-90", "dark:border-blue-40");
    this._dropZone.classList.add("border-grey-transparent", "dark:border-grey-60");
  }
}

customElements.define("upload-empty-view", UploadEmptyView);
