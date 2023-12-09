import { describe, expect, it } from "vitest";

import { formatToday } from "./formatToday";

describe("formatToday", () => {
  it("should format the date in the correct format", () => {
    // Mock the current date to ensure consistent results in the test
    const originalDateNow = Date.now;
    Date.now = () => new Date("2023-01-15T12:34:56Z").getTime();

    const inputDate = new Date("2023-01-15T08:30:00Z");
    const expectedResult = "Sunday, 15th Jan 2023";

    const result = formatToday(inputDate);

    expect(result).toBe(expectedResult);

    // Restore the original Date.now after the test
    Date.now = originalDateNow;
  });
});
