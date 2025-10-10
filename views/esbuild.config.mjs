import * as esbuild from "esbuild";
import { createRequire } from "module";
import {
  ftlPlugin,
  manifestPlugin,
  versionPlugin,
  copyPublicPlugin,
} from "./scripts/build-plugins.mjs";

const require = createRequire(import.meta.url);
const postCssPlugin = require("esbuild-plugin-postcss").default;

// Check if running in dev mode
const isDev =
  process.argv.includes("--dev") || process.env.NODE_ENV === "development";

console.log(`🔨 Building in ${isDev ? "DEVELOPMENT" : "PRODUCTION"} mode...`);

try {
  await esbuild.build({
    // Entry points
    entryPoints: ["src/main.mjs", "src/styles.css"],

    // Output configuration
    bundle: true,
    outdir: "dist",
    format: "esm", // ES modules format
    splitting: true, // Enable code splitting for dynamic imports (87 locale files!)

    // Resolve configuration
    resolveExtensions: [".mjs", ".js", ".css", ".json"],
    conditions: ["style", "import", "module", "browser", "default"],

    // Cache busting: add content hash to filenames in production
    entryNames: isDev ? "[name]" : "[name].[hash]",
    chunkNames: isDev ? "chunks/[name]" : "chunks/[name].[hash]",
    assetNames: isDev ? "assets/[name]" : "assets/[name].[hash]",

    // Optimization
    minify: !isDev,
    sourcemap: isDev,
    treeShaking: true,

    // Target modern browsers (same as Vite config)
    target: ["es2020", "chrome87", "firefox78", "safari14", "edge88"],

    // Plugins
    plugins: [
      postCssPlugin({
        // Use existing postcss.config.mjs
        plugins: [],
      }),
      ftlPlugin(), // Load .ftl (Fluent) translation files as text
      copyPublicPlugin(), // Copy public/locales to dist/locales
      manifestPlugin(), // Generate manifest.json for Go server
      versionPlugin(), // Generate version.json with build metadata
    ],

    // Global variable definitions (for compatibility with old code)
    define: {
      "process.env.NODE_ENV": isDev ? '"development"' : '"production"',
      global: "globalThis",
      // These are injected by Go templates, so we keep them as-is
      DEFAULTS: "DEFAULTS",
      LIMITS: "LIMITS",
      WEB_UI: "WEB_UI",
      PREFS: "PREFS",
    },

    // File loaders for assets
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
    },

    // Log level
    logLevel: "info",
  });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
