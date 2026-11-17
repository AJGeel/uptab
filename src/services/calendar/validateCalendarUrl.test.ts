import { describe, expect, it } from "vitest";

import { validateCalendarUrl } from "./validateCalendarUrl";

const ADDRESS =
  "https://calendar.google.com/calendar/ical/me%40example.com/private-abc123/basic.ics";

describe("validateCalendarUrl", () => {
  it("accepts a Google Calendar address", () => {
    expect(validateCalendarUrl(ADDRESS)).toEqual({ ok: true, url: ADDRESS });
  });

  it("trims whitespace from a paste", () => {
    expect(validateCalendarUrl(`  ${ADDRESS}\n`)).toEqual({
      ok: true,
      url: ADDRESS,
    });
  });

  it("turns webcal:// into https://", () => {
    expect(
      validateCalendarUrl(ADDRESS.replace("https://", "webcal://")),
    ).toEqual({ ok: true, url: ADDRESS });
  });

  it.each([
    "",
    "not a url",
    "http://calendar.google.com/calendar/ical/x/basic.ics",
    "https://example.com/calendar/ical/x/basic.ics",
    "https://calendar.google.com.evil.com/x/basic.ics",
    "https://evil.com/?https://calendar.google.com/x",
    "https://user@evil.com@calendar.google.com.evil.com/x",
    "javascript:alert(1)",
  ])("rejects %s", (input) => {
    expect(validateCalendarUrl(input)).toEqual({ ok: false });
  });
});
