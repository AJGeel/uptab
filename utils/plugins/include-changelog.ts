import * as fs from "fs";
import * as path from "path";

import { PluginOption } from "vite";

import colorLog from "../log.ts";

const { resolve } = path;

const outDir = resolve(import.meta.dirname, "..", "..", "public");
const changelogPath = resolve(import.meta.dirname, "..", "..", "CHANGELOG.md");

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
