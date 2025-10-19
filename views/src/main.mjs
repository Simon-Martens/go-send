import "./styles.css";
import "./ui/go-send.mjs";
import "./ui/app-footer.mjs";
import storage from "./storage.mjs";
import { APP_VERSION } from "./userSecrets.mjs";
import { syncOwnedFiles } from "./syncFiles.mjs";

(async function start() {
  // Check app version and clear localStorage if version mismatch
  const user = storage.user;
  if (user && user.version && user.version !== APP_VERSION) {
    console.warn(`[App] Version mismatch: stored ${user.version}, current ${APP_VERSION}. Clearing localStorage.`);
    storage.clearAll();
  }

  // Sync files from server if user is logged in
  // This ensures files uploaded from other devices are available
  if (storage.user) {
    syncOwnedFiles(storage.user).catch(err => {
      console.warn("[App] File sync failed during startup", err);
    });
  }

  const app = document.querySelector("go-send");
  if (!app) {
    console.warn("[Router] <go-send> element not found in DOM");
    return;
  }

  // INFO: Load dependencies based on pathname
  const path = window.location.pathname;
  if (path === "/" || path.startsWith("/upload")) {
    // INFO: Matches: / or /upload[...]
    await initUploadRoute(app);
  } else if (path.match(/^\/download/) || path.match(/^\/[0-9a-fA-F]{10,16}/)) {
    // INFO: Matches: /download/... or /{fileId}
    await initDownloadRoute(app);
  } else if (path.startsWith("/register")) {
    // INFO: Matches: /register/admin/[token] or /register/[token]
    await initRegisterRoute(app);
  } else if (path.startsWith("/login")) {
    await initLoginRoute(app);
  } else {
    // TODO: Handle 404
    console.warn(`[Router] Unknown route: ${path}, defaulting to upload`);
    await initUploadRoute(app);
  }

  console.log("[Router] Route initialized");
})();

async function initUploadRoute(app) {
  console.log("[Route] Initializing upload page...");
  await Promise.all([
    import("./ui/upload-layout.mjs"),
    import("./ui/upload-area.mjs"),
    import("./ui/upload-right.mjs"),
    app.controller.ready,
  ]);

  app.showUploadLayout();
  console.log("[Route] Upload page ready");
}

export async function initDownloadRoute(app) {
  console.log("[Route] Initializing download page...");

  // Import download-specific components
  await Promise.all([
    import("./ui/download-layout.mjs"),
    import("./ui/file-password.mjs"),
    import("./ui/file-overview.mjs"),
    import("./ui/file-downloading.mjs"),
    import("./ui/file-finished.mjs"),
    import("./ui/file-error.mjs"),
    app.controller.ready,
  ]);

  app.showDownloadLayout();
  console.log("[Route] Download page ready");
}

async function initRegisterRoute(app) {
  console.log("[Route] Initializing register page...");

  // Import register-specific components
  await Promise.all([
    import("./ui/register-layout.mjs"),
    app.controller.ready,
  ]);

  app.showRegisterLayout();
  console.log("[Route] Register page ready");
}

async function initLoginRoute(app) {
  console.log("[Route] Initializing login page...");

  await Promise.all([
    import("./ui/login-layout.mjs"),
    app.controller.ready,
  ]);

  app.showLoginLayout();
  console.log("[Route] Login page ready");
}
