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

const day = new Date(Date.UTC(2026, 10, 16, 0, 0));
const week = new Date(Date.UTC(2026, 10, 23, 0, 0));

describe("parseCalendar for calendars other than Google's", () => {
  it("sends every event to one page when they can't be linked one by one", () => {
    const ics = feed(
      event(
        "UID:abc123@google.com",
        "SUMMARY:Standup",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T091500Z",
      ),
    );

    const [result] = parseCalendar(ics, day, week, {
      linkTo: "https://outlook.live.com/calendar/",
    });

    expect(result.url).toBe("https://outlook.live.com/calendar/");
  });

  it("finds the Teams link Outlook puts in its own field", () => {
    const ics = feed(
      event(
        "UID:o1",
        "SUMMARY:Sync",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T100000Z",
        "X-MICROSOFT-SKYPETEAMSMEETINGURL:https://teams.microsoft.com/l/meetup-join/19%3ameeting_abc%40thread.v2/0",
      ),
    );

    const [result] = parseCalendar(ics, day, week);

    expect(result.meetingLink).toBe(
      "https://teams.microsoft.com/l/meetup-join/19%3ameeting_abc%40thread.v2/0",
    );
  });
});
