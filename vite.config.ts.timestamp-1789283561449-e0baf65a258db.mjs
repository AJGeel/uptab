// vite.config.ts
import { resolve as resolve3 } from "path";
import react from "file:///Users/geel/Desktop/dev/personal/uptab/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///Users/geel/Desktop/dev/personal/uptab/node_modules/vite/dist/node/index.js";

// buildTarget.ts
var buildTargets = {
  chromium: "chrome",
  firefox: "firefox"
};

// utils/plugins/include-changelog.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS.Dim;
  }
  console.log(color, message);
}
var COLORS = {
  BgBlack: "\x1B[40m",
  BgBlue: "\x1B[44m",
  BgCyan: "\x1B[46m",
  BgGreen: "\x1B[42m",
  BgMagenta: "\x1B[45m",
  BgRed: "\x1B[41m",
  BgWhite: "\x1B[47m",
  BgYellow: "\x1B[43m",
  Blink: "\x1B[5m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  FgBlack: "\x1B[30m",
  FgBlue: "\x1B[34m",
  FgCyan: "\x1B[36m",
  FgGreen: "\x1B[32m",
  FgMagenta: "\x1B[35m",
  FgRed: "\x1B[31m",
  FgWhite: "\x1B[37m",
  FgYellow: "\x1B[33m",
  Hidden: "\x1B[8m",
  Reset: "\x1B[0m",
  Reverse: "\x1B[7m",
  Underscore: "\x1B[4m"
};

// utils/plugins/include-changelog.ts
var __vite_injected_original_dirname = "/Users/geel/Desktop/dev/personal/uptab/utils/plugins";
var { resolve } = path;
var outDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
var changelogPath = resolve(__vite_injected_original_dirname, "..", "..", "CHANGELOG.md");
function includeChangelog() {
  return {
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      const destinationPath = resolve(outDir, "CHANGELOG.md");
      if (!fs.existsSync(changelogPath)) {
        colorLog(`Changelog file not found: ${changelogPath}`, "error");
        return;
      }
      fs.copyFileSync(changelogPath, destinationPath);
      colorLog(`Changelog file copy complete: ${destinationPath}`, "success");
    },
    name: "include-changelog"
  };
}

// utils/plugins/make-manifest.ts
import * as fs2 from "fs";
import * as path2 from "path";

// package.json
var package_default = {
  name: "uptab",
  displayName: "UpTab",
  version: "1.4.0",
  description: "What's UpTab?",
  author: "Arthur Geel <ageel@enrise.com>",
  scripts: {
    dev: "BUILD_TARGET=firefox nodemon & bun load:firefox",
    build: "BUILD_TARGET=chrome vite build && BUILD_TARGET=firefox vite build",
    zip: "cd dist/firefox && zip -r firefox.zip . && mv firefox.zip ../firefox.zip && cd ../../ && cd dist/chromium && zip -r chromium.zip . && mv chromium.zip ../chromium.zip && cd ../../",
    ship: "bun run build && bun zip",
    test: "vitest",
    "test:watch": "vitest --watch",
    lint: "eslint ./",
    "lint:fix": "eslint ./ --fix",
    "lint:firefox": "web-ext lint --source-dir dist/firefox --output json --pretty | grep -v 'Applying config file: ./package.json' > dist/firefox-lint-output.json",
    "load:firefox": "web-ext run --source-dir dist/firefox",
    "chrome:store": "bun dev/commands/chrome/main.ts",
    "firefox:store": "bun dev/commands/firefox/main.ts"
  },
  type: "module",
  dependencies: {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@heroicons/react": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-switch": "^1.0.3",
    "@sentry/browser": "^8.20.0",
    "@tanstack/react-query": "^5.51.14",
    clsx: "^2.1.0",
    "date-fns": "^3.6.0",
    deepmerge: "^4.3.1",
    motion: "^13.1.1",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.50.1",
    "react-markdown": "^9.0.1",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    uuid: "^10.0.0",
    "webextension-polyfill": "^0.12.0",
    zustand: "^4.5.4"
  },
  devDependencies: {
    "@tailwindcss/typography": "^0.5.10",
    "@tanstack/eslint-plugin-query": "^5.12.1",
    "@types/inquirer": "^9.0.7",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.17",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/uuid": "^10.0.0",
    "@types/webextension-polyfill": "^0.10.7",
    "@typescript-eslint/eslint-plugin": "^7.0.1",
    "@typescript-eslint/parser": "^7.0.1",
    "@vitejs/plugin-react-swc": "^3.6.0",
    autoprefixer: "^10.4.17",
    bun: "^1.1.20",
    eslint: "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-import-resolver-alias": "^1.1.2",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-prettier": "^5.5.6",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-tailwindcss": "^3.14.2",
    "fs-extra": "^11.2.0",
    inquirer: "^9.2.14",
    jsonwebtoken: "^9.0.2",
    nodemon: "^3.1.4",
    postcss: "^8.4.40",
    prettier: "^3.9.6",
    tailwindcss: "^3.4.7",
    typescript: "^5.5.4",
    vite: "^5.3.5",
    vitest: "^2.0.4",
    "web-ext": "^8.2.0"
  }
};

