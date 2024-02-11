import { storage } from "webextension-polyfill";

import { GeocodeResponse, Location } from "./types";

/**
 * Checks a previous reverse geocoding result for lat/long to minimise API calls
 */
export const getCachedReverseGeocoding = async ({
  latitude,
  longitude,
}: Location): Promise<GeocodeResponse | void> => {
  try {
    const { cachedReverseGeocoding } = await storage.local.get(
      "cachedReverseGeocoding"
    );

    if (!cachedReverseGeocoding) {
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
    throw new Error("Unable to check cached reverse geocoding.");
  }
};
