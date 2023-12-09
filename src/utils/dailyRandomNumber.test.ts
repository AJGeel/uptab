import { describe, expect, it } from "vitest";

import { dailyRandomNumber } from "./dailyRandomNumber";

describe("dailyRandomNumber", () => {
  it("should generate a random number within the specified range", () => {
    const min = 5;
    const max = 10;

    const result = dailyRandomNumber(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it("should return the same number for the same day", () => {
    const min = 1;
    const max = 100;

    const result1 = dailyRandomNumber(min, max);
    const result2 = dailyRandomNumber(min, max);

    expect(result1).toBe(result2);
  });

  it("should handle different ranges", () => {
    const ranges = [
      { max: 20, min: 10 },
      { max: 50, min: -50 },
      { max: 1, min: 0 },
    ];

    ranges.forEach(({ min, max }) => {
      const result = dailyRandomNumber(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });
});
