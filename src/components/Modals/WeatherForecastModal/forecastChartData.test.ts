import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildDailySummaries,
  buildForecastChartData,
  getDayBoundaries,
  getTimeTicks,
  HourlyForecast,
} from "./forecastChartData";

const NOW = new Date(2026, 9, 16, 14, 25);

const hour = (
  time: string,
  overrides: Partial<HourlyForecast> = {},
): HourlyForecast => ({
  time,
  temperature_2m: 12,
  apparent_temperature: 10,
  relative_humidity_2m: 80,
  precipitation: 0,
  rain: 0,
  showers: 0,
  snowfall: 0,
  weather_code: 0,
  is_day: 1,
  ...overrides,
});

// "Today" labels depend on the clock, so every test runs on the same day.
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("buildForecastChartData", () => {
  it("keeps hours from the current hour through the last forecast day", () => {
    const hourly = [
      hour("2026-10-16T13:00"),
      hour("2026-10-16T14:00"),
      hour("2026-10-18T23:00"),
      hour("2026-10-19T00:00"),
    ];

    const times = buildForecastChartData(hourly, NOW).map((p) => p.time);

    expect(times).toEqual(["2026-10-16T14:00", "2026-10-18T23:00"]);
  });

  it("rounds values and labels days", () => {
    const [today, tomorrow] = buildForecastChartData(
      [
        hour("2026-10-16T15:00", {
          temperature_2m: 12.6,
          apparent_temperature: 9.4,
          precipitation: 0.26,
        }),
        hour("2026-10-17T15:00"),
      ],
      NOW,
    );

    expect(today).toMatchObject({
      temperature: 12.6,
      apparentTemperature: 9,
      precipitation: 0.3,
      dayKey: "2026-10-16",
      dayLabel: "Today",
    });
    expect(tomorrow.dayLabel).toBe("Saturday");
  });

  it("counts showers and snow as precipitation, not just rain", () => {
    const [showers, snow, mixed] = buildForecastChartData(
      [
        hour("2026-10-16T15:00", { precipitation: 3, rain: 0, showers: 3 }),
        hour("2026-10-16T16:00", { precipitation: 1.4, snowfall: 2 }),
        hour("2026-10-16T17:00", {
          precipitation: 2,
          rain: 1.5,
          snowfall: 0.7,
        }),
      ],
      NOW,
    );

    expect(showers).toMatchObject({ precipitation: 3, isSnow: false });
    expect(snow).toMatchObject({ precipitation: 1.4, isSnow: true });
    expect(mixed.isSnow).toBe(false);
  });

  it("uses the hour's own day/night flag for the weather icon", () => {
    const [day, night] = buildForecastChartData(
      [
        hour("2026-10-16T15:00", { is_day: 1 }),
        hour("2026-10-16T23:00", { is_day: 0 }),
      ],
      NOW,
    );

    expect(day.weather?.description).toBe("Sunny");
    expect(night.weather?.description).toBe("Clear");
  });
});

describe("getDayBoundaries", () => {
  it("returns the first point of each new day, except the first day", () => {
    const points = buildForecastChartData(
      [
        hour("2026-10-16T22:00"),
        hour("2026-10-16T23:00"),
        hour("2026-10-17T00:00"),
        hour("2026-10-17T01:00"),
        hour("2026-10-18T00:00"),
      ],
      NOW,
    );

    expect(getDayBoundaries(points).map((p) => p.time)).toEqual([
      "2026-10-17T00:00",
      "2026-10-18T00:00",
    ]);
  });
});

describe("getTimeTicks", () => {
  it("ticks at 06:00, 12:00 and 18:00", () => {
    const points = buildForecastChartData(
      ["15", "18", "21"]
        .flatMap((h) => [hour(`2026-10-16T${h}:00`)])
        .concat([hour("2026-10-17T00:00"), hour("2026-10-17T06:00")]),
      NOW,
    );

    expect(getTimeTicks(points)).toEqual([
      "2026-10-16T18:00",
      "2026-10-17T06:00",
    ]);
  });
});

describe("buildDailySummaries", () => {
  it("summarises highs, lows, precipitation and the worst weather per day", () => {
    const points = buildForecastChartData(
      [
        hour("2026-10-16T15:00", {
          temperature_2m: 13.6,
          precipitation: 0.4,
        }),
        hour("2026-10-16T16:00", {
          temperature_2m: 9,
          precipitation: 1.2,
          weather_code: 61,
          is_day: 0,
        }),
        hour("2026-10-17T12:00", { temperature_2m: 7 }),
      ],
      NOW,
    );

    const [today, tomorrow] = buildDailySummaries(points);

    expect(today).toMatchObject({
      dayKey: "2026-10-16",
      dayLabel: "Today",
      high: 14,
      low: 9,
      precipitation: 1.6,
    });
    // The rainy night hour wins, but the summary always shows the day icon.
    expect(today.weather?.description).toBe("Light Rain");
    expect(today.weather?.image).toContain("10d");
    expect(tomorrow).toMatchObject({ high: 7, low: 7, precipitation: 0 });
  });

  it("returns nothing for no points", () => {
    expect(buildDailySummaries([])).toEqual([]);
  });
});
