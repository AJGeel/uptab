/* eslint-disable camelcase */
import type { Manifest } from "webextension-polyfill";

import { buildTargets, buildTarget } from "../buildTarget";
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
    buildTarget === buildTargets.firefox
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
  ...(buildTarget === buildTargets.firefox
    ? {
        chrome_settings_overrides: {
          homepage: pages.new,
        },
      }
    : {}),
  description: "What's UpTab?",
  icons: {
    "128": "icon-128.png",
  },
  manifest_version: 3,
  name: "UpTab",
  permissions: ["storage", "geolocation", "bookmarks"],
  version: pkg.version,
  web_accessible_resources: [
    {
      matches: [],
      resources: ["icon-128.png", "icon-34.png"],
    },
  ],
  ...(buildTarget === buildTargets.firefox
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
