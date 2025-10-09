import { render } from "solid-js/web";
import getCapabilities from "./capabilities";
import { locale, getTranslator } from "./locale";

export function r(component) {
  const root = document.getElementById("app");
  if (root) {
    render(() => component, root);
  } else {
    console.error("Root element #app not found.");
  }
}

export async function initialize() {
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
      console.log("Service Worker registration failed:", e);
      capabilities.streamDownload = false;
    }
  }

  const translate = await getTranslator(locale());
  setState({
    // WARNING: Assuming DEFAULTS, LIMITS are passed from Go template like window.__CONFIG__
    ...window.__CONFIG__,
    capabilities,
    translate,
    locale: userLocale,
    fileInfo: window.__INITIAL_DATA__ || {},
  });
}
