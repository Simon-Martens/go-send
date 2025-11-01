import storage from "./storage.mjs";
import { APP_VERSION } from "./userSecrets.mjs";
import { syncOwnedFiles } from "./syncFiles.mjs";

export async function initUploadRoute(app) {
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

export async function initRegisterRoute(app) {
  console.log("[Route] Initializing register page...");

  await Promise.all([
    import("./ui/register-layout.mjs"),
    app.controller.ready,
  ]);

  app.showRegisterLayout();
  console.log("[Route] Register page ready");
}

export async function initLoginRoute(app) {
  console.log("[Route] Initializing login page...");

  await Promise.all([
    import("./ui/login-layout.mjs"),
    app.controller.ready,
  ]);

  app.showLoginLayout();
  console.log("[Route] Login page ready");
}

export async function initSettingsRoute(app) {
  console.log("[Route] Initializing settings page...");

  await Promise.all([
    import("./ui/settings-layout.mjs"),
    import("./ui/settings-account-panel.mjs"),
    import("./ui/settings-upload-links-panel.mjs"),
    import("./ui/settings-users-panel.mjs"),
    import("./ui/settings-logs-panel.mjs"),
    app.controller.ready,
  ]);

  app.showSettingsLayout();
  console.log("[Route] Settings page ready");
}

export async function initHelpRoute(app) {
  console.log("[Route] Initializing help page...");
  await app.controller.ready;

  app.showHelpLayout();
  console.log("[Route] Help page ready");
}

export async function initRequestInvitationRoute(app) {
  console.log("[Route] Initializing request invitation page...");

  await Promise.all([
    import("./ui/request-invitation-layout.mjs"),
    app.controller.ready,
  ]);

  app.showRequestInvitationLayout();
  console.log("[Route] Request invitation page ready");
}

export async function bootstrapApplication() {
  const user = storage.user;
  if (user && user.version && user.version !== APP_VERSION) {
    console.warn(`[App] Version mismatch: stored ${user.version}, current ${APP_VERSION}. Clearing localStorage.`);
    storage.clearAll();
  }

  if (storage.user) {
    syncOwnedFiles(storage.user).catch(err => {
      console.warn("[App] File sync failed during startup", err);
    });
  }
}
