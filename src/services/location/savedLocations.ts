import { Location, LocationSettings, SavedLocation } from "./types";

export const MAX_SAVED_LOCATIONS = 5;

/** Places closer together than this count as the same place. */
const DUPLICATE_DISTANCE_KM = 1;

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance, by the haversine formula. */
export const distanceKm = (a: Location, b: Location) => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) *
      Math.cos(toRadians(b.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

type AddResult =
  | { ok: true; location: LocationSettings }
  | { ok: false; reason: "limit" }
  | { ok: false; reason: "duplicate"; existing: SavedLocation };

/** Adds a place and makes it the active one. */
export const addSavedLocation = (
  settings: LocationSettings,
  place: Omit<SavedLocation, "id">,
  id: string = crypto.randomUUID(),
): AddResult => {
  if (settings.saved.length >= MAX_SAVED_LOCATIONS) {
    return { ok: false, reason: "limit" };
  }

  const existing = settings.saved.find(
    (saved) => distanceKm(saved, place) < DUPLICATE_DISTANCE_KM,
  );

  if (existing) {
    return { ok: false, reason: "duplicate", existing };
  }

  return {
    ok: true,
    location: {
      active: id,
      saved: [...settings.saved, { ...place, id }],
    },
  };
};

/** Deleting the active place goes back to GPS. */
export const removeSavedLocation = (
  settings: LocationSettings,
  id: string,
): LocationSettings => ({
  active: settings.active === id ? "gps" : settings.active,
  saved: settings.saved.filter((saved) => saved.id !== id),
});

export const setActiveLocation = (
  settings: LocationSettings,
  active: string,
): LocationSettings => {
  if (active === "gps") {
    return { ...settings, active };
  }

  if (!settings.saved.some(({ id }) => id === active)) {
    return settings;
  }

  return { ...settings, active };
};
