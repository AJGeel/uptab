import { WeatherDescription } from "./types";

/** Meteocons by Bas Milius (MIT), bundled in public/weather. */
const imagePrefix = "/weather/";

/**
 * One entry per WMO code Open-Meteo can return, each with an icon chosen for
 * what it describes. Intensities of the same weather share one icon.
 * Codes with no icon of their own:
 * - 48 (rime fog) uses the fog icon.
 * - 56, 57, 66 and 67 (freezing drizzle and rain) use sleet, the closest.
 */
export const descriptions: WeatherDescription = {
  "0": {
    day: {
      description: "Sunny",
      image: imagePrefix + "clear-day.svg",
    },
    night: {
      description: "Clear",
      image: imagePrefix + "clear-night.svg",
    },
  },
  "1": {
    day: {
      description: "Mainly Sunny",
      image: imagePrefix + "mostly-clear-day.svg",
    },
    night: {
      description: "Mainly Clear",
      image: imagePrefix + "mostly-clear-night.svg",
    },
  },
  "2": {
    day: {
      description: "Partly Cloudy",
      image: imagePrefix + "partly-cloudy-day.svg",
    },
    night: {
      description: "Partly Cloudy",
      image: imagePrefix + "partly-cloudy-night.svg",
    },
  },
  "3": {
    day: {
      description: "Cloudy",
      image: imagePrefix + "cloudy.svg",
    },
    night: {
      description: "Cloudy",
      image: imagePrefix + "cloudy.svg",
    },
  },
  "45": {
    day: {
      description: "Foggy",
      image: imagePrefix + "fog.svg",
    },
    night: {
      description: "Foggy",
      image: imagePrefix + "fog.svg",
    },
  },
  "48": {
    day: {
      description: "Rime Fog",
      image: imagePrefix + "fog.svg",
    },
    night: {
      description: "Rime Fog",
      image: imagePrefix + "fog.svg",
    },
  },
  "51": {
    day: {
      description: "Light Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
    night: {
      description: "Light Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
  },
  "53": {
    day: {
      description: "Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
    night: {
      description: "Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
  },
  "55": {
    day: {
      description: "Heavy Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
    night: {
      description: "Heavy Drizzle",
      image: imagePrefix + "drizzle.svg",
    },
  },
  "56": {
    day: {
      description: "Light Freezing Drizzle",
      image: imagePrefix + "sleet.svg",
    },
    night: {
      description: "Light Freezing Drizzle",
      image: imagePrefix + "sleet.svg",
    },
  },
  "57": {
    day: {
      description: "Freezing Drizzle",
      image: imagePrefix + "sleet.svg",
    },
    night: {
      description: "Freezing Drizzle",
      image: imagePrefix + "sleet.svg",
    },
  },
  "61": {
    day: {
      description: "Light Rain",
      image: imagePrefix + "rain.svg",
    },
    night: {
      description: "Light Rain",
      image: imagePrefix + "rain.svg",
    },
  },
  "63": {
    day: {
      description: "Rain",
      image: imagePrefix + "rain.svg",
    },
    night: {
      description: "Rain",
      image: imagePrefix + "rain.svg",
    },
  },
  "65": {
    day: {
      description: "Heavy Rain",
      image: imagePrefix + "rain.svg",
    },
    night: {
      description: "Heavy Rain",
      image: imagePrefix + "rain.svg",
    },
  },
  "66": {
    day: {
      description: "Light Freezing Rain",
      image: imagePrefix + "sleet.svg",
    },
    night: {
      description: "Light Freezing Rain",
      image: imagePrefix + "sleet.svg",
    },
  },
  "67": {
    day: {
      description: "Freezing Rain",
      image: imagePrefix + "sleet.svg",
    },
    night: {
      description: "Freezing Rain",
      image: imagePrefix + "sleet.svg",
    },
  },
  "71": {
    day: {
      description: "Light Snow",
      image: imagePrefix + "snow.svg",
    },
    night: {
      description: "Light Snow",
      image: imagePrefix + "snow.svg",
    },
  },
  "73": {
    day: {
      description: "Snow",
      image: imagePrefix + "snow.svg",
    },
    night: {
      description: "Snow",
      image: imagePrefix + "snow.svg",
    },
  },
  "75": {
    day: {
      description: "Heavy Snow",
      image: imagePrefix + "snow.svg",
    },
    night: {
      description: "Heavy Snow",
      image: imagePrefix + "snow.svg",
    },
  },
  "77": {
    day: {
      description: "Snow Grains",
      image: imagePrefix + "snow.svg",
    },
    night: {
      description: "Snow Grains",
      image: imagePrefix + "snow.svg",
    },
  },
  "80": {
    day: {
      description: "Light Showers",
      image: imagePrefix + "partly-cloudy-day-rain.svg",
    },
    night: {
      description: "Light Showers",
      image: imagePrefix + "partly-cloudy-night-rain.svg",
    },
  },
  "81": {
    day: {
      description: "Showers",
      image: imagePrefix + "partly-cloudy-day-rain.svg",
    },
    night: {
      description: "Showers",
      image: imagePrefix + "partly-cloudy-night-rain.svg",
    },
  },
  "82": {
    day: {
      description: "Heavy Showers",
      image: imagePrefix + "partly-cloudy-day-rain.svg",
    },
    night: {
      description: "Heavy Showers",
      image: imagePrefix + "partly-cloudy-night-rain.svg",
    },
  },
  "85": {
    day: {
      description: "Light Snow Showers",
      image: imagePrefix + "partly-cloudy-day-snow.svg",
    },
    night: {
      description: "Light Snow Showers",
      image: imagePrefix + "partly-cloudy-night-snow.svg",
    },
  },
  "86": {
    day: {
      description: "Snow Showers",
      image: imagePrefix + "partly-cloudy-day-snow.svg",
    },
    night: {
      description: "Snow Showers",
      image: imagePrefix + "partly-cloudy-night-snow.svg",
    },
  },
  "95": {
    day: {
      description: "Thunderstorm",
      image: imagePrefix + "thunderstorms-day.svg",
    },
    night: {
      description: "Thunderstorm",
      image: imagePrefix + "thunderstorms-night.svg",
    },
  },
  "96": {
    day: {
      description: "Light Thunderstorms With Hail",
      image: imagePrefix + "thunderstorms-day-hail.svg",
    },
    night: {
      description: "Light Thunderstorms With Hail",
      image: imagePrefix + "thunderstorms-night-hail.svg",
    },
  },
  "99": {
    day: {
      description: "Thunderstorm With Hail",
      image: imagePrefix + "thunderstorms-hail.svg",
    },
    night: {
      description: "Thunderstorm With Hail",
      image: imagePrefix + "thunderstorms-hail.svg",
    },
  },
};
