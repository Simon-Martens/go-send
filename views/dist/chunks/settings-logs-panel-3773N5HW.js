import "./chunk-CPUCIILR.js";
import "./chunk-AKVSF6J7.js";
import "./chunk-OOESJOAH.js";
import {
  translateElement
} from "./chunk-TXB3JAVG.js";
import "./chunk-IFG75HHC.js";

// src/ui/settings-logs-panel.mjs
var SettingsLogsPanel = class extends HTMLElement {
  constructor() {
    super();
    this._logsTable = null;
  }
  connectedCallback() {
    this._logsTable = document.createElement("logs-table");
    this.appendChild(this._logsTable);
    translateElement(this);
  }
  disconnectedCallback() {
    this._logsTable = null;
  }
  /**
   * Public API: Refresh logs
   */
  refresh() {
    if (this._logsTable) {
      this._logsTable.refresh();
    }
  }
};
customElements.define("settings-logs-panel", SettingsLogsPanel);
//# sourceMappingURL=settings-logs-panel-3773N5HW.js.map
