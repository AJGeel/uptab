import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { formatHourDisplay } from "./formatHourDisplay";

const originalTimezone = process.env.TZ;

// Test cases in different timezones
const timezones = ["UTC", "America/New_York", "Asia/Tokyo", "Europe/London"];

describe("Time formatting functions", () => {
  describe("formatHourDisplay", () => {
    for (const timezone of timezones) {
      describe(`in ${timezone} timezone`, () => {
        beforeAll(() => {
          process.env.TZ = timezone;
        });

        afterAll(() => {
          process.env.TZ = originalTimezone;
        });

        it("should format midnight UTC correctly", () => {
          const result = formatHourDisplay("2024-01-01", "00");
          expect(result).toMatch(/^\d{2}:00$/);
        });

        it("should format noon UTC correctly", () => {
          const result = formatHourDisplay("2024-01-01", "12");
          expect(result).toMatch(/^\d{2}:00$/);
        });

        it("should format evening UTC correctly", () => {
          const result = formatHourDisplay("2024-01-01", "20");
          expect(result).toMatch(/^\d{2}:00$/);
        });

        it("should handle single-digit hours correctly", () => {
          const result = formatHourDisplay("2024-01-01", "05");
          expect(result).toMatch(/^\d{2}:00$/);
        });

        it("should handle date transitions correctly", () => {
          const result = formatHourDisplay("2024-01-01", "23");
          expect(result).toMatch(/^\d{2}:00$/);
        });
      });
    }

    it("should handle invalid date strings gracefully", () => {
      expect(() => formatHourDisplay("invalid-date", "12")).toThrow();
    });

    it("should handle invalid hour strings gracefully", () => {
      expect(() => formatHourDisplay("2024-01-01", "25")).toThrow();
    });
  });
});
