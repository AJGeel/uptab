import { storage } from "webextension-polyfill";

import { getCachedReverseGeocoding } from "./getCachedReverseGeocoding";
import { Area, GeocodeResponse, Location } from "./types";

export const getReverseGeocoding = async ({
  latitude,
  longitude,
}: Location): Promise<Area> => {
  const cachedReverseGeocoding = await getCachedReverseGeocoding({
    latitude,
    longitude,
  });

  if (cachedReverseGeocoding) {
    return cachedReverseGeocoding.address;
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  );

  if (!res.ok) {
    throw new Error("Failed to reverse geocode the location.");
  }

  const data = (await res.json()) as Partial<GeocodeResponse>;

  // Nominatim reports some failures, like coordinates at sea, as a 200.
  if (!data.address) {
    throw new Error("No address found for the location.");
  }

  await storage.local.set({
    cachedReverseGeocoding: {
      _input: {
        longitude,
        latitude,
      },
      ...data,
    },
  });

  return data.address;
};
