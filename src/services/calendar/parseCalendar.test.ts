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

describe("parseCalendar", () => {
  it("reads a timed event", () => {
    const ics = feed(
      event(
        "UID:a",
        "SUMMARY:Standup",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T091500Z",
        "LOCATION:Room 4",
      ),
    );

    expect(parseCalendar(ics, day, week)).toEqual([
      {
        id: `a@${Date.UTC(2026, 10, 16, 9)}`,
        title: "Standup",
        start: Date.UTC(2026, 10, 16, 9),
        end: Date.UTC(2026, 10, 16, 9, 15),
        allDay: false,
        location: "Room 4",
        meetingLink: undefined,
        url: "https://calendar.google.com/calendar/r/day/2026/11/16",
      },
    ]);
  });

  it("treats all-day events as local days with an exclusive end", () => {
    const ics = feed(
      event(
        "UID:b",
        "SUMMARY:Skibidi's birthday",
        "DTSTART;VALUE=DATE:20261117",
        "DTEND;VALUE=DATE:20261118",
      ),
    );

    const [result] = parseCalendar(ics, day, week);

    expect(result.allDay).toBe(true);
    expect(result.start).toBe(new Date(2026, 10, 17).getTime());
    expect(result.end).toBe(new Date(2026, 10, 18).getTime());
  });

  it("expands recurring events inside the window only", () => {
    const ics = feed(
      event(
        "UID:c",
        "SUMMARY:Daily",
        "DTSTART:20250101T100000Z",
        "DTEND:20250101T103000Z",
        "RRULE:FREQ=DAILY",
      ),
    );

    const result = parseCalendar(ics, day, new Date(Date.UTC(2026, 10, 19)));

    expect(result.map((e) => e.start)).toEqual([
      Date.UTC(2026, 10, 16, 10),
      Date.UTC(2026, 10, 17, 10),
      Date.UTC(2026, 10, 18, 10),
    ]);
  });

  it("skips excluded dates and applies moved occurrences", () => {
    const ics = feed(
      event(
        "UID:d",
        "SUMMARY:Weekly",
        "DTSTART:20261109T100000Z",
        "DTEND:20261109T110000Z",
        "RRULE:FREQ=DAILY;COUNT=4",
        "EXDATE:20261110T100000Z",
      ),
      event(
        "UID:d",
        "SUMMARY:Weekly (moved)",
        "RECURRENCE-ID:20261111T100000Z",
        "DTSTART:20261111T140000Z",
        "DTEND:20261111T150000Z",
      ),
    );

    const result = parseCalendar(
      ics,
      new Date(Date.UTC(2026, 10, 9)),
      new Date(Date.UTC(2026, 10, 13)),
    );

    expect(result.map((e) => [e.title, e.start])).toEqual([
      ["Weekly", Date.UTC(2026, 10, 9, 10)],
      ["Weekly (moved)", Date.UTC(2026, 10, 11, 14)],
      ["Weekly", Date.UTC(2026, 10, 12, 10)],
    ]);
  });

  it("drops cancelled events", () => {
    const ics = feed(
      event(
        "UID:e",
        "SUMMARY:Cancelled",
        "STATUS:CANCELLED",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T100000Z",
      ),
    );

    expect(parseCalendar(ics, day, week)).toEqual([]);
  });

  it("leaves out events outside the window", () => {
    const ics = feed(
      event(
        "UID:f",
        "SUMMARY:Last week",
        "DTSTART:20261110T090000Z",
        "DTEND:20261110T100000Z",
      ),
    );

    expect(parseCalendar(ics, day, week)).toEqual([]);
  });

  it("finds Meet, Zoom and Teams links", () => {
    const ics = feed(
      event(
        "UID:g1",
        "SUMMARY:Meet",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T100000Z",
        "X-GOOGLE-CONFERENCE:https://meet.google.com/abc-defg-hij",
      ),
      event(
        "UID:g2",
        "SUMMARY:Zoom",
        "DTSTART:20261116T110000Z",
        "DTEND:20261116T120000Z",
        "LOCATION:https://us02web.zoom.us/j/123456789?pwd=x",
      ),
      event(
        "UID:g3",
        "SUMMARY:Teams",
        "DTSTART:20261116T130000Z",
        "DTEND:20261116T140000Z",
        "DESCRIPTION:Join: https://teams.microsoft.com/l/meetup-join/19%3ameeting",
      ),
    );

    expect(parseCalendar(ics, day, week).map((e) => e.meetingLink)).toEqual([
      "https://meet.google.com/abc-defg-hij",
      "https://us02web.zoom.us/j/123456789?pwd=x",
      "https://teams.microsoft.com/l/meetup-join/19%3ameeting",
    ]);
  });

  it("sorts by start time", () => {
    const ics = feed(
      event(
        "UID:h2",
        "SUMMARY:Later",
        "DTSTART:20261116T150000Z",
        "DTEND:20261116T160000Z",
      ),
      event(
        "UID:h1",
        "SUMMARY:Sooner",
        "DTSTART:20261116T080000Z",
        "DTEND:20261116T090000Z",
      ),
    );

    expect(parseCalendar(ics, day, week).map((e) => e.title)).toEqual([
      "Sooner",
      "Later",
    ]);
  });

  it("links each event to its page in Google Calendar", () => {
    const ics = feed(
      event(
        "UID:abc123@google.com",
        "SUMMARY:Standup",
        "DTSTART:20261116T090000Z",
        "DTEND:20261116T091500Z",
      ),
    );

    const [result] = parseCalendar(ics, day, week, "me@example.com");

    expect(result.url).toBe(
      `https://calendar.google.com/calendar/event?eid=${encodeURIComponent(btoa("abc123 me@example.com").replace(/=+$/, ""))}`,
    );
  });

  it("links an occurrence of a repeating event by when it was scheduled", () => {
    const ics = feed(
      event(
        "UID:rep@google.com",
        "SUMMARY:Daily",
        "DTSTART:20261109T100000Z",
        "DTEND:20261109T110000Z",
        "RRULE:FREQ=DAILY;COUNT=10",
      ),
    );

    const [first] = parseCalendar(ics, day, week, "me@example.com");
    const eid = decodeURIComponent(first.url.split("eid=")[1]);

    expect(atob(eid)).toBe("rep_20261116T100000Z me@example.com");
  });
});
