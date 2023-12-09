import { getISOWeek } from "date-fns";
import { describe, expect, it } from "vitest";

import { formatWeekNumber } from "./formatWeekNumber";

describe("formatWeekNumber", () => {
  it("should format the week number correctly", () => {
    const inputDate = new Date("2023-01-15T08:30:00Z");
    const expectedWeekNumber = `Week ${getISOWeek(inputDate)}`;

    const result = formatWeekNumber(inputDate);

    expect(result).toBe(expectedWeekNumber);
  });

  it("should handle different dates", () => {
    const date1 = new Date("2023-01-01T12:00:00Z");
    const date2 = new Date("2023-05-20T18:45:00Z");

    const result1 = formatWeekNumber(date1);
    const result2 = formatWeekNumber(date2);

    expect(result1).toBe(`Week ${getISOWeek(date1)}`);
    expect(result2).toBe(`Week ${getISOWeek(date2)}`);
  });
});
