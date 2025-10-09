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

export function locale() {
  return document.querySelector("html").lang;
}
