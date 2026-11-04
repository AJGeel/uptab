import { defineConfig } from "@ajgeel/ext-store";

import { findLocalUrlInBuild } from "./dev/commands/localUrls";
import { screenshots } from "./dev/screenshots/config";

export default defineConfig({
  name: "UpTab",
  screenshots,
  checkBuild: ({ dir }) => {
    // A development setting, such as a local catalogue, must never ship.
    const localUrl = findLocalUrlInBuild(dir);

    if (localUrl) {
      throw new Error(
        `Build links to localhost in ${localUrl.file}: "...${localUrl.context}...". Check your .env.`,
      );
    }
  },
});
