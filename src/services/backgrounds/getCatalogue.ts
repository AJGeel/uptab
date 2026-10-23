import { storage } from "webextension-polyfill";

import { CATALOGUE_URL } from "./catalogueUrl";
import { parseCatalogue } from "./parseCatalogue";
import { Catalogue } from "./types";

const STORAGE_KEY = "backgroundCatalogue";
const TIMEOUT_MS = 5000;

/** The last catalogue that was fetched successfully, if any. */
export const getSavedCatalogue = async (): Promise<Catalogue | null> => {
  const { [STORAGE_KEY]: saved } = await storage.local.get(STORAGE_KEY);

  return parseCatalogue(saved) ?? null;
};

/**
 * Fetches the catalogue and saves it for next time. Null when offline, when
 * the site is down, or for an unsupported version. The browser's HTTP cache
 * must revalidate (a cheap 304 at most): the site allows caching it for an
 * hour, so a plain fetch could hand back, and then save, a copy that still
 * lists removed themes. `reload` skips the cache entirely, e.g. after an image
 * URL stopped working.
 */
export const fetchCatalogue = async ({
  reload = false,
} = {}): Promise<Catalogue | null> => {
  try {
    const response = await fetch(CATALOGUE_URL, {
      cache: reload ? "reload" : "no-cache",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.ok) {
      const raw: unknown = await response.json();
      const catalogue = parseCatalogue(raw);

      if (catalogue) {
        // Saved as received, so a newer UpTab can read fields this one drops.
        await storage.local.set({ [STORAGE_KEY]: raw });

        return catalogue;
      }
    }
  } catch {
    // Offline, timed out or not JSON.
  }

  return null;
};

/** The fetched catalogue, or the saved copy if fetching fails. */
export const getCatalogue = async (options?: { reload?: boolean }) =>
  (await fetchCatalogue(options)) ?? getSavedCatalogue();