// src/manifest.ts
var pages = {
  background: "src/pages/background/index.js",
  new: "src/pages/newtab/index.html",
  popup: "src/pages/popup/index.html"
};
var manifest = {
  action: {
    default_icon: "icon-34.png",
    default_popup: pages.popup
  },
  background: process.env.BUILD_TARGET === buildTargets.firefox ? {
    page: pages.background.split(".js")[0] + ".html"
  } : {
    service_worker: pages.background,
    type: "module"
  },
  chrome_url_overrides: {
    newtab: pages.new
  },
  ...process.env.BUILD_TARGET === buildTargets.firefox ? {
    chrome_settings_overrides: {
      homepage: pages.new
    }
  } : {},
  description: "What's UpTab?",
  icons: {
    "128": "icon-128.png"
  },
  manifest_version: 3,
  name: "UpTab",
  permissions: ["storage", "geolocation", "bookmarks"],
  version: package_default.version,
  web_accessible_resources: [
    {
      matches: [],
      resources: ["icon-128.png", "icon-34.png"]
    }
  ],
  ...process.env.BUILD_TARGET === buildTargets.firefox ? {
    browser_specific_settings: {
      gecko: {
        id: "ageel@enrise.com",
        strict_min_version: "109.0"
      }
    }
  } : {}
};
var manifest_default = manifest;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname2 = "/Users/geel/Desktop/dev/personal/uptab/utils/plugins";
var { resolve: resolve2 } = path2;
var outDir2 = resolve2(__vite_injected_original_dirname2, "..", "..", "public");
function makeManifest() {
  return {
    buildEnd() {
      if (!fs2.existsSync(outDir2)) {
        fs2.mkdirSync(outDir2);
      }
      const manifestPath = resolve2(outDir2, "manifest.json");
      fs2.writeFileSync(manifestPath, JSON.stringify(manifest_default, null, 2));
      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    },
    name: "make-manifest"
  };
}

