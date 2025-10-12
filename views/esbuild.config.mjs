import * as esbuild from "esbuild";
import {
  ftlPlugin,
  manifestPlugin,
  versionPlugin,
  copyPublicPlugin,
  tailwindPlugin,
  templateWatchPlugin,
} from "./scripts/build-plugins.mjs";

// Detect mode
const isDev =
  process.argv.includes("--dev") ||
  process.argv.includes("--watch") ||
  process.env.NODE_ENV === "development";

const isWatch = process.argv.includes("--watch");

console.log(
  `🔨 Building in ${isDev ? "DEVELOPMENT" : "PRODUCTION"} mode${isWatch ? " (watch)" : ""}...`,
);

/**
 * Shared base configuration for both main app and service worker
 */
const baseConfig = {
  bundle: true,
  format: "esm",
  resolveExtensions: [".mjs", ".js", ".css", ".json"],
  conditions: ["style", "import", "module", "browser", "default"],
  minify: !isDev,
  sourcemap: isDev,
  target: ["es2020", "chrome87", "firefox78", "safari14", "edge88"],
  treeShaking: !isDev, // Faster rebuilds in dev
  define: {
    "process.env.NODE_ENV": isDev ? '"development"' : '"production"',
    global: "globalThis",
    // Injected by Go templates
    DEFAULTS: "DEFAULTS",
    LIMITS: "LIMITS",
    WEB_UI: "WEB_UI",
    PREFS: "PREFS",
  },
  loader: {
    ".svg": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".gif": "file",
    ".webp": "file",
    ".woff": "file",
    ".woff2": "file",
    ".eot": "file",
    ".ttf": "file",
    ".otf": "file",
    ".json": "json",
  },
  logLevel: "info",
};

/**
 * Service worker configuration (stable filename, no hash)
 */
const serviceWorkerConfig = {
  ...baseConfig,
  entryPoints: ["src/serviceWorker.mjs"],
  outdir: "dist",
  entryNames: "serviceWorker", // Always serviceWorker.js
};

/**
 * Main app configuration (with hashing for cache busting)
 */
const mainConfig = {
  ...baseConfig,
  entryPoints: ["src/main.mjs"], // CSS is imported from main.mjs
  outdir: "dist",
  splitting: true, // Enable code splitting for 87 locale files
  // Cache busting: add content hash in production, clean names in dev
  entryNames: isDev ? "[name]" : "[name].[hash]",
  chunkNames: isDev ? "chunks/[name]" : "chunks/[name].[hash]",
  assetNames: isDev ? "assets/[name]" : "assets/[name].[hash]",
  plugins: [
    tailwindPlugin(), // Process CSS with PostCSS + Tailwind
    ftlPlugin(), // Load .ftl locale files as text
    copyPublicPlugin(), // Copy public/ and assets/ to dist/
    manifestPlugin(), // Generate manifest.json for Go server
    versionPlugin(), // Generate version.json with build metadata
    ...(isWatch ? [templateWatchPlugin()] : []), // Watch templates for Tailwind class changes
  ],
};

/**
 * Build or watch
 */
async function build() {
  try {
    if (isWatch) {
      // Watch mode - rebuild on file changes
      const [swCtx, mainCtx] = await Promise.all([
        esbuild.context(serviceWorkerConfig),
        esbuild.context(mainConfig),
      ]);

      await Promise.all([swCtx.watch(), mainCtx.watch()]);

      console.log("✅ Watching for file changes... (Press Ctrl+C to stop)");
      console.log("");
      console.log("📝 Files being watched:");
      console.log("  - src/**/*.{js,mjs,css}");
      console.log("  - templates/**/*.gohtml (triggers Tailwind rebuild)");
      console.log("  - public/locales/**/*.ftl");
      console.log("");

      // Handle graceful shutdown
      process.on("SIGINT", async () => {
        console.log("\n🛑 Stopping watch mode...");
        await Promise.all([swCtx.dispose(), mainCtx.dispose()]);
        process.exit(0);
      });
    } else {
      // One-time build
      await Promise.all([
        esbuild.build(serviceWorkerConfig),
        esbuild.build(mainConfig),
      ]);
      console.log("✅ Build completed successfully!");
    }
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
