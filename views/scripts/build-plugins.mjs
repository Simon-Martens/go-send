import { readFile, writeFile, cp } from "fs/promises";
import { watch } from "fs";
import { execSync } from "child_process";
import path from "path";
import { glob } from "glob";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

/**
 * ESBuild plugin to load .ftl (Fluent) locale files as raw text strings
 * Replaces the ftlLoader from Vite config
 */
export function ftlPlugin() {
  return {
    name: "ftl-loader",
    setup(build) {
      build.onLoad({ filter: /\.ftl$/ }, async (args) => {
        const text = await readFile(args.path, "utf8");
        return {
          contents: `export default ${JSON.stringify(text)}`,
          loader: "js",
        };
      });
    },
  };
}

/**
 * ESBuild plugin to generate manifest.json
 * Maps logical filenames to hashed output files
 * Example: main.mjs → main.abc123.js AND main.abc123.css (if CSS is imported)
 * This manifest is consumed by the Go server to inject correct asset URLs in templates
 */
export function manifestPlugin() {
  return {
    name: "manifest-plugin",
    setup(build) {
      build.initialOptions.metafile = true; // Required to get output file info

      build.onEnd(async (result) => {
        if (!result.metafile) return;

        const manifest = {};

        // Parse metafile to map entry points to output files
        for (const [outfile, info] of Object.entries(result.metafile.outputs)) {
          const filename = path.basename(outfile);

          // Handle direct entry points (JS files, service worker)
          if (info.entryPoint) {
            const entryName = path.basename(
              info.entryPoint,
              path.extname(info.entryPoint),
            );
            const ext = path.extname(filename);
            const logicalName = `${entryName}${ext}`;
            manifest[logicalName] = filename;
          }

          // Handle CSS extracted from JS imports
          // ESBuild doesn't set entryPoint on extracted CSS, so we detect by pattern
          // Example: main.ABC123.css → main.css
          else if (filename.endsWith('.css')) {
            // Extract base name before the hash
            // Pattern: name.HASH.css or name.css
            const match = filename.match(/^([^.]+)(?:\.[A-Z0-9]+)?\.css$/);
            if (match) {
              const baseName = match[1];
              const logicalName = `${baseName}.css`;
              manifest[logicalName] = filename;
            }
          }
        }

        // Write manifest.json to dist/
        const manifestPath = path.join(
          build.initialOptions.outdir || "dist",
          "manifest.json",
        );
        await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        console.log("✓ Generated manifest.json");
      });
    },
  };
}

/**
 * ESBuild plugin to generate version.json with build metadata
 * Includes git commit, package.json info, and build timestamp
 */
export function versionPlugin() {
  return {
    name: "version-plugin",
    setup(build) {
      build.onEnd(async () => {
        // Get git commit hash (short form)
        let commit = "unknown";
        try {
          commit = execSync("git rev-parse --short HEAD", {
            encoding: "utf-8",
            cwd: process.cwd(),
          }).trim();
        } catch (e) {
          console.warn("⚠ Could not fetch git commit:", e.message);
        }

        // Read package.json for metadata
        let pkg = {};
        try {
          const pkgContent = await readFile("./package.json", "utf-8");
          pkg = JSON.parse(pkgContent);
        } catch (e) {
          console.warn("⚠ Could not read package.json:", e.message);
        }

        const version = {
          commit,
          name: pkg.name || "go-send-frontend",
          description: pkg.description || "",
          license: pkg.license || "MIT",
          author: pkg.author || "",
          source: pkg.repository || "",
          version:
            process.env.CIRCLE_TAG ||
            process.env.VERSION ||
            `v${pkg.version || "0.0.0"}`,
          buildTime: new Date().toISOString(),
        };

        // Write version.json to dist/
        const versionPath = path.join(
          build.initialOptions.outdir || "dist",
          "version.json",
        );
        await writeFile(versionPath, JSON.stringify(version, null, 2));
        console.log("✓ Generated version.json");
      });
    },
  };
}

/**
 * ESBuild plugin to process CSS with PostCSS and Tailwind
 */
export function tailwindPlugin() {
  return {
    name: "tailwind-plugin",
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const css = await readFile(args.path, "utf8");
        const result = await postcss([tailwindcss()]).process(css, {
          from: args.path,
          to: undefined,
        });
        return {
          contents: result.css,
          loader: "css",
        };
      });
    },
  };
}

/**
 * ESBuild plugin to copy public/ and assets/ directories to dist/
 * - Copies contents of public/ folder directly to dist/
 * - Copies contents of assets/ folder directly to dist/
 * These static files are served as-is by the Go server
 */
export function copyPublicPlugin() {
  return {
    name: "copy-public",
    setup(build) {
      build.onEnd(async () => {
        const outdir = build.initialOptions.outdir || "dist";
        const { readdir } = await import("fs/promises");

        try {
          // Copy all files from public/ directly to dist/
          const publicFiles = await readdir("public", { withFileTypes: true });
          for (const file of publicFiles) {
            const src = path.join("public", file.name);
            const dest = path.join(outdir, file.name);
            await cp(src, dest, { recursive: true, force: true });
          }
          console.log("✓ Copied public/ contents to dist/");

          // Copy all files from assets/ directly to dist/
          const assetFiles = await readdir("assets", { withFileTypes: true });
          for (const file of assetFiles) {
            const src = path.join("assets", file.name);
            const dest = path.join(outdir, file.name);
            await cp(src, dest, { recursive: true, force: true });
          }
          console.log("✓ Copied assets/ contents to dist/");
        } catch (e) {
          console.warn("⚠ Could not copy static directories:", e.message);
        }
      });
    },
  };
}

/**
 * ESBuild plugin to watch Go templates and trigger rebuilds
 * This ensures Tailwind rebuilds when you add classes to .gohtml files
 * Only active in watch mode
 */
export function templateWatchPlugin() {
  let watchers = new Set();

  return {
    name: "template-watch",
    setup(build) {
      build.onStart(async () => {
        // Clean up old watchers
        watchers.forEach((watcher) => watcher.close());
        watchers.clear();

        // Find all .gohtml files
        const templates = await glob("templates/**/*.gohtml");

        // Watch each template file
        templates.forEach((templatePath) => {
          const watcher = watch(templatePath, (eventType) => {
            if (eventType === "change") {
              console.log(`📝 Template changed: ${templatePath} - Tailwind will rebuild`);
            }
          });
          watchers.add(watcher);
        });
      });

      // Cleanup on build end
      build.onEnd(() => {
        if (!build.initialOptions.watch) {
          watchers.forEach((watcher) => watcher.close());
          watchers.clear();
        }
      });
    },
  };
}
