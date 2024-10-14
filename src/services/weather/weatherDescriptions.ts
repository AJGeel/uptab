import { WeatherDescription } from "./types";

const imagePrefix = "https://openweathermap.org/img/wn/";

export const descriptions: WeatherDescription = {
  "0": {
    day: {
      description: "Sunny",
      image: imagePrefix + "01d@2x.png",
    },
    night: {
      description: "Clear",
      image: imagePrefix + "01n@2x.png",
    },
  },
  "1": {
    day: {
      description: "Mainly Sunny",
      image: imagePrefix + "01d@2x.png",
    },
    night: {
      description: "Mainly Clear",
      image: imagePrefix + "01n@2x.png",
    },
  },
  "2": {
    day: {
      description: "Partly Cloudy",
      image: imagePrefix + "02d@2x.png",
    },
    night: {
      description: "Partly Cloudy",
      image: imagePrefix + "02n@2x.png",
    },
  },
  "3": {
    day: {
      description: "Cloudy",
      image: imagePrefix + "03d@2x.png",
    },
    night: {
      description: "Cloudy",
      image: imagePrefix + "03n@2x.png",
    },
  },
  "45": {
    day: {
      description: "Foggy",
      image: imagePrefix + "50d@2x.png",
    },
    night: {
      description: "Foggy",
      image: imagePrefix + "50n@2x.png",
    },
  },
  "48": {
    day: {
      description: "Rime Fog",
      image: imagePrefix + "50d@2x.png",
    },
    night: {
      description: "Rime Fog",
      image: imagePrefix + "50n@2x.png",
    },
  },
  "51": {
    day: {
      description: "Light Drizzle",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Light Drizzle",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "53": {
    day: {
      description: "Drizzle",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Drizzle",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "55": {
    day: {
      description: "Heavy Drizzle",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Heavy Drizzle",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "56": {
    day: {
      description: "Light Freezing Drizzle",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Light Freezing Drizzle",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "57": {
    day: {
      description: "Freezing Drizzle",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Freezing Drizzle",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "61": {
    day: {
      description: "Light Rain",
      image: imagePrefix + "10d@2x.png",
    },
    night: {
      description: "Light Rain",
      image: imagePrefix + "10n@2x.png",
    },
  },
  "63": {
    day: {
      description: "Rain",
      image: imagePrefix + "10d@2x.png",
    },
    night: {
      description: "Rain",
      image: imagePrefix + "10n@2x.png",
    },
  },
  "65": {
    day: {
      description: "Heavy Rain",
      image: imagePrefix + "10d@2x.png",
    },
    night: {
      description: "Heavy Rain",
      image: imagePrefix + "10n@2x.png",
    },
  },
  "66": {
    day: {
      description: "Light Freezing Rain",
      image: imagePrefix + "10d@2x.png",
    },
    night: {
      description: "Light Freezing Rain",
      image: imagePrefix + "10n@2x.png",
    },
  },
  "67": {
    day: {
      description: "Freezing Rain",
      image: imagePrefix + "10d@2x.png",
    },
    night: {
      description: "Freezing Rain",
      image: imagePrefix + "10n@2x.png",
    },
  },
  "71": {
    day: {
      description: "Light Snow",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Light Snow",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "73": {
    day: {
      description: "Snow",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Snow",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "75": {
    day: {
      description: "Heavy Snow",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Heavy Snow",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "77": {
    day: {
      description: "Snow Grains",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Snow Grains",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "80": {
    day: {
      description: "Light Showers",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Light Showers",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "81": {
    day: {
      description: "Showers",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Showers",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "82": {
    day: {
      description: "Heavy Showers",
      image: imagePrefix + "09d@2x.png",
    },
    night: {
      description: "Heavy Showers",
      image: imagePrefix + "09n@2x.png",
    },
  },
  "85": {
    day: {
      description: "Light Snow Showers",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Light Snow Showers",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "86": {
    day: {
      description: "Snow Showers",
      image: imagePrefix + "13d@2x.png",
    },
    night: {
      description: "Snow Showers",
      image: imagePrefix + "13n@2x.png",
    },
  },
  "95": {
    day: {
      description: "Thunderstorm",
      image: imagePrefix + "11d@2x.png",
    },
    night: {
      description: "Thunderstorm",
      image: imagePrefix + "11n@2x.png",
    },
  },
  "96": {
    day: {
      description: "Light Thunderstorms With Hail",
      image: imagePrefix + "11d@2x.png",
    },
    night: {
      description: "Light Thunderstorms With Hail",
      image: imagePrefix + "11n@2x.png",
    },
  },
  "99": {
    day: {
      description: "Thunderstorm With Hail",
      image: imagePrefix + "11d@2x.png",
    },
    night: {
      description: "Thunderstorm With Hail",
      image: imagePrefix + "11n@2x.png",
    },
  },
};
