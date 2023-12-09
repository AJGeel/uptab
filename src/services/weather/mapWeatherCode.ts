import { descriptions as weatherDescriptions } from "./weatherDescriptions";

export const mapWeatherCode = (code: string) => {
  const description = weatherDescriptions[code];

  if (description) {
    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 7 && currentHour < 18;

    return isDayTime ? description.day : description.night;
  }

  return;
};
