import { WindUnit } from "@/src/services/settings/types";

const KMH_PER_MPH = 1.609344;

/** Open-Meteo gives km/h. This is the number to show for the chosen unit, rounded. */
export const toDisplayWindSpeed = (kmh: number, unit: WindUnit) =>
  Math.round(unit === "mph" ? kmh / KMH_PER_MPH : kmh);

export const windSymbol = (unit: WindUnit) => (unit === "mph" ? "mph" : "km/h");
