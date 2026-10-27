import { describe, expect, it } from "vitest";

import { formatLastVisit } from "./formatLastVisit";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const now = Date.UTC(2026, 9, 27, 12);

const ago = (ms: number) => formatLastVisit(now - ms, now);

describe("formatLastVisit", () => {
  it("says just now for the last minute", () => {
    expect(ago(0)).toBe("Just now");
    expect(ago(59 * 1000)).toBe("Just now");
  });

  it("counts minutes up to the hour", () => {
    expect(ago(MINUTE)).toBe("1 min ago");
    expect(ago(59 * MINUTE)).toBe("59 min ago");
  });

  it("counts hours up to the day", () => {
    expect(ago(HOUR)).toBe("1 hour ago");
    expect(ago(5 * HOUR)).toBe("5 hours ago");
    expect(ago(23 * HOUR + 59 * MINUTE)).toBe("23 hours ago");
  });

  it("counts days up to the week", () => {
    expect(ago(DAY)).toBe("1 day ago");
    expect(ago(6 * DAY)).toBe("6 days ago");
  });

  it("counts weeks for the next couple of months", () => {
    expect(ago(7 * DAY)).toBe("1 week ago");
    expect(ago(20 * DAY)).toBe("2 weeks ago");
    expect(ago(55 * DAY)).toBe("7 weeks ago");
  });

  it("goes vague after that", () => {
    expect(ago(60 * DAY)).toBe("A while back");
    expect(ago(900 * DAY)).toBe("A while back");
  });

  it("treats a time slightly ahead of the clock as just now", () => {
    expect(formatLastVisit(now + 5 * MINUTE, now)).toBe("Just now");
  });
});
