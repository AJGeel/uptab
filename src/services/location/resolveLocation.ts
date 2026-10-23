import { GeocodedLocation, LocationSettings } from "./types";

/**
 * The saved location that's active, if any. Never touches GPS, so users who
 * only use saved places aren't asked for permission.
 */
export const getActiveSavedLocation = ({
  active,
  saved,
}: LocationSettings): GeocodedLocation | undefined => {
  const location = saved.find(({ id }) => id === active);

  return (
    location && {
      area: location.label,
      latitude: location.latitude,
      longitude: location.longitude,
    }
  );
};
