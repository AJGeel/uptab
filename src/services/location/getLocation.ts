import { Area, GeocodeResponse, GeocodedLocation, Location } from "./types";

export const getLatLong = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
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
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 3600000 }
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

  console.log(area);

  return {
    latitude,
    longitude,
    area:
      area.residential ?? area.municipality ?? area.city_district ?? area.city,
  };
};
