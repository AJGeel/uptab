import { describe, expect, it } from "vitest";

import { getVisitDetail } from "./visitDetail";

const now = Date.UTC(2026, 9, 27, 12);
const visit = { visitCount: 1234, lastVisitTime: now - 2 * 60 * 60 * 1000 };

describe("getVisitDetail", () => {
  it("shows how long ago for the recently visited sort", () => {
    expect(getVisitDetail("Recent", visit, now)).toBe("2 hours ago");
  });

  it("shows the total for the most visited sort", () => {
    expect(getVisitDetail("Popular", visit, now)).toBe("1,234 visits");
    expect(getVisitDetail("Popular", { ...visit, visitCount: 1 }, now)).toBe(
      "1 visit",
    );
  });

  it("shows nothing for other sorts, or a bookmark that wasn't visited", () => {
    expect(getVisitDetail("A-Z", visit, now)).toBeUndefined();
    expect(getVisitDetail("Recent", undefined, now)).toBeUndefined();
    expect(
      getVisitDetail("Popular", { visitCount: 0, lastVisitTime: 0 }, now),
    ).toBeUndefined();
  });
});
