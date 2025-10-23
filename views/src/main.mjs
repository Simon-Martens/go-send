import "./styles.css";
import "./ui/go-send.mjs";
import "./ui/app-footer.mjs";
import * as router from "./router.mjs";
import storage from "./storage.mjs";
import { hasGuestToken } from "./utils.mjs";

(async function start() {
  await router.bootstrapApplication();

  const app = document.querySelector("go-send");
  if (!app) {
    console.warn("[Router] <go-send> element not found in DOM");
    return;
  }

  await navigate(window.location.pathname, app);

  window.addEventListener("popstate", async () => {
    await navigate(window.location.pathname, app);
  });

  console.log("[Router] Route initialized");
})();

const AUTH_STATE = {
  NONE: "none",
  GUEST: "guest",
  USER: "user",
};

/**
 * Determine current authentication state and handle ephemeral session validation.
 * Redirects to /logout if an ephemeral session is no longer valid.
 * @returns {"none" | "guest" | "user"}
 */
function getAuthState() {
  const user = storage.user;

  if (!user) {
    return hasGuestToken() ? AUTH_STATE.GUEST : AUTH_STATE.NONE;
  }

  const isTrusted = storage.getTrustPreference();
  if (!isTrusted) {
    const sessionValid = sessionStorage.getItem("session_valid");
    if (!sessionValid) {
      console.log("[Auth] Ephemeral session expired (browser restart detected)");
      window.location.assign("/logout");
      return AUTH_STATE.NONE;
    }
  }

  return AUTH_STATE.USER;
}

async function navigate(path, app) {
  // Download routes are always public
  if (path.match(/^\/download/) || path.match(/^\/[0-9a-fA-F]{10,16}/)) {
    await router.initDownloadRoute(app);
    return;
  }

  // Help route is always public
  if (path === "/help" || path.startsWith("/help/")) {
    await router.initHelpRoute(app);
    return;
  }

  // Login and register routes are always accessible
  if (path.startsWith("/login")) {
    await router.initLoginRoute(app);
    return;
  }

  if (path.startsWith("/register")) {
    await router.initRegisterRoute(app);
    return;
  }

  // Check if UPLOAD_GUARD is enabled
  const uploadGuardEnabled = window.FEATURES?.UploadGuard ?? false;

  // Protected routes: /upload (including "/") and /settings
  const isProtectedRoute = path === "/" || path.startsWith("/upload") || path === "/settings";

  const authState = getAuthState();

  if (uploadGuardEnabled && isProtectedRoute) {
    if (authState === AUTH_STATE.NONE) {
      console.log("[Auth] Protected route requires authentication, redirecting to /login");
      window.location.assign("/login");
      return;
    }
    if (authState === AUTH_STATE.GUEST && path === "/settings") {
      window.location.replace("/");
      return;
    }
  }

  // Route to appropriate page
  if (path === "/" || path.startsWith("/upload")) {
    await router.initUploadRoute(app);
  } else if (path === "/settings") {
    if (authState === AUTH_STATE.USER) {
      await router.initSettingsRoute(app);
    } else {
      window.location.replace("/");
    }
  } else {
    console.warn(`[Router] Unknown route: ${path}, defaulting to upload`);
    await router.initUploadRoute(app);
  }
}
