import { OpenMeteoResponse } from "./types";
import { PossiblyUndefinedLocation } from "../location/types";

/** Number of days fetched, starting with today. */
export const FORECAST_DAYS = 3;

const WEATHER_FIELDS =
  "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,is_day";

export const getWeather = async ({
  latitude,
  longitude,
}: PossiblyUndefinedLocation): Promise<OpenMeteoResponse> => {
  const params = new URLSearchParams({
    current: WEATHER_FIELDS,
    hourly: WEATHER_FIELDS,
    forecast_days: String(FORECAST_DAYS),
    timezone: "auto",
    latitude: String(latitude),
    longitude: String(longitude),
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
};
