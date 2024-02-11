import { storage } from "webextension-polyfill";

import { getCachedLocation } from "./getCachedLocation";
import { Location } from "./types";

export const getLocation = async (): Promise<Location> => {
  const cachedLocation = await getCachedLocation();

  if (cachedLocation) {
    return cachedLocation;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        storage.local.set({
          cachedLocation: {
            date: Date.now(),
            ...location,
          },
        });

        resolve(location);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: false, maximumAge: 3600000, timeout: 5000 }
    );
  });
};
