import { OpenMeteoResponse } from "./types";

export const getWeather = async () => {
  const latitude = 52.156113;
  const longitude = 5.387827;

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code&forecast_days=1`
  );
  return (await res.json()) as OpenMeteoResponse;
};
