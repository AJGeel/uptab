/* Parts of this file run in the browser through page.evaluate. */
/// <reference lib="dom" />
import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join, resolve } from "path";

import {
  type BrowserContext,
  chromium,
  type Page,
  type Worker,
} from "playwright";

import { geocode, LOCATION, TIME_ZONE, weather } from "./fixtures";
import { DIST_DIR, ROOT_DIR } from "../commands/utils";

export const SCREENSHOTS_DIR = resolve(DIST_DIR, "screenshots");
/** Where the framed screenshots go, ready for the stores. */
export const OUTPUT_DIR = resolve(ROOT_DIR, "docs/store-listing/screenshots");
export const EXTENSION_DIR = resolve(SCREENSHOTS_DIR, "extension");
export const PHOTOS_DIR = resolve(SCREENSHOTS_DIR, "photos");

/** The catalogue the build and the photos come from; `.env` can point it to a local uptab-website. */
export const CATALOGUE_URL =
  process.env.VITE_CATALOGUE_URL ??
  "https://uptab.vercel.app/backgrounds/v1/catalogue.json";

/** The browser window the UI is captured in, before it's framed. */
export const VIEWPORT = { width: 1280, height: 640 };

/** Reports what a scene is doing, and fails it if a stage takes too long. */
export type Stage = <T>(
  label: string,
  task: () => Promise<T>,
  timeoutMs?: number,
) => Promise<T>;

/** Rejects with `label` once `ms` have passed, so nothing can wait forever. */
export const withDeadline = <T>(
  task: Promise<T>,
  ms: number,
  label: string,
) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Timed out after ${ms / 1000}s: ${label}`)),
      ms,
    );
  });

  return Promise.race([task, deadline]).finally(() => clearTimeout(timer));
};

/** `fetch` that gives up after `ms`, with the URL in the error. */
export const fetchWithTimeout = async (url: string, ms = 15_000) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(ms) }).catch(
    (error: Error) => {
      throw new Error(`Couldn't load ${url}: ${error.message}`);
    },
  );

  if (!response.ok) {
    throw new Error(`Couldn't load ${url}: HTTP ${response.status}`);
  }

  return response;
};

type Catalogue = {
  images: { id: string; sources: { width: number; url: string }[] }[];
};

export const getCatalogue = async () =>
  (await (await fetchWithTimeout(CATALOGUE_URL)).json()) as Catalogue;

/** A fresh browser profile with the built extension, and its background worker. */
export const launchExtension = async () => {
  const profile = await mkdtemp(join(tmpdir(), "uptab-shots-"));
  const context = await chromium.launchPersistentContext(profile, {
    // Full Chromium: the headless shell can't load extensions.
    channel: "chromium",
    headless: true,
    args: [
      `--disable-extensions-except=${EXTENSION_DIR}`,
      `--load-extension=${EXTENSION_DIR}`,
    ],
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    geolocation: LOCATION,
    permissions: ["geolocation"],
    timezoneId: TIME_ZONE,
    locale: "en-GB",
  });
  const worker =
    context.serviceWorkers()[0] ??
    (await context.waitForEvent("serviceworker", { timeout: 15_000 }));
  const newTabUrl = `chrome-extension://${new URL(worker.url()).host}/src/pages/newtab/index.html`;

  return { context, worker, newTabUrl };
};

const FAVICONS_DIR = resolve(SCREENSHOTS_DIR, "favicons");

/**
 * Favicons come from live services that are sometimes slow, which makes a
 * bookmark fall back to another icon. Each one is saved on first use and
 * served from disk after that, so every run shows the same icons.
 */
export const routeFavicons = async (context: BrowserContext) => {
  for (const pattern of [
    "https://www.google.com/s2/favicons**",
    "https://icons.duckduckgo.com/**",
  ]) {
    await context.route(pattern, async (route) => {
      const key = Bun.hash(route.request().url()).toString(16);
      const file = Bun.file(resolve(FAVICONS_DIR, `${key}.json`));

      if (await file.exists()) {
        const { status, contentType, body } = await file.json();

        return route.fulfill({
          status,
          contentType,
          body: Buffer.from(body, "base64"),
        });
      }

      const response = await route.fetch({ timeout: 10_000 });

      await Bun.write(
        file,
        JSON.stringify({
          status: response.status(),
          contentType: response.headers()["content-type"],
          body: (await response.body()).toString("base64"),
        }),
      );

      return route.fulfill({ response });
    });
  }
};

