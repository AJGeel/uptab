import { descriptions as weatherDescriptions } from "./weatherDescriptions";

const isDayTimeNow = () => {
  const currentHour = new Date().getHours();

  return currentHour >= 7 && currentHour < 18;
};

/**
 * Pass `isDay` (e.g. from Open-Meteo's `is_day`) to pick the day or night
 * variant. Without it, the current local time is used as a rough guess.
 */
export const mapWeatherCode = (code: number, isDay = isDayTimeNow()) => {
  const description = weatherDescriptions[code];

  if (description) {
    return isDay ? description.day : description.night;
  }

  return;
};
