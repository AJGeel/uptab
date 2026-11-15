import { storage } from "webextension-polyfill";

import { Area, Location } from "./types";

type CachedArea = { address: Area };

/**
 * Checks a previous reverse geocoding result for lat/long to minimise API calls
 */
export const getCachedReverseGeocoding = async ({
  latitude,
  longitude,
}: Location): Promise<CachedArea | void> => {
  try {
    const { cachedReverseGeocoding } = (await storage.local.get(
      "cachedReverseGeocoding",
    )) as {
      cachedReverseGeocoding?: CachedArea & { _input?: Location };
    };

    // Entries cached before errors were rejected may lack an address.
    if (!cachedReverseGeocoding?.address) {
      return;
    }

    if (
      cachedReverseGeocoding._input?.latitude !== latitude ||
      cachedReverseGeocoding._input?.longitude !== longitude
    ) {
      return;
    }

    return cachedReverseGeocoding;
  } catch (error) {
    throw new Error("Unable to check cached reverse geocoding.", {
      cause: error,
    });
  }
};
