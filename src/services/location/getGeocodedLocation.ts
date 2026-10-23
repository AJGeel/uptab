import { getLocation } from "./getLocation";
import { getReverseGeocoding } from "./getReverseGeocoding";
import { GeocodedLocation } from "./types";

export const getGeocodedLocation = async (): Promise<GeocodedLocation> => {
  const { latitude, longitude } = await getLocation();

  // Weather only needs the coordinates, so a failed lookup just loses the name.
  const area = await getReverseGeocoding({ latitude, longitude }).catch(
    () => undefined,
  );

  return {
    area:
      area?.residential ??
      area?.municipality ??
      area?.city_district ??
      area?.city,
    latitude,
    longitude,
  };
};
