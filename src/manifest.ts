/* eslint-disable camelcase */
import type { Manifest } from "webextension-polyfill";

import { TARGETS, buildTarget } from "../buildTarget";
import pkg from "../package.json";

const pages = {
  background: "src/pages/background/index.js",
  new: "src/pages/newtab/index.html",
  popup: "src/pages/popup/index.html",
};

const manifest: Manifest.WebExtensionManifest = {
  action: {
    default_icon: "icon-34.png",
    default_popup: pages.popup,
  },
  background:
    buildTarget === TARGETS.FIREFOX
      ? {
          page: pages.background.split(".js")[0] + ".html",
        }
      : {
          service_worker: pages.background,
          type: "module",
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
  description: "What's UpTab?",
  icons: {
    "128": "icon-128.png",
  },
  manifest_version: 3,
  name: "UpTab",
  permissions: ["storage", "geolocation", "bookmarks", "commands"],
  version: pkg.version,
  web_accessible_resources: [
    {
      matches: [],
      resources: ["icon-128.png", "icon-34.png"],
    },
  ],
  ...(buildTarget === TARGETS.FIREFOX
    ? {
        browser_specific_settings: {
          gecko: {
            id: "ageel@enrise.com",
            strict_min_version: "109.0",
          },
        },
      }
    : {}),
};

export default manifest;
