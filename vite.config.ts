import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import { buildTargets } from "./buildTarget";
import makeManifest from "./utils/plugins/make-manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(
  __dirname,
  process.env.BUILD_TARGET === buildTargets.firefox
    ? "dist/firefox"
    : "dist/chromium"
);
const publicDir = resolve(__dirname, "public");

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
            : "index.ts"
        ),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        popup: resolve(pagesDir, "popup", "index.html"),
        history: resolve(pagesDir, "history", "index.html"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
      onwarn(warning, defaultHandler) {
        return warning.code === "SOURCEMAP_ERROR"
          ? null
          : defaultHandler(warning);
      },
    },
    sourcemap: process.env.__DEV__ === "true",
  },
  plugins: [react(), makeManifest()],
  publicDir,
  resolve: {
    alias: {
      "@/assets": assetsDir,
      "@/pages": pagesDir,
      "@/src": root,
    },
  },
});
