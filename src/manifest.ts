import type { Manifest } from "webextension-polyfill";

import { buildTargets } from "../buildTarget.ts";
import pkg from "../package.json" with { type: "json" };

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
    process.env.BUILD_TARGET === buildTargets.firefox
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
  ...(process.env.BUILD_TARGET === buildTargets.firefox
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
  permissions: [
    "storage",
    "unlimitedStorage",
    "bookmarks",
    ...(process.env.BUILD_TARGET === buildTargets.firefox ? [] : ["favicon"]),
  ],
  optional_permissions: [
    "history", // Asked for when first sorting bookmarks by visits
    ...(process.env.BUILD_TARGET === buildTargets.firefox
      ? ["geolocation" as const] // Asked for when pressing "use my location"
      : []),
  ],
  version: pkg.version,
  web_accessible_resources: [
    {
      matches: [],
      resources: ["icon-128.png", "icon-34.png"],
    },
  ],
  ...(process.env.BUILD_TARGET === buildTargets.firefox
    ? {
        browser_specific_settings: {
          gecko: {
            id: "ageel@enrise.com",
            strict_min_version: "109.0",
            // Nothing is collected unless someone opts in. Firefox 140+ shows these.
            data_collection_permissions: {
              required: ["none"],
              optional: [
                "locationInfo",
                "searchTerms",
                "technicalAndInteraction",
              ],
            },
          },
        },
      }
    : {}),
};

export default manifest;
