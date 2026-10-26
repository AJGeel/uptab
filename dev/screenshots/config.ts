import { mkdir } from "fs/promises";

import type { ExtStoreConfig } from "@ajgeel/ext-store";
import { type Stage, waitForImages } from "@ajgeel/ext-store/screenshots";
import { pc, runTask, step } from "@ajgeel/ext-store/ui";

import { LOCATION, NOW, TIME_ZONE, TODAY } from "./fixtures";
import { LOCAL_PHOTOS, scenePhotos, scenes } from "./scenes";
import {
  backdropFile,
  CATALOGUE_URL,
  EXTENSION_DIR,
  fetchWithTimeout,
  getCatalogue,
  photoFile,
  PHOTOS_DIR,
  routeFavicons,
  routeFixtures,
  seedStorage,
} from "./seed";

type Screenshots = NonNullable<ExtStoreConfig["screenshots"]>;

/** Checks the catalogue, builds the extension and downloads the photos. */
const setup: Screenshots["setup"] = async () => {
  await step(
    `Checking the catalogue at ${pc.dim(CATALOGUE_URL)}`,
    async () => {
      const catalogue = await getCatalogue().catch((error: Error) => {
        throw new Error(
          `${error.message}. Is the website running? (VITE_CATALOGUE_URL in .env)`,
        );
      });
      const missing = scenePhotos().filter(
        (id) => !catalogue.images.some((image) => image.id === id),
      );

      if (missing.length > 0) {
        throw new Error(
          `Not in the catalogue: ${missing.join(", ")}. Update dev/screenshots/scenes.ts.`,
        );
      }
    },
    "Catalogue has every photo the scenes use",
  );

  // Its own folder, so a release build in dist/chromium is never replaced.
  await runTask(
    "Building the Chrome extension",
    ["bunx", "vite", "build", "--outDir", EXTENSION_DIR, "--emptyOutDir"],
    {
      BUILD_TARGET: "chrome",
      __DEV__: "true",
      VITE_CATALOGUE_URL: CATALOGUE_URL,
    },
  );

  await step(
    "Downloading photos",
    async (update) => {
      const catalogue = await getCatalogue();
      const downloads = [
        // My photos: the first size, as the extension stores it.
        ...LOCAL_PHOTOS.map((id) => ({ id, file: photoFile(id), size: 0 })),
        // Backdrops: the largest size.
        ...scenes.map(({ photo }) => ({
          id: photo,
          file: backdropFile(photo),
          size: -1,
        })),
      ];

      await mkdir(PHOTOS_DIR, { recursive: true });

      // One at a time: parallel downloads from the local dev server can stall.
      for (const [index, { id, file, size }] of downloads.entries()) {
        if (await Bun.file(file).exists()) {
          continue;
        }

        update(`downloading ${index + 1}/${downloads.length}`);

        const { url } = catalogue.images
          .find((image) => image.id === id)!
          .sources.at(size)!;
        const response = await fetchWithTimeout(url, 30_000);

        await Bun.write(file, await response.arrayBuffer());
      }
    },
    "Photos ready",
  );
};

/** Waits for the new tab to show its weather, then for its photo. */
const ready = async (
  page: Parameters<NonNullable<Screenshots["ready"]>>[0],
  stage: Stage,
) => {
  await stage("waiting for the weather", () =>
    page.locator("[data-forecast]").last().waitFor(),
  );
  await stage("loading the photo", () => waitForImages(page));
};

export const screenshots: Screenshots = {
  extensionDir: EXTENSION_DIR,
  setup,
  ready,
  now: NOW,
  locale: "en-GB",
  timezoneId: TIME_ZONE,
  geolocation: LOCATION,
  frame: { template: "dev/screenshots/frame.html" },
  // The same weather, location and favicons in every run, without network calls.
  prepare: async ({ context }) => {
    await routeFixtures(context);
    await routeFavicons(context);
  },
  scenes: scenes.map(({ id, headline, photo, themes, setup }) => ({
    id,
    headline,
    backdrop: backdropFile(photo),
    prepare: ({ worker }) =>
      seedStorage(worker, { date: TODAY, photo, themes: themes ?? [] }),
    setup,
  })),
};
