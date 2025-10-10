/* global DEFAULTS LIMITS WEB_UI PREFS */
import "./styles.css";
import getCapabilities from "./capabilities.mjs";
import storage from "./storage.mjs";
import { getTranslator } from "./locale.mjs";
import Archive from "./archive.mjs";
import { setTranslate, locale } from "./utils.mjs";

(async function start() {
  const capabilities = await getCapabilities();
  if (
    !capabilities.crypto &&
    window.location.pathname !== "/unsupported/crypto"
  ) {
    return window.location.assign("/unsupported/crypto");
  }
  if (capabilities.serviceWorker) {
    try {
      await navigator.serviceWorker.register("/serviceWorker.js");
      await navigator.serviceWorker.ready;
    } catch (e) {
      // continue but disable streaming downloads
      console.log("Service Worker registration failed:", e);
      capabilities.streamDownload = false;
    }
  }

  const translate = await getTranslator(locale());
  setTranslate(translate);
  // eslint-disable-next-line require-atomic-updates
  window.initialState = {
    LIMITS,
    DEFAULTS,
    WEB_UI,
    PREFS,
    archive: new Archive([], DEFAULTS.EXPIRE_SECONDS, DEFAULTS.DOWNLOADS),
    capabilities,
    translate,
    storage,
    transfer: null,
    fileInfo: null,
    locale: locale(),
  };
})();
