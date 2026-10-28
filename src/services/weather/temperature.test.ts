import { describe, expect, it } from "vitest";

import { temperatureSymbol, toDisplayTemperature } from "./temperature";

describe("toDisplayTemperature", () => {
  it("leaves celsius as it is", () => {
    expect(toDisplayTemperature(12.3, "celsius")).toBe(12.3);
  });

  it("converts to fahrenheit, to one decimal", () => {
    expect(toDisplayTemperature(0, "fahrenheit")).toBe(32);
    expect(toDisplayTemperature(100, "fahrenheit")).toBe(212);
    expect(toDisplayTemperature(-40, "fahrenheit")).toBe(-40);
    expect(toDisplayTemperature(12.3, "fahrenheit")).toBe(54.1);
  });
});

describe("temperatureSymbol", () => {
  it("names the unit", () => {
    expect(temperatureSymbol("celsius")).toBe("°C");
    expect(temperatureSymbol("fahrenheit")).toBe("°F");
  });
});
