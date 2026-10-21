/* Parts of this file run in the browser through page.evaluate. */
/// <reference lib="dom" />
/**
 * Renders the store listing screenshots from the built extension.
 *
 *   bun store:shots:setup          check the catalogue, build, download photos
 *   bun store:shots                capture and frame every scene
 *   bun store:shots --only picker  one scene (see dev/screenshots/scenes.ts)
 *   bun store:shots:upload         replace the Firefox screenshots, then open
 *                                  the Chrome dashboard to upload them by hand
 *                                  (--dry-run to only show the plan, --yes to skip the prompt)
 */
import { mkdir } from "fs/promises";
import { resolve } from "path";
import { pathToFileURL } from "url";

import { chromium } from "playwright";

import { header, p, pc, runCli, runTask, step } from "./ui";
import { ROOT_DIR } from "./utils";
import { NOW, TODAY } from "../screenshots/fixtures";
import {
  LOCAL_PHOTOS,
  type Scene,
  scenePhotos,
  scenes,
} from "../screenshots/scenes";
import {
  CATALOGUE_URL,
  EXTENSION_DIR,
  fetchWithTimeout,
  getCatalogue,
  launchExtension,
  photoFile,
  PHOTOS_DIR,
  routeFavicons,
  routeFixtures,
  OUTPUT_DIR,
  SCREENSHOTS_DIR,
  seedStorage,
  type Stage,
  VIEWPORT,
  waitForImages,
  withDeadline,
} from "../screenshots/seed";
import { upload } from "../screenshots/upload";

const RAW_DIR = resolve(SCREENSHOTS_DIR, "raw");
const rawFile = (scene: Scene) =>
  resolve(RAW_DIR, `${scenes.indexOf(scene) + 1}-${scene.id}.png`);
const FRAME_URL = pathToFileURL(
  resolve(ROOT_DIR, "dev/screenshots/frame.html"),
).href;
/** Most stages take a second or two; this only catches real stalls. */
const STAGE_TIMEOUT = 30_000;

/**
 * Runs named stages inside a spinner, showing how long the current one has
 * been running, so a stall is visible. Each stage fails after its timeout.
 */
const createStage =
  (scope: string, update: (message: string) => void): Stage =>
  async (label, task, timeoutMs = STAGE_TIMEOUT) => {
    const name = `${scope} · ${label}`;
    const started = Date.now();
    const show = () =>
      update(
        `${name} ${pc.dim(`${Math.floor((Date.now() - started) / 1000)}s`)}`,
      );
    const ticker = setInterval(show, 1000);

    show();

    // Without a terminal the spinner isn't shown, so log each stage instead.
    if (!process.stdout.isTTY) {
      p.log.message(pc.dim(name));
    }

    try {
      return await withDeadline(task(), timeoutMs, name);
    } finally {
      clearInterval(ticker);
    }
  };

const setup = async () => {
  header("Store screenshots: setup");

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
    "Downloading photos for My photos",
    async (update) => {
      const catalogue = await getCatalogue();
      const stage = createStage("photos", update);

      await mkdir(PHOTOS_DIR, { recursive: true });

      // One at a time: parallel downloads from the local dev server can stall.
      for (const [index, id] of LOCAL_PHOTOS.entries()) {
        if (await Bun.file(photoFile(id)).exists()) {
          continue;
        }

        const [{ url }] = catalogue.images.find(
          (image) => image.id === id,
        )!.sources;

        await stage(
          `downloading ${index + 1}/${LOCAL_PHOTOS.length}`,
          async () => {
            const response = await fetchWithTimeout(url, 30_000);

            await Bun.write(photoFile(id), await response.arrayBuffer());
          },
        );
      }
    },
    `${LOCAL_PHOTOS.length} photos ready`,
  );

  p.outro(`Ready. Run ${pc.bold("bun store:shots")} next.`);
};

const capture = async (scene: Scene, stage: Stage, file: string) => {
  const { context, worker, newTabUrl } = await stage(
    "launching Chromium",
    launchExtension,
  );

  try {
    await stage("seeding storage", async () => {
      await routeFixtures(context);
      await routeFavicons(context);
      await seedStorage(worker, {
        date: TODAY,
        photo: scene.photo,
        themes: scene.themes ?? [],
      });
    });

    const page = await context.newPage();

    // Starts at NOW and keeps running, so timers work and photos added in a row get their own time.
    await page.clock.install({ time: NOW });
    await stage("opening a new tab", () => page.goto(newTabUrl));
    await stage("waiting for the weather", () =>
      page.getByRole("button", { name: /°C/ }).last().waitFor(),
    );
    await stage("loading the photo", () => waitForImages(page));
    await scene.setup?.(page, stage);

    await stage("settling", async () => {
      // Away from anything hoverable, after the hotkey indicator has faded.
      await page.mouse.move(VIEWPORT.width - 1, VIEWPORT.height / 2);
      await page.evaluate(() =>
        (document.activeElement as HTMLElement | null)?.blur(),
      );
      await page.waitForTimeout(1200);
    });
    await stage("capturing", () => page.screenshot({ path: file }));
  } finally {
    await withDeadline(context.close(), 10_000, "closing Chromium").catch(
      () => {},
    );
  }
};

const frame = async (scenesToFrame: Scene[], stage: Stage) => {
  const catalogue = await stage("loading the catalogue", getCatalogue);
  const browser = await stage("launching Chromium", () => chromium.launch());

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });

    for (const scene of scenesToFrame) {
      const number = scenes.indexOf(scene) + 1;
      const photo = catalogue.images.find((image) => image.id === scene.photo);

      await stage(`framing ${scene.id}`, async () => {
        await page.goto(FRAME_URL);
        await page.evaluate(
          (data) =>
            (
              window as unknown as {
                render: (data: unknown) => Promise<unknown>;
              }
            ).render(data),
          {
            headline: scene.headline,
            // File URLs, not data URLs: a multi-megabyte string can crash the page.
            screen: pathToFileURL(rawFile(scene)).href,
            photo: photo?.sources.at(-1)?.url,
          },
        );
        await page.screenshot({
          path: resolve(OUTPUT_DIR, `${number}.jpg`),
          type: "jpeg",
          quality: 90,
        });
      });
    }
  } finally {
    // A crashed browser never finishes closing.
    await withDeadline(browser.close(), 10_000, "closing Chromium").catch(
      () => {},
    );
  }
};

const shots = async () => {
  header("Store screenshots");

  const only = process.argv[process.argv.indexOf("--only") + 1];
  const selected = process.argv.includes("--only")
    ? scenes.filter((scene) => scene.id === only)
    : scenes;

  if (selected.length === 0) {
    throw new Error(
      `No scene "${only}". Scenes: ${scenes.map((scene) => scene.id).join(", ")}.`,
    );
  }

  if (!(await Bun.file(resolve(EXTENSION_DIR, "manifest.json")).exists())) {
    throw new Error(
      `No build yet. Run ${pc.bold("bun store:shots:setup")} first.`,
    );
  }

  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const scene of selected) {
    await step(
      `Capturing ${scene.id}`,
      (update) => capture(scene, createStage(scene.id, update), rawFile(scene)),
      `Captured ${scene.id}`,
    );
  }

  await step(
    "Framing",
    (update) => frame(selected, createStage("frame", update)),
    "Framed",
  );

  p.outro(
    `${selected.length} screenshots in ${pc.dim("docs/store-listing/screenshots/")}`,
  );
};

const COMMANDS: Record<string, () => Promise<void>> = { setup, upload };

runCli(COMMANDS[process.argv[2]] ?? shots);
