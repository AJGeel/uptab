import { resolve } from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import { buildTargets } from "./buildTarget.ts";
import includeChangelog from "./utils/plugins/include-changelog.ts";
import makeManifest from "./utils/plugins/make-manifest.ts";

const root = resolve(import.meta.dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(
  import.meta.dirname,
  process.env.BUILD_TARGET === buildTargets.firefox
    ? "dist/firefox"
    : "dist/chromium",
);
const publicDir = resolve(import.meta.dirname, "public");

export default defineConfig({
  build: {
    outDir,
    rollupOptions: {
      input: {
        background: resolve(
          pagesDir,
          "background",
          process.env.BUILD_TARGET === buildTargets.firefox
            ? "index.html"
            : "index.ts",
        ),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        popup: resolve(pagesDir, "popup", "index.html"),
        changelog: resolve(pagesDir, "changelog", "index.html"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
      /*
       * react-markdown's dependencies use `''` statements as JSDoc separators,
       * which Rolldown reports as directives. They're harmless.
       */
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.id?.includes("node_modules")
        ) {
          return;
        }

        warn(warning);
      },
    },
    sourcemap: process.env.__DEV__ === "true",
  },
  plugins: [react(), tailwindcss(), makeManifest(), includeChangelog()],
  publicDir,
  resolve: {
    alias: {
      "@/assets": assetsDir,
      "@/pages": pagesDir,
      "@/src": root,
    },
  },
});
