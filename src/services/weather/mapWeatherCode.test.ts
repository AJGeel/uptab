import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mapWeatherCode } from "./mapWeatherCode";
import { descriptions as weatherDescriptions } from "./weatherDescriptions";

describe("mapWeatherCode", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should provide weather descriptions based on weather codes", () => {
    const dayTime = new Date(2023, 1, 1, 16, 20);
    vi.setSystemTime(dayTime);

    expect(mapWeatherCode("0")).toEqual(weatherDescriptions[0].day);
    expect(mapWeatherCode("1")).toEqual(weatherDescriptions[1].day);
    expect(mapWeatherCode("55")).toEqual(weatherDescriptions[55].day);
    expect(mapWeatherCode("99")).toEqual(weatherDescriptions[99].day);
  });

  it("should provide nighttime graphics if it's night", () => {
    const nightTime = new Date(2023, 1, 1, 0, 0);
    vi.setSystemTime(nightTime);

    expect(mapWeatherCode("0")).toEqual(weatherDescriptions[0].night);
    expect(mapWeatherCode("1")).toEqual(weatherDescriptions[1].night);
    expect(mapWeatherCode("55")).toEqual(weatherDescriptions[55].night);
    expect(mapWeatherCode("99")).toEqual(weatherDescriptions[99].night);
  });

  it("should handle wonky weather codes", () => {
    expect(mapWeatherCode("huh")).toEqual(undefined);
    expect(mapWeatherCode("420")).toEqual(undefined);
  });
});
