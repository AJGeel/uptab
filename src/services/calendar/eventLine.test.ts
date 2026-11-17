import { describe, expect, it } from "vitest";

import {
  canJoin,
  formatEventTiming,
  getEventLine,
  JOIN_LEAD_MS,
} from "./eventLine";
import type { CalendarEvent } from "./types";

const at = (hours: number, minutes = 0) =>
  new Date(2026, 10, 16, hours, minutes).getTime();
const MIN = 60 * 1000;

const timed = (
  id: string,
  start: number,
  end: number,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => ({ id, title: id, start, end, allDay: false, ...extra });

const allDay = (id: string): CalendarEvent => ({
  id,
  title: id,
  start: new Date(2026, 10, 16).getTime(),
  end: new Date(2026, 10, 17).getTime(),
  allDay: true,
});

describe("getEventLine", () => {
  it("is empty without events", () => {
    expect(getEventLine([], at(9))).toEqual({ kind: "none" });
  });

  it("shows what's happening now", () => {
    const event = timed("review", at(9), at(10));

    expect(getEventLine([event], at(9, 30))).toEqual({ kind: "now", event });
  });

  it("prefers what's on now over what's next", () => {
    const now = timed("now", at(9), at(10));
    const next = timed("next", at(9, 30), at(11));

    expect(getEventLine([now, next], at(9, 40))).toMatchObject({ kind: "now" });
  });

  it("shows the next event after the current one is over", () => {
    const over = timed("over", at(8), at(9));
    const next = timed("next", at(11), at(12));

    expect(getEventLine([over, next], at(10))).toEqual({
      kind: "next",
      event: next,
    });
  });

  it("leaves out tomorrow's events", () => {
    const tomorrow = timed("tomorrow", at(33), at(34));

    expect(getEventLine([tomorrow], at(10))).toEqual({ kind: "none" });
  });

  it("shows all-day events only when no timed event is left", () => {
    const day = allDay("birthday");
    const later = timed("later", at(15), at(16));

    expect(getEventLine([day, later], at(10))).toMatchObject({ kind: "next" });
    expect(getEventLine([day, later], at(17))).toEqual({
      kind: "allDay",
      event: day,
    });
  });

  it("counts an event that ends exactly now as over", () => {
    expect(getEventLine([timed("a", at(9), at(10))], at(10))).toEqual({
      kind: "none",
    });
  });
});

describe("formatEventTiming", () => {
  const next = (minutes: number) =>
    ({
      kind: "next",
      event: timed("a", at(9) + minutes * MIN, at(12)),
    }) as const;

  it("counts down in minutes up to an hour", () => {
    expect(formatEventTiming(next(8), at(9), "24h")).toBe("in 8m");
    expect(formatEventTiming(next(60), at(9), "24h")).toBe("in 60m");
  });

  it("never says 0 minutes", () => {
    expect(formatEventTiming(next(0.2), at(9), "24h")).toBe("in 1m");
  });

  it("switches to the clock time past an hour, in the chosen format", () => {
    expect(formatEventTiming(next(61), at(9), "24h")).toBe("at 10:01");
    expect(formatEventTiming(next(270), at(9), "12h")).toBe("at 1:30 PM");
  });

  it("shows the time left while an event is on", () => {
    const line = { kind: "now", event: timed("a", at(9), at(9, 50)) } as const;

    expect(formatEventTiming(line, at(9, 30), "24h")).toBe("20m left");
  });

  it("shows when a long event ends", () => {
    const line = { kind: "now", event: timed("a", at(9), at(13)) } as const;

    expect(formatEventTiming(line, at(9, 30), "24h")).toBe("until 13:00");
  });

  it("says all day for all-day events", () => {
    expect(
      formatEventTiming({ kind: "allDay", event: allDay("a") }, at(9)),
    ).toBe("all day");
  });
});

describe("canJoin", () => {
  const meeting = timed("a", at(10), at(11), {
    meetingLink: "https://meet.google.com/abc",
  });

  it("is available from ten minutes before until the end", () => {
    expect(canJoin(meeting, at(10) - JOIN_LEAD_MS - 1)).toBe(false);
    expect(canJoin(meeting, at(10) - JOIN_LEAD_MS)).toBe(true);
    expect(canJoin(meeting, at(10, 30))).toBe(true);
    expect(canJoin(meeting, at(11))).toBe(false);
  });

  it("needs a meeting link", () => {
    expect(canJoin(timed("b", at(10), at(11)), at(10))).toBe(false);
  });
});
