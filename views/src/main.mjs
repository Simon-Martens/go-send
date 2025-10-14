import "./styles.css";
import "./ui/go-send.mjs";

(async function start() {
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
