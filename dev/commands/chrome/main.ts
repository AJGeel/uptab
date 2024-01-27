import { Command, runStoreScript } from "../_utils/runStoreScript";

const chromeCommands: Command[] = [
  {
    description: "Update your extension in the Chrome Web Store",
    filename: "chrome/updatePackage.ts",
    name: "Update",
  },
  {
    description: "Check the status in the Chrome Web Store",
    filename: "chrome/checkStatus.ts",
    name: "Status",
  },
  {
    description: "Initialize your extension in the Chrome Web Store",
    filename: "chrome/initPackage.ts",
    name: "Init",
  },
  {
    description: "Publish your extension in the Chrome Web Store",
    filename: "chrome/publish.ts",
    name: "Publish",
  },
];

runStoreScript(chromeCommands);
