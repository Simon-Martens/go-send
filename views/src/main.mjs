import "./styles.css";
import "./ui/go-send.mjs";
import "./ui/app-footer.mjs";
import * as router from "./router.mjs";
import storage from "./storage.mjs";

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

/**
 * Check if the user is authenticated and handle ephemeral session validation
 * @returns {boolean} true if authenticated, false otherwise
 */
function checkAuth() {
  const user = storage.user;

  // No user data means not authenticated
  if (!user) {
    return false;
  }

  // Check if this is an ephemeral session (not trusting computer)
  const isTrusted = storage.getTrustPreference();

  // For ephemeral sessions, verify the session_valid flag exists
  // If missing, browser was restarted and session should be invalid
  if (!isTrusted) {
    const sessionValid = sessionStorage.getItem("session_valid");
    if (!sessionValid) {
      console.log("[Auth] Ephemeral session expired (browser restart detected)");
      // Redirect to logout to clear everything
      window.location.assign("/logout");
      return false;
    }
  }

  return true;
}

async function navigate(path, app) {
  // Download routes are always public
  if (path.match(/^\/download/) || path.match(/^\/[0-9a-fA-F]{10,16}/)) {
    await router.initDownloadRoute(app);
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

  if (uploadGuardEnabled && isProtectedRoute) {
    // Verify authentication before allowing access
    if (!checkAuth()) {
      console.log("[Auth] Protected route requires authentication, redirecting to /login");
      window.location.assign("/login");
      return;
    }
  }

  // Route to appropriate page
  if (path === "/" || path.startsWith("/upload")) {
    await router.initUploadRoute(app);
  } else if (path === "/settings") {
    await router.initSettingsRoute(app);
  } else {
    console.warn(`[Router] Unknown route: ${path}, defaulting to upload`);
    await router.initUploadRoute(app);
  }
}
