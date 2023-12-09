import { storage } from "webextension-polyfill";
import { Location } from "./types";

const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

/**
 * Persists the user's lat/long for 20 minutes to speed up performance
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
