// INFO: these two functions are replacements for browsers .toBase54 and .fromBase54
// They were introduced in very late 2024, so browser support is still spotty now.
export function arrayToB64(array) {
  let bin = "";
  const chunkSize = 0x8000; // 32k chars per chunk
  for (let i = 0; i < array.length; i += chunkSize) {
    bin += String.fromCharCode(...array.subarray(i, i + chunkSize));
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64ToArray(str) {
  const b64 =
    str.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function locale() {
  return document.querySelector("html").lang;
}

export function loadShim(polyfill) {
  return new Promise((resolve, _) => {
    const shim = document.createElement("script");
    shim.src = polyfill;
    shim.addEventListener("load", () => resolve(true));
    shim.addEventListener("error", () => resolve(false));
    document.head.appendChild(shim);
  });
}

export function isFile(id) {
  return /^[0-9a-fA-F]{10,16}$/.test(id);
}

export function copyToClipboard(str) {
  const aux = document.createElement("input");
  aux.setAttribute("value", str);
  aux.contentEditable = true;
  aux.readOnly = true;
  document.body.appendChild(aux);
  if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
    const range = document.createRange();
    range.selectNodeContents(aux);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    aux.setSelectionRange(0, str.length);
  } else {
    aux.select();
  }
  const result = document.execCommand("copy");
  document.body.removeChild(aux);
  return result;
}

const LOCALIZE_NUMBERS = !!(
  typeof Intl === "object" &&
  Intl &&
  typeof Intl.NumberFormat === "function" &&
  typeof navigator === "object"
);

const UNITS = ["bytes", "kb", "mb", "gb"];
export function bytes(num) {
  if (num < 1) {
    return "0B";
  }
  const exponent = Math.min(Math.floor(Math.log10(num) / 3), UNITS.length - 1);
  const n = Number(num / Math.pow(1024, exponent));
  const decimalDigits = Math.floor(n) === n ? 0 : 1;
  let nStr = n.toFixed(decimalDigits);
  if (LOCALIZE_NUMBERS) {
    try {
      nStr = n.toLocaleString(locale(), {
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits,
      });
    } catch (e) {
      // fall through
    }
  }
  return translate("fileSize", {
    num: nStr,
    units: translate(UNITS[exponent]),
  });
}

export function percent(ratio) {
  if (LOCALIZE_NUMBERS) {
    try {
      return ratio.toLocaleString(locale(), { style: "percent" });
    } catch (e) {
      // fall through
    }
  }
  return `${Math.floor(ratio * 100)}%`;
}

export function number(n) {
  if (LOCALIZE_NUMBERS) {
    return n.toLocaleString(locale());
  }
  return n.toString();
}

export function allowedCopy() {
  const support = !!document.queryCommandSupported;
  return support ? document.queryCommandSupported("copy") : false;
}

export function delay(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function fadeOut(selector) {
  const classes = document.querySelector(selector).classList;
  classes.remove("effect--fadeIn");
  classes.add("effect--fadeOut");
  return delay(300);
}

export function openLinksInNewTab(links, should = true) {
  links =
    links ||
    Array.from(
      document.querySelectorAll("a:not([target]):not([data-no-new-tab])"),
    );
  if (should) {
    links.forEach((l) => {
      l.setAttribute("target", "_blank");
      l.setAttribute("rel", "noopener noreferrer");
    });
  } else {
    links.forEach((l) => {
      l.removeAttribute("target");
      l.removeAttribute("rel");
    });
  }
  return links;
}

export function browserName() {
  try {
    // order of these matters
    if (/firefox/i.test(navigator.userAgent)) {
      return "firefox";
    }
    if (/edge/i.test(navigator.userAgent)) {
      return "edge";
    }
    if (/edg/i.test(navigator.userAgent)) {
      return "edgium";
    }
    if (/trident/i.test(navigator.userAgent)) {
      return "ie";
    }
    if (/chrome/i.test(navigator.userAgent)) {
      return "chrome";
    }
    if (/safari/i.test(navigator.userAgent)) {
      return "safari";
    }
    if (/send android/i.test(navigator.userAgent)) {
      return "android-app";
    }
    return "other";
  } catch (e) {
    return "unknown";
  }
}

export async function streamToArrayBuffer(stream, size) {
  const reader = stream.getReader();
  let state = await reader.read();

  if (size) {
    const result = new Uint8Array(size);
    let offset = 0;
    while (!state.done) {
      result.set(state.value, offset);
      offset += state.value.length;
      state = await reader.read();
    }
    return result.buffer;
  }

  const parts = [];
  let len = 0;
  while (!state.done) {
    parts.push(state.value);
    len += state.value.length;
    state = await reader.read();
  }
  let offset = 0;
  const result = new Uint8Array(len);
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result.buffer;
}

export function secondsToL10nId(seconds) {
  if (seconds < 3600) {
    return { id: "timespanMinutes", num: Math.floor(seconds / 60) };
  } else if (seconds < 86400) {
    return { id: "timespanHours", num: Math.floor(seconds / 3600) };
  } else {
    return { id: "timespanDays", num: Math.floor(seconds / 86400) };
  }
}

export function timeLeft(milliseconds) {
  if (milliseconds < 1) {
    return { id: "linkExpiredAlt" };
  }
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) {
    return {
      id: "expiresDaysHoursMinutes",
      days,
      hours: hours % 24,
      minutes: minutes % 60,
    };
  }
  if (hours >= 1) {
    return {
      id: "expiresHoursMinutes",
      hours,
      minutes: minutes % 60,
    };
  } else if (hours === 0) {
    if (minutes === 0) {
      return { id: "expiresMinutes", minutes: "< 1" };
    }
    return { id: "expiresMinutes", minutes };
  }
  return null;
}

export function platform() {
  if (typeof Android === "object") {
    return "android";
  }
  return "web";
}

const ECE_RECORD_SIZE = 1024 * 64;
const TAG_LENGTH = 16;
export function encryptedSize(
  size,
  rs = ECE_RECORD_SIZE,
  tagLength = TAG_LENGTH,
) {
  const chunk_meta = tagLength + 1; // Chunk metadata, tag and delimiter
  return 21 + size + chunk_meta * Math.ceil(size / (rs - chunk_meta));
}

let translateReady = false;
let translate = function () {
  throw new Error("uninitialized translate function. call setTranslate first");
};
const pendingTranslations = new Set();

export function setTranslate(t) {
  translate = t;
  translateReady = true;

  // Flush any pending roots that requested translation before we were ready.
  pendingTranslations.forEach((root) => {
    // Only translate connected nodes to avoid needless work
    if (root?.isConnected) {
      internalTranslateElement(root);
    }
  });
  pendingTranslations.clear();
}

export { translate };

/**
 * Translates all elements with data-type="lang" attribute within the given root.
 * Uses the element's id attribute as the translation key.
 * @param {HTMLElement} root - The root element to search within
 */
function internalTranslateElement(root) {
  const elements = root.querySelectorAll('[data-type="lang"]');
  elements.forEach((el) => {
    const key = el.id;
    if (key) {
      try {
        const translated = translate(key);
        if (translated) {
          el.textContent = translated;
        }
      } catch (e) {
        // Keep original text if translation fails
        console.warn(`Translation missing for key: ${key}`);
      }
    }
  });
}

export function translateElement(root) {
  if (!root) {
    return;
  }

  if (!translateReady) {
    pendingTranslations.add(root);
    return;
  }

  internalTranslateElement(root);
}
