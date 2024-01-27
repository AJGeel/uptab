import { Command, runStoreScript } from "../_utils/runStoreScript";

const firefoxCommands: Command[] = [
  {
    description: "Update your extension in the Firefox Add-Ons Store",
    filename: "firefox/updatePackage.ts",
    name: "Update",
  },
  {
    description: "Check the status in the Firefox Add-Ons Store",
    filename: "firefox/checkStatus.ts",
    name: "Status",
  },
  {
    description: "Publish your extension in the Firefox Add-Ons Store",
    filename: "firefox/publish.ts",
    name: "Publish",
  },
];

runStoreScript(firefoxCommands);
