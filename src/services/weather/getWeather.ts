import { FORECAST_DAYS } from "./constants";
import { OpenMeteoResponse } from "./types";
import { Location } from "../location/types";

const WEATHER_FIELDS =
  "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,is_day";

export const getWeather = async ({
  latitude,
  longitude,
}: Location): Promise<OpenMeteoResponse> => {
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
