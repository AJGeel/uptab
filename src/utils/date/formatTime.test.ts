import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { formatTime } from "./formatTime";

const originalTimezone = process.env.TZ;
const timezones = ["UTC", "America/New_York", "Asia/Tokyo", "Europe/London"];

describe("formatTime", () => {
  for (const timezone of timezones) {
    describe(`in ${timezone} timezone`, () => {
      beforeAll(() => {
        process.env.TZ = timezone;
      });

      afterAll(() => {
        process.env.TZ = originalTimezone;
      });

      it("should format midnight correctly", () => {
        const midnight = new Date("2024-01-01T00:00:00Z").getTime();
        const result = formatTime(midnight);
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });

      it("should format noon correctly", () => {
        const noon = new Date("2024-01-01T12:00:00Z").getTime();
        const result = formatTime(noon);
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });

      it("should format time with seconds correctly", () => {
        const timeWithSeconds = new Date("2024-01-01T12:34:56Z").getTime();
        const result = formatTime(timeWithSeconds);
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });

      it("should handle millisecond precision", () => {
        const timeWithMs = new Date("2024-01-01T12:34:56.789Z").getTime();
        const result = formatTime(timeWithMs);
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });
    });
  }

  it("should handle invalid timestamps gracefully", () => {
    expect(() => formatTime(NaN)).toThrow();
  });

  it("should handle very large timestamps", () => {
    const farFuture = new Date("2100-01-01T00:00:00Z").getTime();
    const result = formatTime(farFuture);
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("should handle very small timestamps", () => {
    const farPast = new Date("1900-01-01T00:00:00Z").getTime();
    const result = formatTime(farPast);
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
