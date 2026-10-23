import { Location } from "./types";

export const MAX_PLACE_RESULTS = 5;

export type Place = Location & {
  id: number;
  label: string;
};

type GeocodingResult = Location & {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
};

/** "Name, Region", or the country when there's no region. */
export const mapPlace = ({
  id,
  name,
  admin1,
  country,
  latitude,
  longitude,
}: GeocodingResult): Place => ({
  id,
  label: [name, admin1 ?? country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(", "),
  latitude,
  longitude,
});

export const searchPlaces = async (
  name: string,
  signal?: AbortSignal,
): Promise<Place[]> => {
  const params = new URLSearchParams({
    name,
    count: String(MAX_PLACE_RESULTS),
    language: "en",
    format: "json",
  });

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    { signal },
  );

  if (!res.ok) {
    throw new Error("Failed to search for places.");
  }

  // Without matches, Open-Meteo leaves out `results` altogether.
  const { results = [] } = (await res.json()) as {
    results?: GeocodingResult[];
  };

  return results.map(mapPlace);
};
