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

export type GeocodedLocation = Location & { area: string };

export type PossiblyUndefinedLocation = {
  latitude?: number;
  longitude?: number;
};

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
