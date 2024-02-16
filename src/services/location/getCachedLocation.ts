import { storage } from "webextension-polyfill";

import { Location } from "./types";

const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

/**
 * Persists the user's latitude / longitude to speed up performance
 */
export const getCachedLocation = async (): Promise<Location | void> => {
  const { cachedLocation } = await storage.local.get("cachedLocation");

  if (!cachedLocation) {
    return;
  }

  if (Math.abs(Date.now() - cachedLocation.date) < CACHE_DURATION) {
    return {
      latitude: cachedLocation.latitude,
      longitude: cachedLocation.longitude,
    };
  }
};
