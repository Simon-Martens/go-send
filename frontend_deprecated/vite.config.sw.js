import { defineConfig } from 'vite';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';

// Separate config for service worker (no dependencies, plain JS)
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    root: '.',
    base: '/',

    plugins: [
      // CommonJS to ESM conversion
      commonjs({
        include: [/app\/.*\.js$/, /common\/.*\.js$/],
        transformMixedEsModules: true
      })
    ],

    build: {
      outDir: 'dist',
      emptyOutDir: false, // Don't delete main app build
      sourcemap: true,

      lib: {
        entry: resolve(__dirname, 'app/serviceWorker.js'),
        name: 'ServiceWorker',
        fileName: () => 'serviceWorker.js',
        formats: ['es']
      },

      rollupOptions: {
        output: {
          entryFileNames: 'serviceWorker.js',
          // Service worker is standalone, no code splitting
          inlineDynamicImports: true
        }
      },

      // Modern browser target
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],

      minify: !isDev
    }
  };
});
