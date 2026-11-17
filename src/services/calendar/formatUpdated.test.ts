import { describe, expect, it } from "vitest";

import { formatUpdatedAgo, formatUpdatedAt } from "./formatUpdated";

const MIN = 60_000;
const now = new Date(2026, 10, 16, 9, 0).getTime();

describe("formatUpdatedAgo", () => {
  it("says just now within the first minute", () => {
    expect(formatUpdatedAgo(now - 30_000, now)).toBe("just now");
  });

  it("counts minutes, then hours", () => {
    expect(formatUpdatedAgo(now - 4 * MIN, now)).toBe("4 min ago");
    expect(formatUpdatedAgo(now - 59 * MIN, now)).toBe("59 min ago");
    expect(formatUpdatedAgo(now - 190 * MIN, now)).toBe("3 h ago");
  });
});

describe("formatUpdatedAt", () => {
  it("follows the time format", () => {
    const at = new Date(2026, 10, 16, 7, 12).getTime();

    expect(formatUpdatedAt(at, "24h")).toBe("07:12");
    expect(formatUpdatedAt(at, "12h")).toBe("7:12 AM");
  });
});
