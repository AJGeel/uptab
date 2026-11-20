import { describe, expect, it } from "vitest";

import { parseCalendar } from "./parseCalendar";

const feed = (...events: string[]) =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//test//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

const event = (...lines: string[]) =>
  ["BEGIN:VEVENT", ...lines, "END:VEVENT"].join("\r\n");

describe("parseCalendar regressions", () => {
  it("shows an occurrence moved into the window from after it", () => {
    const ics = feed(
      event(
        "UID:m",
        "SUMMARY:Weekly",
        "DTSTART:20261101T100000Z",
        "DTEND:20261101T110000Z",
        "RRULE:FREQ=WEEKLY",
      ),
      event(
        "UID:m",
        "SUMMARY:Weekly (moved)",
        "RECURRENCE-ID:20261122T100000Z",
        "DTSTART:20261121T150000Z",
        "DTEND:20261121T160000Z",
      ),
    );

    const result = parseCalendar(
      ics,
      new Date(Date.UTC(2026, 10, 20)),
      new Date(Date.UTC(2026, 10, 22)),
    );

    expect(result.map((e) => [e.title, e.start])).toEqual([
      ["Weekly (moved)", Date.UTC(2026, 10, 21, 15)],
    ]);
  });

  it("ignores meeting links on lookalike hosts", () => {
    const ics = feed(
      event(
        "UID:z1",
        "SUMMARY:Lookalike",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T100000Z",
        "DESCRIPTION:https://evilzoom.us/j/1",
      ),
      event(
        "UID:z2",
        "SUMMARY:Real",
        "DTSTART:20261116T110000Z",
        "DTEND:20261116T120000Z",
        "DESCRIPTION:https://zoom.us/j/1",
      ),
    );

    const result = parseCalendar(
      ics,
      new Date(Date.UTC(2026, 10, 16)),
      new Date(Date.UTC(2026, 10, 23)),
    );

    expect(result.map((e) => e.meetingLink)).toEqual([
      undefined,
      "https://zoom.us/j/1",
    ]);
  });
});
