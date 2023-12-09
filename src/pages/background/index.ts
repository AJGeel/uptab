import { runtime, tabs } from "webextension-polyfill";

runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    // Runs when the extension is first installed: opens a page within the extension.
    case "install":
      runtime.setUninstallURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

      return tabs.create({
        url: runtime.getURL("/src/pages/newtab/index.html"),
      });

    // Runs when the extension is updated. Currently unused.
    case "update":
      return console.log("Extension has been updated!");

    default:
      return "";
  }
});
