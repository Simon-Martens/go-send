import { defineConfig } from "vite";
import { resolve, join } from "path";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import babel from "vite-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Custom plugin to generate version.json
function versionPlugin() {
  return {
    name: "version-plugin",
    async generateBundle() {
      let commit = "unknown";
      try {
        const { execSync } = await import("child_process");
        commit = execSync("git rev-parse --short HEAD", {
          encoding: "utf-8",
        }).trim();
      } catch (e) {
        console.warn("Error fetching git commit:", e.message);
      }

      const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
      const version = JSON.stringify({
        commit,
        name: pkg.name,
        description: pkg.description,
        license: pkg.license,
        author: pkg.author,
        source: pkg.repository,
        version: process.env.CIRCLE_TAG || `v${pkg.version}`,
      });

      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: version,
      });
    },
  };
}

// Custom plugin to generate manifest.json compatible with Go server
function manifestPlugin() {
  return {
    name: "manifest-plugin",
    writeBundle(options, bundle) {
      const manifest = {};

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === "chunk" && asset.isEntry) {
          // Map entry name to output file
          manifest[`${asset.name}.js`] = fileName;
        } else if (asset.type === "asset" && fileName.endsWith(".css")) {
          // Map CSS files
          if (fileName.includes("app")) {
            manifest["app.css"] = fileName;
          }
        }
      }

      // Write manifest.json to dist/
      const manifestPath = resolve(options.dir, "manifest.json");
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    },
  };
}

// Plugin to load .ftl files as raw text
function ftlLoader() {
  return {
    name: "ftl-loader",
    transform(code, id) {
      if (id.endsWith(".ftl")) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        };
      }
    },
  };
}

// Plugin to handle assets mapping (replaces val-loader + generate_asset_map.js)
function assetsPlugin() {
  return {
    name: "assets-plugin",
    load(id) {
      // Intercept imports of generate_asset_map.js
      if (id.endsWith("common/generate_asset_map.js")) {
        const assetsDir = join(__dirname, "assets");
        const files = readdirSync(assetsDir);

        // Generate asset map: "filename.svg" -> "/filename.svg" (served from public)
        const assetMap = {};
        files.forEach((file) => {
          assetMap[file] = `/${file}`;
        });

        // Return CommonJS format (not ES module) since assets.js uses require()
        const code = `module.exports = ${JSON.stringify(assetMap, null, 2)};`;
        return { code, map: null };
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    root: ".",
    base: "/",

    resolve: {
      alias: {
        // Polyfill Node.js Buffer for browser
        buffer: "buffer/",
      },
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      chunkSizeWarningLimit: 1024,

      rollupOptions: {
        input: {
          app: resolve(__dirname, "app/main.js"),
        },
        output: {
          entryFileNames: isDev ? "[name].js" : "[name].[hash:8].js",
          chunkFileNames: isDev ? "[name].js" : "[name].[hash:8].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith(".css")) {
              return isDev ? "[name].css" : "[name].[hash:8].css";
            }
            // Keep image/asset hashes
            return isDev ? "[name].[ext]" : "[name].[hash:8].[ext]";
          },
        },
      },

      target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      minify: !isDev,
      commonjsOptions: {
        include: [/node_modules/],
      },
    },

    plugins: [
      // CommonJS to ESM conversion must come first
      commonjs({
        include: [/app\/.*\.js$/, /common\/.*\.js$/],
        transformMixedEsModules: true,
      }),
      // Babel plugin for nanohtml transformation
      babel({
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: ["module:nanohtml"],
        },
        filter: /\.(js|jsx)$/,
        // Apply before other transforms
        apply: "build",
      }),
      ftlLoader(),
      assetsPlugin(),
      versionPlugin(),
      manifestPlugin(),
    ],

    publicDir: "public",

    css: {
      postcss: "./postcss.config.js",
    },

    server: {
      port: 8080,
      host: "0.0.0.0",
      proxy: {
        "/api/ws": {
          target: "ws://localhost:8081",
          ws: true,
          secure: false,
        },
      },
    },

    optimizeDeps: {
      include: [
        "choo",
        "@fluent/bundle",
        "@fluent/langneg",
        "core-js",
        "intl-pluralrules",
      ],
    },

    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      // Polyfill Node.js globals
      global: "globalThis",
      DEFAULTS: "DEFAULTS",
      LIMITS: "LIMITS",
      WEB_UI: "WEB_UI",
      PREFS: "PREFS",
    },
  };
});
