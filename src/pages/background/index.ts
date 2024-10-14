import { runtime, tabs } from "webextension-polyfill";

import { setUpdateNotification } from "@/src/services/updateNotification/setUpdateNotification";

runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    // Runs when the extension is first installed: opens a page within the extension.
    case "install":
      // ( ͡° ͜ʖ ͡°)
      runtime.setUninstallURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

      tabs.create({
        url: runtime.getURL("/src/pages/newtab/index.html"),
      });
      break;

    case "update":
      setUpdateNotification(true);
      break;

    default:
      break;
  }
});
