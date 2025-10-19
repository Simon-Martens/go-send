import "./styles.css";
import "./ui/go-send.mjs";
import "./ui/app-footer.mjs";
import * as router from "./router.mjs";

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

async function navigate(path, app) {
  if (path === "/" || path.startsWith("/upload")) {
    await router.initUploadRoute(app);
  } else if (path.match(/^\/download/) || path.match(/^\/[0-9a-fA-F]{10,16}/)) {
    await router.initDownloadRoute(app);
  } else if (path.startsWith("/register")) {
    await router.initRegisterRoute(app);
  } else if (path === "/settings") {
    await router.initSettingsRoute(app);
  } else if (path.startsWith("/login")) {
    await router.initLoginRoute(app);
  } else {
    console.warn(`[Router] Unknown route: ${path}, defaulting to upload`);
    await router.initUploadRoute(app);
  }
}
