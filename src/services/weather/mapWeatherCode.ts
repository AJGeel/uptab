import { descriptions as weatherDescriptions } from "./weatherCode/descriptions";

export const mapWeatherCode = (code: string, isDayTime = true) => {
  const description = weatherDescriptions[code];

  if (description) {
    return isDayTime ? description.day : description.night;
  }

  return;
};
