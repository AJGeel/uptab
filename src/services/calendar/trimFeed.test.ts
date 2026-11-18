import { describe, expect, it } from "vitest";

import { parseCalendar } from "./parseCalendar";
import { trimFeed } from "./trimFeed";

const from = new Date(2026, 10, 17); // Tue 17 Nov 2026
const to = new Date(2026, 10, 19);

const feed = (...events: string[]) =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    ...events.map((lines) => `BEGIN:VEVENT\n${lines}\nEND:VEVENT`),
    "END:VCALENDAR",
  ].join("\n");

const titles = (ics: string) =>
  parseCalendar(ics, from, to).map((event) => event.title);

describe("trimFeed", () => {
  it("drops events far outside the window and keeps the ones near it", () => {
    const ics = feed(
      "UID:old\nSUMMARY:Old\nDTSTART:20200101T100000Z\nDTEND:20200101T110000Z",
      "UID:soon\nSUMMARY:Soon\nDTSTART:20261117T100000Z\nDTEND:20261117T110000Z",
      "UID:later\nSUMMARY:Later\nDTSTART:20270101T100000Z\nDTEND:20270101T110000Z",
    );

    const trimmed = trimFeed(ics, from, to);

    expect(trimmed).toContain("SUMMARY:Soon");
    expect(trimmed).not.toContain("SUMMARY:Old");
    expect(trimmed).not.toContain("SUMMARY:Later");
  });

  it("drops a series that ended before the window, and keeps one that hasn't", () => {
    const ics = feed(
      "UID:over\nSUMMARY:Over\nDTSTART:20240102T100000Z\nDTEND:20240102T110000Z\nRRULE:FREQ=WEEKLY;UNTIL=20250101T000000Z",
      "UID:going\nSUMMARY:Going\nDTSTART:20240102T100000Z\nDTEND:20240102T110000Z\nRRULE:FREQ=WEEKLY",
    );

    const trimmed = trimFeed(ics, from, to);

    expect(trimmed).not.toContain("SUMMARY:Over");
    expect(trimmed).toContain("SUMMARY:Going");
  });

  it("keeps the same occurrences when it starts a series later", () => {
    // 150 weeks after its first day, so every second Tuesday lines up with 17 Nov.
    const ics = feed(
      "UID:biweekly\nSUMMARY:Every other\nDTSTART:20240102T100000Z\nDTEND:20240102T110000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2",
      "UID:daily\nSUMMARY:Weekdays\nDTSTART:20240102T080000Z\nDTEND:20240102T083000Z\nRRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
    );

    const days = parseCalendar(ics, from, new Date(2026, 10, 25)).map(
      (event) => `${event.title} ${new Date(event.start).getDate()}`,
    );

    expect(days).toEqual(
      expect.arrayContaining([
        "Every other 17",
        "Weekdays 17",
        "Weekdays 18",
        "Weekdays 24",
      ]),
    );
    expect(days).not.toContain("Every other 24");
    expect(days).not.toContain("Weekdays 21");
  });

  it("leaves a series with a count alone, as the count runs from its first day", () => {
    const ics = feed(
      "UID:counted\nSUMMARY:Counted\nDTSTART:20240102T100000Z\nDTEND:20240102T110000Z\nRRULE:FREQ=DAILY;COUNT=5000",
    );

    expect(trimFeed(ics, from, to)).toContain("DTSTART:20240102T100000Z");
    expect(titles(ics)).toEqual(["Counted", "Counted"]);
  });

  it("keeps a changed occurrence when its series is kept, even far away", () => {
    const ics = feed(
      "UID:s\nSUMMARY:Series\nDTSTART:20260105T100000Z\nDTEND:20260105T110000Z\nRRULE:FREQ=WEEKLY",
      "UID:s\nSUMMARY:Moved\nRECURRENCE-ID:20261117T100000Z\nDTSTART:20261201T100000Z\nDTEND:20261201T110000Z",
    );

    expect(trimFeed(ics, from, to)).toContain("SUMMARY:Moved");
    expect(titles(ics)).not.toContain("Series");
  });

  it("keeps the time zones and anything it can't read", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "BEGIN:VTIMEZONE\nTZID:Europe/Amsterdam\nEND:VTIMEZONE",
      "BEGIN:VEVENT\nUID:odd\nSUMMARY:Odd\nDTSTART:not-a-date\nEND:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const trimmed = trimFeed(ics, from, to);

    expect(trimmed).toContain("TZID:Europe/Amsterdam");
    expect(trimmed).toContain("SUMMARY:Odd");
  });
});
