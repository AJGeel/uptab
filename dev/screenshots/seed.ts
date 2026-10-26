/* Parts of this file run in the browser through page.evaluate. */
/// <reference lib="dom" />
import { resolve } from "path";

import { DIST_DIR } from "@ajgeel/ext-store/utils";
import type { BrowserContext, Page, Worker } from "playwright";

import { geocode, weather } from "./fixtures";

export const SCREENSHOTS_DIR = resolve(DIST_DIR, "screenshots");
export const EXTENSION_DIR = resolve(SCREENSHOTS_DIR, "extension");
export const PHOTOS_DIR = resolve(SCREENSHOTS_DIR, "photos");

/** The catalogue the build and the photos come from; `.env` can point it to a local uptab-website. */
export const CATALOGUE_URL =
  process.env.VITE_CATALOGUE_URL ??
  "https://uptab.vercel.app/backgrounds/v1/catalogue.json";

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

export const photoFile = (id: string) => resolve(PHOTOS_DIR, `${id}.webp`);

/** The largest catalogue size of a scene's photo, shown behind the framed screenshot. */
export const backdropFile = (id: string) =>
  resolve(PHOTOS_DIR, `${id}.backdrop.webp`);

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
