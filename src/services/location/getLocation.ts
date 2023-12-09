import { storage } from "webextension-polyfill";
import { Area, GeocodeResponse, GeocodedLocation, Location } from "./types";
import { checkCachedLatLong } from "./checkCachedLatLong";

const getLatLong = async (): Promise<Location> => {
  const cachedLocation = await checkCachedLatLong();

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

const getArea = async ({ latitude, longitude }: Location): Promise<Area> => {
  const res = await fetch(
    `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
  );

  const data = (await res.json()) as GeocodeResponse;

  return data.address as Area;
};

export const getLocation = async (): Promise<GeocodedLocation> => {
  const { latitude, longitude } = await getLatLong();
  const area = await getArea({ latitude, longitude });

  return {
    area:
      area.residential ?? area.municipality ?? area.city_district ?? area.city,
    latitude,
    longitude,
  };
};
