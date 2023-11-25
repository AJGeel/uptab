import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";
import { TARGETS, buildTarget } from "./config/buildTarget";

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: "UpTab",
  description: "What's UpTab?",
  version: pkg.version,
  permissions: ["storage"],
  background:
    buildTarget === TARGETS.FIREFOX
      ? {
          page: "src/pages/background/index.html",
        }
      : {
          service_worker: "src/pages/background/index.js",
          type: "module",
        },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  chrome_url_overrides: {
    newtab: "src/pages/newtab/index.html",
  },
  ...(buildTarget === TARGETS.FIREFOX
    ? {
        chrome_settings_overrides: {
          homepage: "src/pages/newtab/index.html",
        },
      }
    : {}),
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
