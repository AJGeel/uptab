import { isSameDay, subDays } from "date-fns";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

import { generateDayArray } from "./generateDayArray";

describe("generateDayArray", () => {
  // Mock the current date to ensure consistent tests
  const mockToday = new Date("2024-10-19");

  beforeAll(() => {
    // Mock the Date constructor to always return our fixed date
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should generate an array of 7 dates", () => {
    const result = generateDayArray(mockToday);
    expect(result).toHaveLength(7);
    expect(result.every((date) => date instanceof Date)).toBe(true);
  });

  it("should generate dates from today backwards to 6 days ago", () => {
    const result = generateDayArray(mockToday);

    result.forEach((date, index) => {
      const expectedDate = subDays(mockToday, index);
      expect(isSameDay(date, expectedDate)).toBe(true);
    });
  });

  it("should have today as the first element", () => {
    const result = generateDayArray(mockToday);
    expect(isSameDay(result[0], mockToday)).toBe(true);
  });

  it("should have 6 days ago as the last element", () => {
    const result = generateDayArray(mockToday);
    const sixDaysAgo = subDays(mockToday, 6);
    expect(isSameDay(result[6], sixDaysAgo)).toBe(true);
  });

  it("should return dates in descending order", () => {
    const result = generateDayArray(mockToday);

    for (let i = 1; i < result.length; i++) {
      expect(result[i].getTime()).toBeLessThan(result[i - 1].getTime());
    }
  });
});
