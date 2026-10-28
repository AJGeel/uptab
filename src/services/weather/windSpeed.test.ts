import { describe, expect, it } from "vitest";

import { toDisplayWindSpeed, windSymbol } from "./windSpeed";

describe("toDisplayWindSpeed", () => {
  it("rounds km/h", () => {
    expect(toDisplayWindSpeed(14.4, "kmh")).toBe(14);
  });

  it("converts to mph, rounded", () => {
    expect(toDisplayWindSpeed(0, "mph")).toBe(0);
    expect(toDisplayWindSpeed(16.09344, "mph")).toBe(10);
    expect(toDisplayWindSpeed(100, "mph")).toBe(62);
  });
});

describe("windSymbol", () => {
  it("names the unit", () => {
    expect(windSymbol("kmh")).toBe("km/h");
    expect(windSymbol("mph")).toBe("mph");
  });
});