// vite.config.ts
var __vite_injected_original_dirname3 = "/Users/geel/Desktop/dev/personal/uptab";
var root = resolve3(__vite_injected_original_dirname3, "src");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var outDir3 = resolve3(
  __vite_injected_original_dirname3,
  process.env.BUILD_TARGET === buildTargets.firefox ? "dist/firefox" : "dist/chromium"
);
var publicDir = resolve3(__vite_injected_original_dirname3, "public");
var vite_config_default = defineConfig({
  build: {
    outDir: outDir3,
    rollupOptions: {
      input: {
        background: resolve3(
          pagesDir,
          "background",
          process.env.BUILD_TARGET === buildTargets.firefox ? "index.html" : "index.ts"
        ),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        changelog: resolve3(pagesDir, "changelog", "index.html")
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      }
    },
    sourcemap: process.env.__DEV__ === "true"
  },
  plugins: [react(), makeManifest(), includeChangelog()],
  publicDir,
  resolve: {
    alias: {
      "@/assets": assetsDir,
      "@/pages": pagesDir,
      "@/src": root
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGRUYXJnZXQudHMiLCAidXRpbHMvcGx1Z2lucy9pbmNsdWRlLWNoYW5nZWxvZy50cyIsICJ1dGlscy9sb2cudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInBhY2thZ2UuanNvbiIsICJzcmMvbWFuaWZlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmltcG9ydCB7IGJ1aWxkVGFyZ2V0cyB9IGZyb20gXCIuL2J1aWxkVGFyZ2V0XCI7XG5pbXBvcnQgaW5jbHVkZUNoYW5nZWxvZyBmcm9tIFwiLi91dGlscy9wbHVnaW5zL2luY2x1ZGUtY2hhbmdlbG9nXCI7XG5pbXBvcnQgbWFrZU1hbmlmZXN0IGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdFwiO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShcbiAgX19kaXJuYW1lLFxuICBwcm9jZXNzLmVudi5CVUlMRF9UQVJHRVQgPT09IGJ1aWxkVGFyZ2V0cy5maXJlZm94XG4gICAgPyBcImRpc3QvZmlyZWZveFwiXG4gICAgOiBcImRpc3QvY2hyb21pdW1cIixcbik7XG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWNcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUoXG4gICAgICAgICAgcGFnZXNEaXIsXG4gICAgICAgICAgXCJiYWNrZ3JvdW5kXCIsXG4gICAgICAgICAgcHJvY2Vzcy5lbnYuQlVJTERfVEFSR0VUID09PSBidWlsZFRhcmdldHMuZmlyZWZveFxuICAgICAgICAgICAgPyBcImluZGV4Lmh0bWxcIlxuICAgICAgICAgICAgOiBcImluZGV4LnRzXCIsXG4gICAgICAgICksXG4gICAgICAgIG5ld3RhYjogcmVzb2x2ZShwYWdlc0RpciwgXCJuZXd0YWJcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBwb3B1cDogcmVzb2x2ZShwYWdlc0RpciwgXCJwb3B1cFwiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGNoYW5nZWxvZzogcmVzb2x2ZShwYWdlc0RpciwgXCJjaGFuZ2Vsb2dcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGNodW5rKSA9PiBgc3JjL3BhZ2VzLyR7Y2h1bmsubmFtZX0vaW5kZXguanNgLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gXCJ0cnVlXCIsXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtYWtlTWFuaWZlc3QoKSwgaW5jbHVkZUNoYW5nZWxvZygpXSxcbiAgcHVibGljRGlyLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQC9hc3NldHNcIjogYXNzZXRzRGlyLFxuICAgICAgXCJAL3BhZ2VzXCI6IHBhZ2VzRGlyLFxuICAgICAgXCJAL3NyY1wiOiByb290LFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9nZWVsL0Rlc2t0b3AvZGV2L3BlcnNvbmFsL3VwdGFiL2J1aWxkVGFyZ2V0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9nZWVsL0Rlc2t0b3AvZGV2L3BlcnNvbmFsL3VwdGFiL2J1aWxkVGFyZ2V0LnRzXCI7ZXhwb3J0IGNvbnN0IGJ1aWxkVGFyZ2V0cyA9IHtcbiAgY2hyb21pdW06IFwiY2hyb21lXCIsXG4gIGZpcmVmb3g6IFwiZmlyZWZveFwiLFxufSBhcyBjb25zdDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdXRpbHMvcGx1Z2lucy9pbmNsdWRlLWNoYW5nZWxvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi91dGlscy9wbHVnaW5zL2luY2x1ZGUtY2hhbmdlbG9nLnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5cbmltcG9ydCBjb2xvckxvZyBmcm9tIFwiLi4vbG9nXCI7XG5cbmNvbnN0IHsgcmVzb2x2ZSB9ID0gcGF0aDtcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiwgXCIuLlwiLCBcInB1YmxpY1wiKTtcbmNvbnN0IGNoYW5nZWxvZ1BhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiQ0hBTkdFTE9HLm1kXCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmNsdWRlQ2hhbmdlbG9nKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgYnVpbGRFbmQoKSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0RGlyKSkge1xuICAgICAgICBmcy5ta2RpclN5bmMob3V0RGlyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gcmVzb2x2ZShvdXREaXIsIFwiQ0hBTkdFTE9HLm1kXCIpO1xuXG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoY2hhbmdlbG9nUGF0aCkpIHtcbiAgICAgICAgY29sb3JMb2coYENoYW5nZWxvZyBmaWxlIG5vdCBmb3VuZDogJHtjaGFuZ2Vsb2dQYXRofWAsIFwiZXJyb3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZnMuY29weUZpbGVTeW5jKGNoYW5nZWxvZ1BhdGgsIGRlc3RpbmF0aW9uUGF0aCk7XG4gICAgICBjb2xvckxvZyhgQ2hhbmdlbG9nIGZpbGUgY29weSBjb21wbGV0ZTogJHtkZXN0aW5hdGlvblBhdGh9YCwgXCJzdWNjZXNzXCIpO1xuICAgIH0sXG4gICAgbmFtZTogXCJpbmNsdWRlLWNoYW5nZWxvZ1wiLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdXRpbHMvbG9nLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9nZWVsL0Rlc2t0b3AvZGV2L3BlcnNvbmFsL3VwdGFiL3V0aWxzL2xvZy50c1wiOy8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbnR5cGUgQ29sb3JUeXBlID0gXCJzdWNjZXNzXCIgfCBcImluZm9cIiB8IFwiZXJyb3JcIiB8IFwid2FybmluZ1wiIHwga2V5b2YgdHlwZW9mIENPTE9SUztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sb3JMb2cobWVzc2FnZTogc3RyaW5nLCB0eXBlPzogQ29sb3JUeXBlKSB7XG4gIGxldCBjb2xvcjogc3RyaW5nID0gdHlwZSB8fCBDT0xPUlMuRmdCbGFjaztcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdHcmVlbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0JsdWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnUmVkO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIndhcm5pbmdcIjpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnWWVsbG93O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkRpbTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKTtcbn1cblxuY29uc3QgQ09MT1JTID0ge1xuICBCZ0JsYWNrOiBcIlxceDFiWzQwbVwiLFxuICBCZ0JsdWU6IFwiXFx4MWJbNDRtXCIsXG4gIEJnQ3lhbjogXCJcXHgxYls0Nm1cIixcbiAgQmdHcmVlbjogXCJcXHgxYls0Mm1cIixcbiAgQmdNYWdlbnRhOiBcIlxceDFiWzQ1bVwiLFxuICBCZ1JlZDogXCJcXHgxYls0MW1cIixcbiAgQmdXaGl0ZTogXCJcXHgxYls0N21cIixcbiAgQmdZZWxsb3c6IFwiXFx4MWJbNDNtXCIsXG4gIEJsaW5rOiBcIlxceDFiWzVtXCIsXG4gIEJyaWdodDogXCJcXHgxYlsxbVwiLFxuICBEaW06IFwiXFx4MWJbMm1cIixcbiAgRmdCbGFjazogXCJcXHgxYlszMG1cIixcbiAgRmdCbHVlOiBcIlxceDFiWzM0bVwiLFxuICBGZ0N5YW46IFwiXFx4MWJbMzZtXCIsXG4gIEZnR3JlZW46IFwiXFx4MWJbMzJtXCIsXG4gIEZnTWFnZW50YTogXCJcXHgxYlszNW1cIixcbiAgRmdSZWQ6IFwiXFx4MWJbMzFtXCIsXG4gIEZnV2hpdGU6IFwiXFx4MWJbMzdtXCIsXG4gIEZnWWVsbG93OiBcIlxceDFiWzMzbVwiLFxuICBIaWRkZW46IFwiXFx4MWJbOG1cIixcbiAgUmVzZXQ6IFwiXFx4MWJbMG1cIixcbiAgUmV2ZXJzZTogXCJcXHgxYls3bVwiLFxuICBVbmRlcnNjb3JlOiBcIlxceDFiWzRtXCIsXG59IGFzIGNvbnN0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi91dGlscy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dlZWwvRGVza3RvcC9kZXYvcGVyc29uYWwvdXB0YWIvdXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5cbmltcG9ydCBtYW5pZmVzdCBmcm9tIFwiLi4vLi4vc3JjL21hbmlmZXN0XCI7XG5pbXBvcnQgY29sb3JMb2cgZnJvbSBcIi4uL2xvZ1wiO1xuXG5jb25zdCB7IHJlc29sdmUgfSA9IHBhdGg7XG5cbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCJwdWJsaWNcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VNYW5pZmVzdCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIGJ1aWxkRW5kKCkge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKG91dERpcikpIHtcbiAgICAgICAgZnMubWtkaXJTeW5jKG91dERpcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUob3V0RGlyLCBcIm1hbmlmZXN0Lmpzb25cIik7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3RQYXRoLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMikpO1xuXG4gICAgICBjb2xvckxvZyhgTWFuaWZlc3QgZmlsZSBjb3B5IGNvbXBsZXRlOiAke21hbmlmZXN0UGF0aH1gLCBcInN1Y2Nlc3NcIik7XG4gICAgfSxcbiAgICBuYW1lOiBcIm1ha2UtbWFuaWZlc3RcIixcbiAgfTtcbn1cbiIsICJ7XG4gIFwibmFtZVwiOiBcInVwdGFiXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJVcFRhYlwiLFxuICBcInZlcnNpb25cIjogXCIxLjQuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiV2hhdCdzIFVwVGFiP1wiLFxuICBcImF1dGhvclwiOiBcIkFydGh1ciBHZWVsIDxhZ2VlbEBlbnJpc2UuY29tPlwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwiQlVJTERfVEFSR0VUPWZpcmVmb3ggbm9kZW1vbiAmIGJ1biBsb2FkOmZpcmVmb3hcIixcbiAgICBcImJ1aWxkXCI6IFwiQlVJTERfVEFSR0VUPWNocm9tZSB2aXRlIGJ1aWxkICYmIEJVSUxEX1RBUkdFVD1maXJlZm94IHZpdGUgYnVpbGRcIixcbiAgICBcInppcFwiOiBcImNkIGRpc3QvZmlyZWZveCAmJiB6aXAgLXIgZmlyZWZveC56aXAgLiAmJiBtdiBmaXJlZm94LnppcCAuLi9maXJlZm94LnppcCAmJiBjZCAuLi8uLi8gJiYgY2QgZGlzdC9jaHJvbWl1bSAmJiB6aXAgLXIgY2hyb21pdW0uemlwIC4gJiYgbXYgY2hyb21pdW0uemlwIC4uL2Nocm9taXVtLnppcCAmJiBjZCAuLi8uLi9cIixcbiAgICBcInNoaXBcIjogXCJidW4gcnVuIGJ1aWxkICYmIGJ1biB6aXBcIixcbiAgICBcInRlc3RcIjogXCJ2aXRlc3RcIixcbiAgICBcInRlc3Q6d2F0Y2hcIjogXCJ2aXRlc3QgLS13YXRjaFwiLFxuICAgIFwibGludFwiOiBcImVzbGludCAuL1wiLFxuICAgIFwibGludDpmaXhcIjogXCJlc2xpbnQgLi8gLS1maXhcIixcbiAgICBcImxpbnQ6ZmlyZWZveFwiOiBcIndlYi1leHQgbGludCAtLXNvdXJjZS1kaXIgZGlzdC9maXJlZm94IC0tb3V0cHV0IGpzb24gLS1wcmV0dHkgfCBncmVwIC12ICdBcHBseWluZyBjb25maWcgZmlsZTogLi9wYWNrYWdlLmpzb24nID4gZGlzdC9maXJlZm94LWxpbnQtb3V0cHV0Lmpzb25cIixcbiAgICBcImxvYWQ6ZmlyZWZveFwiOiBcIndlYi1leHQgcnVuIC0tc291cmNlLWRpciBkaXN0L2ZpcmVmb3hcIixcbiAgICBcImNocm9tZTpzdG9yZVwiOiBcImJ1biBkZXYvY29tbWFuZHMvY2hyb21lL21haW4udHNcIixcbiAgICBcImZpcmVmb3g6c3RvcmVcIjogXCJidW4gZGV2L2NvbW1hbmRzL2ZpcmVmb3gvbWFpbi50c1wiXG4gIH0sXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZG5kLWtpdC9jb3JlXCI6IFwiXjYuMy4xXCIsXG4gICAgXCJAZG5kLWtpdC9zb3J0YWJsZVwiOiBcIl4xMC4wLjBcIixcbiAgICBcIkBkbmQta2l0L3V0aWxpdGllc1wiOiBcIl4zLjIuMlwiLFxuICAgIFwiQGhlcm9pY29ucy9yZWFjdFwiOiBcIl4yLjEuNVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRpYWxvZ1wiOiBcIl4xLjAuNVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXN3aXRjaFwiOiBcIl4xLjAuM1wiLFxuICAgIFwiQHNlbnRyeS9icm93c2VyXCI6IFwiXjguMjAuMFwiLFxuICAgIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI6IFwiXjUuNTEuMTRcIixcbiAgICBcImNsc3hcIjogXCJeMi4xLjBcIixcbiAgICBcImRhdGUtZm5zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJkZWVwbWVyZ2VcIjogXCJeNC4zLjFcIixcbiAgICBcIm1vdGlvblwiOiBcIl4xMy4xLjFcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjMuMVwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjMuMVwiLFxuICAgIFwicmVhY3QtaG9vay1mb3JtXCI6IFwiXjcuNTAuMVwiLFxuICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeOS4wLjFcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCI6IFwiXjIuNC4wXCIsXG4gICAgXCJ0YWlsd2luZGNzcy1hbmltYXRlXCI6IFwiXjEuMC43XCIsXG4gICAgXCJ1dWlkXCI6IFwiXjEwLjAuMFwiLFxuICAgIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTIuMFwiLFxuICAgIFwienVzdGFuZFwiOiBcIl40LjUuNFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0YWlsd2luZGNzcy90eXBvZ3JhcGh5XCI6IFwiXjAuNS4xMFwiLFxuICAgIFwiQHRhbnN0YWNrL2VzbGludC1wbHVnaW4tcXVlcnlcIjogXCJeNS4xMi4xXCIsXG4gICAgXCJAdHlwZXMvaW5xdWlyZXJcIjogXCJeOS4wLjdcIixcbiAgICBcIkB0eXBlcy9qc29ud2VidG9rZW5cIjogXCJeOS4wLjVcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjExLjE3XCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMy4zXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjMuMFwiLFxuICAgIFwiQHR5cGVzL3V1aWRcIjogXCJeMTAuMC4wXCIsXG4gICAgXCJAdHlwZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuN1wiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNy4wLjFcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNy4wLjFcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjYuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTdcIixcbiAgICBcImJ1blwiOiBcIl4xLjEuMjBcIixcbiAgICBcImVzbGludFwiOiBcIl44LjU2LjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcbiAgICBcImVzbGludC1pbXBvcnQtcmVzb2x2ZXItYWxpYXNcIjogXCJeMS4xLjJcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjkuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1qc3gtYTExeVwiOiBcIl42LjguMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl41LjUuNlwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjMzLjJcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNC42LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tdGFpbHdpbmRjc3NcIjogXCJeMy4xNC4yXCIsXG4gICAgXCJmcy1leHRyYVwiOiBcIl4xMS4yLjBcIixcbiAgICBcImlucXVpcmVyXCI6IFwiXjkuMi4xNFwiLFxuICAgIFwianNvbndlYnRva2VuXCI6IFwiXjkuMC4yXCIsXG4gICAgXCJub2RlbW9uXCI6IFwiXjMuMS40XCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC40MFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy45LjZcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuNC43XCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNS40XCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMy41XCIsXG4gICAgXCJ2aXRlc3RcIjogXCJeMi4wLjRcIixcbiAgICBcIndlYi1leHRcIjogXCJeOC4yLjBcIlxuICB9XG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9nZWVsL0Rlc2t0b3AvZGV2L3BlcnNvbmFsL3VwdGFiL3NyYy9tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2VlbC9EZXNrdG9wL2Rldi9wZXJzb25hbC91cHRhYi9zcmMvbWFuaWZlc3QudHNcIjsvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cbmltcG9ydCB0eXBlIHsgTWFuaWZlc3QgfSBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5cbmltcG9ydCB7IGJ1aWxkVGFyZ2V0cyB9IGZyb20gXCIuLi9idWlsZFRhcmdldFwiO1xuaW1wb3J0IHBrZyBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCI7XG5cbmNvbnN0IHBhZ2VzID0ge1xuICBiYWNrZ3JvdW5kOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LmpzXCIsXG4gIG5ldzogXCJzcmMvcGFnZXMvbmV3dGFiL2luZGV4Lmh0bWxcIixcbiAgcG9wdXA6IFwic3JjL3BhZ2VzL3BvcHVwL2luZGV4Lmh0bWxcIixcbn07XG5cbmNvbnN0IG1hbmlmZXN0OiBNYW5pZmVzdC5XZWJFeHRlbnNpb25NYW5pZmVzdCA9IHtcbiAgYWN0aW9uOiB7XG4gICAgZGVmYXVsdF9pY29uOiBcImljb24tMzQucG5nXCIsXG4gICAgZGVmYXVsdF9wb3B1cDogcGFnZXMucG9wdXAsXG4gIH0sXG4gIGJhY2tncm91bmQ6XG4gICAgcHJvY2Vzcy5lbnYuQlVJTERfVEFSR0VUID09PSBidWlsZFRhcmdldHMuZmlyZWZveFxuICAgICAgPyB7XG4gICAgICAgICAgcGFnZTogcGFnZXMuYmFja2dyb3VuZC5zcGxpdChcIi5qc1wiKVswXSArIFwiLmh0bWxcIixcbiAgICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgICAgc2VydmljZV93b3JrZXI6IHBhZ2VzLmJhY2tncm91bmQsXG4gICAgICAgICAgdHlwZTogXCJtb2R1bGVcIixcbiAgICAgICAgfSxcbiAgY2hyb21lX3VybF9vdmVycmlkZXM6IHtcbiAgICBuZXd0YWI6IHBhZ2VzLm5ldyxcbiAgfSxcbiAgLi4uKHByb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCA9PT0gYnVpbGRUYXJnZXRzLmZpcmVmb3hcbiAgICA/IHtcbiAgICAgICAgY2hyb21lX3NldHRpbmdzX292ZXJyaWRlczoge1xuICAgICAgICAgIGhvbWVwYWdlOiBwYWdlcy5uZXcsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgOiB7fSksXG4gIGRlc2NyaXB0aW9uOiBcIldoYXQncyBVcFRhYj9cIixcbiAgaWNvbnM6IHtcbiAgICBcIjEyOFwiOiBcImljb24tMTI4LnBuZ1wiLFxuICB9LFxuICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxuICBuYW1lOiBcIlVwVGFiXCIsXG4gIHBlcm1pc3Npb25zOiBbXCJzdG9yYWdlXCIsIFwiZ2VvbG9jYXRpb25cIiwgXCJib29rbWFya3NcIl0sXG4gIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFtcbiAgICB7XG4gICAgICBtYXRjaGVzOiBbXSxcbiAgICAgIHJlc291cmNlczogW1wiaWNvbi0xMjgucG5nXCIsIFwiaWNvbi0zNC5wbmdcIl0sXG4gICAgfSxcbiAgXSxcbiAgLi4uKHByb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCA9PT0gYnVpbGRUYXJnZXRzLmZpcmVmb3hcbiAgICA/IHtcbiAgICAgICAgYnJvd3Nlcl9zcGVjaWZpY19zZXR0aW5nczoge1xuICAgICAgICAgIGdlY2tvOiB7XG4gICAgICAgICAgICBpZDogXCJhZ2VlbEBlbnJpc2UuY29tXCIsXG4gICAgICAgICAgICBzdHJpY3RfbWluX3ZlcnNpb246IFwiMTA5LjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIDoge30pLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLFNBQVMsV0FBQUEsZ0JBQWU7QUFFNVQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9COzs7QUNIOFEsSUFBTSxlQUFlO0FBQUEsRUFDOVQsVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUNYOzs7QUNIMFYsWUFBWSxRQUFRO0FBQzlXLFlBQVksVUFBVTs7O0FDRVAsU0FBUixTQUEwQixTQUFpQixNQUFrQjtBQUNsRSxNQUFJLFFBQWdCLFFBQVEsT0FBTztBQUVu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QUEsRUFDUjtBQUNGOzs7QUozQkEsSUFBTUUsb0NBQW1DO0FBU3pDLElBQU0sT0FBT0MsU0FBUUMsbUNBQVcsS0FBSztBQUNyQyxJQUFNLFdBQVdELFNBQVEsTUFBTSxPQUFPO0FBQ3RDLElBQU0sWUFBWUEsU0FBUSxNQUFNLFFBQVE7QUFDeEMsSUFBTUUsVUFBU0Y7QUFBQSxFQUNiQztBQUFBLEVBQ0EsUUFBUSxJQUFJLGlCQUFpQixhQUFhLFVBQ3RDLGlCQUNBO0FBQ047QUFDQSxJQUFNLFlBQVlELFNBQVFDLG1DQUFXLFFBQVE7QUFFN0MsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsUUFBQUM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLFlBQVlGO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxVQUNBLFFBQVEsSUFBSSxpQkFBaUIsYUFBYSxVQUN0QyxlQUNBO0FBQUEsUUFDTjtBQUFBLFFBQ0EsUUFBUUEsU0FBUSxVQUFVLFVBQVUsWUFBWTtBQUFBLFFBQ2hELE9BQU9BLFNBQVEsVUFBVSxTQUFTLFlBQVk7QUFBQSxRQUM5QyxXQUFXQSxTQUFRLFVBQVUsYUFBYSxZQUFZO0FBQUEsTUFDeEQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQixDQUFDLFVBQVUsYUFBYSxNQUFNLElBQUk7QUFBQSxNQUNwRDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFdBQVcsUUFBUSxJQUFJLFlBQVk7QUFBQSxFQUNyQztBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsaUJBQWlCLENBQUM7QUFBQSxFQUNyRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJmcyIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAicGF0aCIsICJvdXREaXIiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJvdXREaXIiXQp9Cg==
