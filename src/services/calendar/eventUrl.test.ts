import { describe, expect, it } from "vitest";

import {
  getCalendarId,
  getDayUrl,
  getEventUrl,
  getMapsUrl,
  isPlace,
} from "./eventUrl";

const decodeEid = (url: string) =>
  atob(decodeURIComponent(url.split("eid=")[1]));

describe("getCalendarId", () => {
  it("reads the calendar's id, and never the secret", () => {
    const feed =
      "https://calendar.google.com/calendar/ical/me%40example.com/private-abc123/basic.ics";

    expect(getCalendarId(feed)).toBe("me@example.com");
  });

  it("is empty for an address of another shape", () => {
    expect(getCalendarId("https://calendar.google.com/x/basic.ics")).toBe(
      undefined,
    );
  });
});

describe("getEventUrl", () => {
  const base = {
    uid: "abc123@google.com",
    start: new Date(2026, 10, 17, 9).getTime(),
    isAllDay: false,
    calendarId: "me@example.com",
  };

  it("builds Google's event address from the event and calendar ids", () => {
    expect(decodeEid(getEventUrl(base))).toBe("abc123 me@example.com");
  });

  it("names the occurrence of a repeating event", () => {
    const url = getEventUrl({
      ...base,
      instance: new Date(Date.UTC(2026, 10, 17, 9)),
    });

    expect(decodeEid(url)).toBe("abc123_20261117T090000Z me@example.com");
  });

  it("names an all-day occurrence by its date", () => {
    const url = getEventUrl({
      ...base,
      isAllDay: true,
      instance: new Date(Date.UTC(2026, 10, 17)),
    });

    expect(decodeEid(url)).toBe("abc123_20261117 me@example.com");
  });

  it("falls back to the day for events it can't build a link for", () => {
    const day = getDayUrl(base.start);

    expect(getEventUrl({ ...base, calendarId: undefined })).toBe(day);
    expect(getEventUrl({ ...base, uid: "abc123@example.org" })).toBe(day);
    expect(day).toBe("https://calendar.google.com/calendar/r/day/2026/11/17");
  });
});

describe("maps", () => {
  it("searches for the place as written", () => {
    expect(getMapsUrl("Café Zuid, Amsterdam")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Zuid%2C%20Amsterdam",
    );
  });

  it("doesn't count a web address as a place", () => {
    expect(isPlace("https://us02web.zoom.us/j/123")).toBe(false);
    expect(isPlace("Restaurant Noord, Amsterdam")).toBe(true);
  });
});
