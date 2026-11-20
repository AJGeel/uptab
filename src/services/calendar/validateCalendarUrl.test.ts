import { describe, expect, it } from "vitest";

import { validateCalendarUrl } from "./validateCalendarUrl";

const ADDRESS =
  "https://calendar.google.com/calendar/ical/me%40example.com/private-abc123/basic.ics";

describe("validateCalendarUrl", () => {
  it("accepts a Google Calendar address, and says which calendar it is", () => {
    expect(validateCalendarUrl(ADDRESS)).toEqual({
      ok: true,
      url: ADDRESS,
      hasExpectedShape: true,
      connection: {
        provider: "google",
        label: "Google Calendar",
        host: "calendar.google.com",
        openUrl: "https://calendar.google.com",
      },
    });
  });

  it.each([
    ["outlook.live.com", "https://outlook.live.com/calendar/"],
    ["outlook.office365.com", "https://outlook.office.com/calendar/"],
  ])("accepts an Outlook address on %s", (host, openUrl) => {
    const url = `https://${host}/owa/calendar/abc/def/calendar.ics`;

    expect(validateCalendarUrl(url)).toEqual({
      ok: true,
      url,
      hasExpectedShape: true,
      connection: { provider: "outlook", label: "Outlook", host, openUrl },
    });
  });

  it("trims whitespace from a paste", () => {
    expect(validateCalendarUrl(`  ${ADDRESS}\n`)).toMatchObject({
      ok: true,
      url: ADDRESS,
    });
  });

  it("turns webcal:// into https://", () => {
    expect(
      validateCalendarUrl(ADDRESS.replace("https://", "webcal://")),
    ).toMatchObject({ ok: true, url: ADDRESS });
  });

  it.each([
    "",
    "not a url",
    "http://calendar.google.com/calendar/ical/x/basic.ics",
    "https://example.com/calendar/ical/x/basic.ics",
    "https://calendar.google.com.evil.com/x/basic.ics",
    "https://outlook.live.com.evil.com/owa/calendar/x/calendar.ics",
    "http://outlook.live.com/owa/calendar/x/calendar.ics",
    "https://outlook.com/owa/calendar/x/calendar.ics",
    "https://evil.com/?https://calendar.google.com/x",
    "https://user@evil.com@calendar.google.com.evil.com/x",
    "javascript:alert(1)",
  ])("rejects %s", (input) => {
    expect(validateCalendarUrl(input)).toEqual({ ok: false });
  });

  it.each([
    "https://calendar.google.com/calendar/ical/me%40example.com/public/basic.ics",
    "https://outlook.office365.com/owa/calendar/aaa/bbb/calendar.ics",
  ])("knows the shape of %s", (url) => {
    expect(validateCalendarUrl(url)).toMatchObject({ hasExpectedShape: true });
  });

  it.each([
    "https://calendar.google.com/calendar/u/0/r",
    "https://calendar.google.com/calendar/ical/me%40example.com/basic.ics",
    "https://calendar.google.com/calendar/ical/me%40example.com/private-abc/other.ics",
    "https://outlook.live.com/calendar/0/view/month",
    "https://outlook.live.com/owa/calendar/aaa/calendar.ics",
  ])("accepts the site but not the shape of %s", (url) => {
    expect(validateCalendarUrl(url)).toMatchObject({
      ok: true,
      hasExpectedShape: false,
    });
  });
});
