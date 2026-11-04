import { describe, expect, it } from "vitest";

import { getPhotoPeriod } from "./photoPeriod";

const at = (hours: number, minutes = 0) =>
  new Date(2026, 9, 28, hours, minutes);

describe("getPhotoPeriod", () => {
  it("is the same all day for daily", () => {
    expect(getPhotoPeriod("daily", at(0), "x")).toBe("2026-10-28");
    expect(getPhotoPeriod("daily", at(23, 59), "x")).toBe("2026-10-28");
  });

  it("changes every six hours", () => {
    const periods = [0, 5, 6, 11, 12, 18, 23].map((hour) =>
      getPhotoPeriod("sixHours", at(hour), "x"),
    );

    expect(periods[0]).toBe(periods[1]);
    expect(periods[2]).toBe(periods[3]);
    expect(new Set(periods).size).toBe(4);
  });

  it("changes every hour", () => {
    expect(getPhotoPeriod("hourly", at(9, 5), "x")).toBe(
      getPhotoPeriod("hourly", at(9, 55), "x"),
    );
    expect(getPhotoPeriod("hourly", at(9), "x")).not.toBe(
      getPhotoPeriod("hourly", at(10), "x"),
    );
  });

  it("is the seed of the tab for every tab", () => {
    expect(getPhotoPeriod("everyTab", at(9), "abc")).toBe("abc");
  });
});
