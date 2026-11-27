import { areIntervalsOverlapping, endOfDay, startOfDay } from "date-fns";
import { describe, expect, it } from "vitest";

import { getEggRanges, pickEgg } from "./eggs";

// Months are zero-based in Date, as everywhere in JavaScript.
const on = (year: number, month: number, day: number) =>
  new Date(year, month, day, 12);

describe("pickEgg", () => {
  it("shows nothing outside every range", () => {
    expect(pickEgg(on(2026, 10, 14), 0)).toBeUndefined();
    expect(pickEgg(on(2026, 11, 6), 0)).toBeUndefined();
    expect(pickEgg(on(2026, 5, 1), 0)).toBeUndefined();
  });

  it("rolls against the chance of the range", () => {
    expect(pickEgg(on(2026, 10, 20), 0.04)).toBe("Sinterklaas");
    expect(pickEgg(on(2026, 10, 20), 0.05)).toBeUndefined();
    expect(pickEgg(on(2026, 11, 3), 0.24)).toBe("Sinterklaas");
    expect(pickEgg(on(2026, 11, 3), 0.25)).toBeUndefined();
  });

  it("always shows on the fifth of December", () => {
    expect(pickEgg(on(2026, 11, 5), 0.999)).toBe("Sinterklaas");
  });

  it("shows fireworks around the turn of the year", () => {
    expect(pickEgg(on(2026, 11, 31), 0.59)).toBe("Oud & Nieuw");
    expect(pickEgg(on(2026, 11, 31), 0.6)).toBeUndefined();
    expect(pickEgg(on(2027, 0, 1), 0.24)).toBe("Oud & Nieuw");
    expect(pickEgg(on(2027, 0, 2), 0)).toBeUndefined();
  });

  it("includes both ends of a range, to the very end of the last day", () => {
    expect(pickEgg(on(2026, 10, 15), 0)).toBe("Sinterklaas");
    expect(pickEgg(on(2026, 11, 1), 0)).toBe("Sinterklaas");
    expect(pickEgg(new Date(2026, 11, 1, 23, 59, 59), 0)).toBe("Sinterklaas");
    expect(pickEgg(new Date(2026, 11, 2, 0, 0, 0), 0.3)).toBeUndefined();
  });

  it("only sometimes shows the quieter days, never every time", () => {
    // Koningsdag and Bevrijdingsdag. TODO(sint-maarten): add its check when it's back.
    expect(pickEgg(on(2026, 3, 27), 0.59)).toBe("Koningsdag");
    expect(pickEgg(on(2026, 3, 27), 0.6)).toBeUndefined();
    expect(pickEgg(on(2026, 4, 5), 0.39)).toBe("Bevrijdingsdag");
    expect(pickEgg(on(2026, 4, 5), 0.4)).toBeUndefined();
    /*
     * expect(pickEgg(on(2026, 10, 11), 0.54)).toBe("Sint-Maarten");
     * expect(pickEgg(on(2026, 10, 11), 0.55)).toBeUndefined();
     */
  });

  it("moves Koningsdag to the 26th when the 27th is a Sunday", () => {
    // 27 April 2025 was a Sunday.
    expect(pickEgg(on(2025, 3, 26), 0.5)).toBe("Koningsdag");
    expect(pickEgg(on(2025, 3, 27), 0.5)).toBeUndefined();
    // The evening before moves with it.
    expect(pickEgg(on(2025, 3, 25), 0.1)).toBe("Koningsdag");
  });
});

describe("getEggRanges", () => {
  it("never overlap, in any year", () => {
    for (let year = 2024; year <= 2040; year++) {
      const ranges = getEggRanges(year);

      for (const [index, range] of ranges.entries()) {
        for (const other of ranges.slice(index + 1)) {
          expect(
            areIntervalsOverlapping(
              { start: startOfDay(range.from), end: endOfDay(range.to) },
              { start: startOfDay(other.from), end: endOfDay(other.to) },
            ),
          ).toBe(false);
        }
      }
    }
  });

  it("have odds between 0 and 1, and end after they start", () => {
    for (const { chance, from, to } of getEggRanges(2026)) {
      expect(chance).toBeGreaterThan(0);
      expect(chance).toBeLessThanOrEqual(1);
      expect(to.getTime()).toBeGreaterThanOrEqual(from.getTime());
    }
  });

  it("keeps the new ones from being a sure thing", () => {
    const sure = getEggRanges(2026).filter(({ chance }) => chance === 1);

    expect(sure.map(({ egg }) => egg)).toEqual(["Sinterklaas"]);
  });
});
