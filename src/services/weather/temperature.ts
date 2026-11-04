import { TemperatureUnit } from "@/src/services/settings/types";

/** Open-Meteo gives °C. This is the number to show for the chosen unit, to one decimal. */
export const toDisplayTemperature = (celsius: number, unit: TemperatureUnit) =>
  unit === "fahrenheit"
    ? Math.round(((celsius * 9) / 5 + 32) * 10) / 10
    : celsius;

export const temperatureSymbol = (unit: TemperatureUnit) =>
  unit === "fahrenheit" ? "°F" : "°C";
