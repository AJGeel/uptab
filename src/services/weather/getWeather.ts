/* eslint-disable camelcase */
import { OpenMeteoResponse } from "./types";
import { PossiblyUndefinedLocation } from "../location/types";

export const getWeather = async ({
  latitude,
  longitude,
}: PossiblyUndefinedLocation) => {
  const params = new URLSearchParams({
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code",
    forecast_days: "1",
    latitude: String(latitude),
    longitude: String(longitude),
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error();
  }

  return (await res.json()) as OpenMeteoResponse;
};
