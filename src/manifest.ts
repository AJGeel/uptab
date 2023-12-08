import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";
import { TARGETS, buildTarget } from "../buildTarget";

const pages = {
  new: "src/pages/newtab/index.html",
  popup: "src/pages/popup/index.html",
  background: "src/pages/background/index.js",
};

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: "UpTab",
  description: "What's UpTab?",
  version: pkg.version,
  permissions: ["storage", "geolocation", "bookmarks", "commands"],
  background:
    buildTarget === TARGETS.FIREFOX
      ? {
          page: pages.background.split(".js")[0] + ".html",
        }
      : {
          service_worker: pages.background,
          type: "module",
        },
  action: {
    default_popup: pages.popup,
    default_icon: "icon-34.png",
  },
  chrome_url_overrides: {
    newtab: pages.new,
  },
  ...(buildTarget === TARGETS.FIREFOX
    ? {
        chrome_settings_overrides: {
          homepage: pages.new,
        },
      }
    : {}),
  commands: {
    _execute_action: {
      suggested_key: {
        default: "Ctrl+U",
        mac: "Command+U",
      },
    },
  },
  icons: {
    "128": "icon-128.png",
  },
  web_accessible_resources: [
    {
      resources: ["icon-128.png", "icon-34.png"],
      matches: [],
    },
  ],
  ...(buildTarget === TARGETS.FIREFOX
    ? {
        browser_specific_settings: {
          gecko: {
            id: "916b0c75-3123-4626-965d-b7dc89df71fa",
            strict_min_version: "109.0",
          },
        },
      }
    : {}),
};

export default manifest;
