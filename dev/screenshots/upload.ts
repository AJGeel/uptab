import { resolve } from "path";

import { scenes } from "./scenes";
import { OUTPUT_DIR } from "./seed";
import {
  getFirefoxPreviews,
  replaceFirefoxPreviews,
} from "../commands/firefox";
import { confirmOrExit, header, p, pc, step } from "../commands/ui";
import { read, requireEnv } from "../commands/utils";

/**
 * Replaces the Firefox listing's screenshots through AMO's API. Chrome's API
 * can't change listing images, so it opens the dashboard and the folder instead.
 */
export const upload = async () => {
  header("Store screenshots: upload");

  const isDryRun = process.argv.includes("--dry-run");
  const screenshots = scenes.map((scene, index) => ({
    path: resolve(OUTPUT_DIR, `${index + 1}.jpg`),
    caption: scene.headline.join(" "),
  }));

  for (const { path } of screenshots) {
    if (!(await Bun.file(path).exists())) {
      throw new Error(
        `${path} is missing. Run ${pc.bold("bun store:shots")} first.`,
      );
    }
  }

  const current = await step(
    "Loading the Firefox listing",
    getFirefoxPreviews,
    (previews) => `Firefox listing has ${previews.length} screenshots`,
  );

  p.note(
    screenshots
      .map(({ caption }, index) => `${index + 1}.jpg  ${pc.dim(caption)}`)
      .join("\n"),
    `Replaces Firefox's ${current.length} screenshots with`,
  );

  if (isDryRun) {
    p.outro("Dry run: nothing was uploaded.");
    return;
  }

  await confirmOrExit("Replace the screenshots on the live Firefox listing?");
  await step(
    "Updating the Firefox listing",
    (update) => replaceFirefoxPreviews(screenshots, update),
    `Firefox listing has the ${screenshots.length} new screenshots`,
  );

  // Chrome's API can't change listing images, so open the dashboard and the folder instead.
  const env = requireEnv("CHROME_PUBLISHER_ID", "CHROME_EXTENSION_ID");
  const dashboard = `https://chrome.google.com/webstore/devconsole/${env.CHROME_PUBLISHER_ID}/${env.CHROME_EXTENSION_ID}/edit`;

  await read(["open", dashboard]);
  await read(["open", OUTPUT_DIR]);
  p.log.info(
    [
      "Chrome: in the dashboard that just opened, go to Store listing > Screenshots,",
      `remove the old ones, drag in 1.jpg to ${screenshots.length}.jpg from the folder that opened,`,
      "and save the draft. Listing changes go through review with the next submission.",
    ].join("\n"),
  );
  p.outro("Done");
};
