import { describe, expect, it } from "vitest";

import { eggRanges, isInRange, pickEgg } from "./eggs";

// Months are zero-based in Date.
const on = (month: number, day: number) => new Date(2026, month - 1, day, 12);

describe("pickEgg", () => {
  it("shows nothing outside every range", () => {
    expect(pickEgg(on(11, 14), 0)).toBeUndefined();
    expect(pickEgg(on(12, 6), 0)).toBeUndefined();
    expect(pickEgg(on(6, 1), 0)).toBeUndefined();
  });

  it("rolls against the chance of the range", () => {
    expect(pickEgg(on(11, 20), 0.04)).toBe("Sinterklaas");
    expect(pickEgg(on(11, 20), 0.05)).toBeUndefined();
    expect(pickEgg(on(12, 3), 0.24)).toBe("Sinterklaas");
    expect(pickEgg(on(12, 3), 0.25)).toBeUndefined();
  });

  it("always shows on the fifth of December", () => {
    expect(pickEgg(on(12, 5), 0.999)).toBe("Sinterklaas");
  });

  it("shows fireworks around the turn of the year", () => {
    expect(pickEgg(on(12, 31), 0.59)).toBe("Oud & Nieuw");
    expect(pickEgg(on(12, 31), 0.6)).toBeUndefined();
    expect(pickEgg(on(1, 1), 0.24)).toBe("Oud & Nieuw");
    expect(pickEgg(on(1, 2), 0)).toBeUndefined();
  });

  it("includes both ends of a range", () => {
    expect(pickEgg(on(11, 15), 0)).toBe("Sinterklaas");
    expect(pickEgg(on(12, 1), 0)).toBe("Sinterklaas");
  });
});

describe("eggRanges", () => {
  it("never overlap", () => {
    for (const [index, range] of eggRanges.entries()) {
      for (const other of eggRanges.slice(index + 1)) {
        expect(
          isInRange(on(...range.from), other) ||
            isInRange(on(...range.to), other) ||
            isInRange(on(...other.from), range) ||
            isInRange(on(...other.to), range),
        ).toBe(false);
      }
    }
  });

  it("have odds between 0 and 1", () => {
    for (const { chance } of eggRanges) {
      expect(chance).toBeGreaterThan(0);
      expect(chance).toBeLessThanOrEqual(1);
    }
  });
});
