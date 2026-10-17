import { Location } from "./types";

export const getLocation = (): Promise<Location> =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: false, maximumAge: 3600000, timeout: 5000 },
    );
  });
