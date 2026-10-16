import { describe, expect, it } from "vitest";

import {
  getTemperatureColor,
  getTemperatureGradientStops,
} from "./temperatureColor";

describe("getTemperatureColor", () => {
  it("returns the exact scale colors at the scale stops", () => {
    expect(getTemperatureColor(0)).toBe("rgb(56, 189, 248)");
    expect(getTemperatureColor(8)).toBe("rgb(52, 211, 153)");
  });

  it("clamps temperatures outside the scale", () => {
    expect(getTemperatureColor(-40)).toBe(getTemperatureColor(-10));
    expect(getTemperatureColor(50)).toBe(getTemperatureColor(35));
  });

  it("interpolates between stops", () => {
    // Halfway between deep blue (29, 78, 216) and sky blue (56, 189, 248).
    expect(getTemperatureColor(-5)).toBe("rgb(43, 134, 232)");
  });
});

describe("getTemperatureGradientStops", () => {
  it("returns null for empty or flat temperatures", () => {
    expect(getTemperatureGradientStops([])).toBeNull();
    expect(getTemperatureGradientStops([12, 12, 12])).toBeNull();
  });

  it("runs from the highest temperature at the top to the lowest at the bottom", () => {
    const stops = getTemperatureGradientStops([5, 30, 18]);

    expect(stops).toHaveLength(11);
    expect(stops?.[0]).toEqual({ offset: 0, color: getTemperatureColor(30) });
    expect(stops?.at(-1)).toEqual({
      offset: 1,
      color: getTemperatureColor(5),
    });
  });
});
