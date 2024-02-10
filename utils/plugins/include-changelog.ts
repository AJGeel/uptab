import * as fs from "fs";
import * as path from "path";

import { PluginOption } from "vite";

import colorLog from "../log";

const { resolve } = path;

const outDir = resolve(__dirname, "..", "..", "public");
const changelogPath = resolve(__dirname, "..", "..", "CHANGELOG.md");

export default function includeChangelog(): PluginOption {
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
    name: "include-changelog",
  };
}
