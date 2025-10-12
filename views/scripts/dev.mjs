import * as esbuild from "esbuild";
import { createRequire } from "module";
import {
  ftlPlugin,
  manifestPlugin,
  versionPlugin,
  copyPublicPlugin,
} from "./build-plugins.mjs";

const require = createRequire(import.meta.url);
const postCssPlugin = require("esbuild-plugin-postcss").default;

console.log("🔍 Starting development watch mode...");

try {
  // Create build context for watch mode
  const ctx = await esbuild.context({
    // Entry points
    entryPoints: ["src/main.mjs"],

    // Output configuration
    bundle: true,
    outdir: "dist",
    format: "esm",
    splitting: true,

    // Resolve configuration
    resolveExtensions: [".mjs", ".js", ".css", ".json"],
    conditions: ["style", "import", "module", "browser", "default"],

    // Development settings (no hashing for faster rebuilds)
    entryNames: "[name]",
    chunkNames: "chunks/[name]",
    assetNames: "assets/[name]",

    // Dev optimizations
    minify: false,
    sourcemap: true,
    treeShaking: false, // Faster rebuilds

    // Target modern browsers
    target: ["es2020", "chrome87", "firefox78", "safari14", "edge88"],

    // Plugins
    plugins: [
      postCssPlugin({
        plugins: [],
      }),
      ftlPlugin(),
      copyPublicPlugin(),
      manifestPlugin(),
      versionPlugin(),
    ],

    // Global definitions
    define: {
      "process.env.NODE_ENV": '"development"',
      global: "globalThis",
      DEFAULTS: "DEFAULTS",
      LIMITS: "LIMITS",
      WEB_UI: "WEB_UI",
      PREFS: "PREFS",
    },

    // File loaders
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

    logLevel: "info",
  });

  // Enable watch mode
  await ctx.watch();

  console.log("✅ Watching for file changes... (Press Ctrl+C to stop)");
  console.log("");
  console.log("📝 Files being watched:");
  console.log("  - src/**/*.{js,mjs,css}");
  console.log("  - public/locales/**/*.ftl");
  console.log("");

  // Keep process running
  process.on("SIGINT", async () => {
    console.log("\n🛑 Stopping watch mode...");
    await ctx.dispose();
    process.exit(0);
  });
} catch (error) {
  console.error("❌ Watch mode failed:", error);
  process.exit(1);
}
