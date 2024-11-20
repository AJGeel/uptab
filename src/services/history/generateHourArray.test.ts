import { describe, it, expect } from "vitest";

import { generateHourArray } from "./generateHourArray";

describe("generateHourArray", () => {
  it('Generates an array that contains ["23", "22" ..., "01", "00"]', () => {
    const result = generateHourArray();

    expect(result).toEqual([
      "23",
      "22",
      "21",
      "20",
      "19",
      "18",
      "17",
      "16",
      "15",
      "14",
      "13",
      "12",
      "11",
      "10",
      "09",
      "08",
      "07",
      "06",
      "05",
      "04",
      "03",
      "02",
      "01",
      "00",
    ]);
  });
});
