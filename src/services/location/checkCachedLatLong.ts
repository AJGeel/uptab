import { storage } from "webextension-polyfill";
import { Location } from "./types";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Persists the user's lat/long for 5 minutes to speed up performance
 */
export const checkCachedLatLong = async (): Promise<Location | void> => {
  const { cachedLocation } = await storage.local.get("cachedLocation");

  if (Math.abs(Date.now() - cachedLocation.date) < CACHE_DURATION) {
    return {
      latitude: cachedLocation.latitude,
      longitude: cachedLocation.longitude,
    };
  }
};
