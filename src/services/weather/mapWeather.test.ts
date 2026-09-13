import { describe, expect, it } from "vitest";

import { mapWeather } from "./mapWeather";
import type { OpenMeteoResponse } from "./types";

describe("mapWeather", () => {
  it("maps an Open-Meteo response to the application weather format", () => {
    const data: OpenMeteoResponse = {
      latitude: 51.5074,
      longitude: -0.1278,
      generationtime_ms: 0.22840499877929688,
      utc_offset_seconds: 0,
      timezone: "GMT",
      timezone_abbreviation: "GMT",
      elevation: 2,
      current_units: {
        time: "iso8601",
        interval: "seconds",
        temperature_2m: "°C",
        relative_humidity_2m: "%",
        apparent_temperature: "°C",
        precipitation: "mm",
        rain: "mm",
        showers: "mm",
        snowfall: "cm",
        weather_code: "wmo code",
      },
      current: {
        time: "2026-09-04T12:15",
        interval: 900,
        temperature_2m: 20.6,
        relative_humidity_2m: 84,
        apparent_temperature: 19.5,
        precipitation: 0.2,
        rain: 0.2,
        showers: 0,
        snowfall: 0,
        weather_code: 53,
      },
      hourly_units: {
        time: "iso8601",
        temperature_2m: "°C",
        relative_humidity_2m: "%",
        apparent_temperature: "°C",
        precipitation: "mm",
        rain: "mm",
        showers: "mm",
        snowfall: "cm",
        weather_code: "wmo code",
      },
      hourly: {
        time: ["2026-09-04T12:00", "2026-09-04T13:00", "2026-09-04T14:00"],
        temperature_2m: [21.2, 18.6, 18.6],
        relative_humidity_2m: [82, 91, 84],
        apparent_temperature: [20, 17.8, 17.7],
        precipitation: [0.2, 0.8, 0],
        rain: [0.2, 0.8, 0],
        showers: [0, 0, 0],
        snowfall: [0, 0, 0],
        weather_code: [51, 53, 3],
      },
    };

    const result = mapWeather(data);

    expect(result).toEqual({
      latitude: 51.5074,
      longitude: -0.1278,
      elevation: 2,
      timezone: "GMT",
      timezone_abbreviation: "GMT",

      current: {
        time: "2026-09-04T12:15",
        interval: 900,
        temperature_2m: 20.6,
        relative_humidity_2m: 84,
        apparent_temperature: 19.5,
        precipitation: 0.2,
        rain: 0.2,
        showers: 0,
        snowfall: 0,
        weather_code: 53,
      },

      hourly: [
        {
          time: "2026-09-04T12:00",
          temperature_2m: 21.2,
          relative_humidity_2m: 82,
          apparent_temperature: 20,
          precipitation: 0.2,
          rain: 0.2,
          showers: 0,
          snowfall: 0,
          weather_code: 51,
        },
        {
          time: "2026-09-04T13:00",
          temperature_2m: 18.6,
          relative_humidity_2m: 91,
          apparent_temperature: 17.8,
          precipitation: 0.8,
          rain: 0.8,
          showers: 0,
          snowfall: 0,
          weather_code: 53,
        },
        {
          time: "2026-09-04T14:00",
          temperature_2m: 18.6,
          relative_humidity_2m: 84,
          apparent_temperature: 17.7,
          precipitation: 0,
          rain: 0,
          showers: 0,
          snowfall: 0,
          weather_code: 3,
        },
      ],
    });
  });
});
