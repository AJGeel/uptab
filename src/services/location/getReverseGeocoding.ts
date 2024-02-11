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
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );

  const data = (await res.json()) as GeocodeResponse;

  if (!data) {
    return { city: "Unknown location" };
  }

  storage.local.set({
    cachedReverseGeocoding: {
      _input: {
        longitude,
        latitude,
      },
      ...data,
    },
  });

  return data.address as Area;
};