/** The same weather and location in every run, without network calls. */
export const routeFixtures = async (context: BrowserContext) => {
  await context.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({ json: weather() }),
  );
  await context.route("https://nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ json: geocode() }),
  );
};

/** The extension APIs used in the background worker. */
type ExtensionApi = {
  storage: Record<
    "local" | "sync",
    {
      set: (items: object) => Promise<void>;
      remove: (key: string) => Promise<void>;
    }
  >;
  bookmarks: {
    create: (bookmark: {
      parentId: string;
      title: string;
      url: string;
    }) => Promise<unknown>;
  };
};

const SHORTLINKS = [
  { title: "GitHub", subtitle: "Code", url: "https://github.com" },
  { title: "Figma", subtitle: "Design", url: "https://figma.com" },
  { title: "Gmail", subtitle: "Mail", url: "https://mail.google.com" },
  { title: "Calendar", subtitle: "Today", url: "https://calendar.google.com" },
  { title: "Spotify", subtitle: "Music", url: "https://open.spotify.com" },
  { title: "Notion", subtitle: "Notes", url: "https://notion.so" },
];

const BOOKMARKS = [
  { title: "Hacker News", url: "https://news.ycombinator.com" },
  { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
  { title: "Tailwind CSS", url: "https://tailwindcss.com" },
  { title: "React", url: "https://react.dev" },
  { title: "The Verge", url: "https://www.theverge.com" },
  { title: "Wikipedia", url: "https://en.wikipedia.org" },
  { title: "YouTube", url: "https://www.youtube.com" },
  { title: "Booking.com", url: "https://www.booking.com" },
];

/** Settings, today's photo, shortlinks and bookmarks, before the new tab opens. */
export const seedStorage = (
  worker: Worker,
  { date, photo, themes }: { date: string; photo: string; themes: string[] },
) =>
  worker.evaluate(
    async ({ date, photo, themes, shortlinks, bookmarks }) => {
      const { chrome } = globalThis as unknown as { chrome: ExtensionApi };

      await chrome.storage.sync.set({
        backgroundSettings: { themes },
        dailyBackground: { date, imageId: photo },
      });
      await chrome.storage.local.set({
        shortlinks: shortlinks.map((link) => ({
          ...link,
          id: crypto.randomUUID(),
        })),
      });
      // No "What's new" notice in the sidebar.
      await chrome.storage.local.remove("newUpdate");

      // A few milliseconds apart, so sorting by date gives the same order every run.
      for (const bookmark of bookmarks) {
        await chrome.bookmarks.create({ parentId: "1", ...bookmark });
        await new Promise((done) => setTimeout(done, 5));
      }
    },
    { date, photo, themes, shortlinks: SHORTLINKS, bookmarks: BOOKMARKS },
  );

/**
 * Waits for fonts and every image on the page, including CSS backgrounds.
 * An image that hasn't loaded after `ms` fails the scene, with its URL.
 */
export const waitForImages = async (page: Page, ms = 20_000) => {
  const stalled = await page.evaluate(async (ms) => {
    await document.fonts.ready;

    const urls = [...document.querySelectorAll<HTMLElement>("*")]
      .flatMap((element) => [
        ...getComputedStyle(element).backgroundImage.matchAll(
          /url\("(.+?)"\)/g,
        ),
      ])
      .map((match) => match[1]);
    const images = [...document.images].map((image) => image.src);
    const results = await Promise.all(
      [...new Set([...urls, ...images])].map(
        (src) =>
          new Promise<string | null>((done) => {
            const image = new Image();
            const timer = setTimeout(() => done(src), ms);

            image.onload = image.onerror = () => {
              clearTimeout(timer);
              done(null);
            };
            image.src = src;
          }),
      ),
    );

    return results.filter((src) => src !== null);
  }, ms);

  if (stalled.length > 0) {
    throw new Error(
      `Images still loading after ${ms / 1000}s: ${stalled.join(", ")}`,
    );
  }
};

export const photoFile = (id: string) => resolve(PHOTOS_DIR, `${id}.webp`);

/** Adds photos from setup as local photos, through the real file picker input. */
export const addLocalPhotos = async (page: Page, ids: string[]) => {
  for (const id of ids) {
    if (!(await Bun.file(photoFile(id)).exists())) {
      throw new Error(`Photo "${id}" is missing. Run bun store:shots:setup.`);
    }
  }

  await page
    .locator("input[type=file][multiple]")
    .setInputFiles(ids.map(photoFile));
  await page.getByText(/^Added \d+ photos/).waitFor({ timeout: 60_000 });
};
