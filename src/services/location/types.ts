export type Location = {
  latitude: number;
  longitude: number;
};

export type Area = {
  residential?: string;
  city_district?: string;
  municipality?: string;
  city: string;
};

export type GeocodedLocation = Location & { area?: string };

export type GeocodeResponse = {
  address: Area & {
    house_number: string;
    road: string;
    state: string;
    country: string;
    postcode: string;
    country_code: string;
  };
};

/** A place the user added by hand. */
export type SavedLocation = Location & {
  id: string;
  label: string;
};

export type LocationSettings = {
  /** `"gps"` for the current location, otherwise a saved location's id. */
  active: string;
  saved: SavedLocation[];
};

export type GpsFailure = "denied" | "timeout" | "unavailable";
