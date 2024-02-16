import { getLocation } from "./getLocation";
import { getReverseGeocoding } from "./getReverseGeocoding";
import { GeocodedLocation } from "./types";

export const getGeocodedLocation = async (): Promise<GeocodedLocation> => {
  const { latitude, longitude } = await getLocation();
  const area = await getReverseGeocoding({ latitude, longitude });

  return {
    area:
      area.residential ?? area.municipality ?? area.city_district ?? area.city,
    latitude,
    longitude,
  };
};
