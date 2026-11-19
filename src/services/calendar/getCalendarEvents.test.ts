import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCalendarEvents } from "./getCalendarEvents";

const SECRET =
  "https://calendar.google.com/calendar/ical/x/private-abc/basic.ics";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  contains: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
  storage: { local: { get: mocks.get } },
  permissions: { contains: mocks.contains },
}));

const ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "UID:a",
  "SUMMARY:Standup",
  "DTSTART:20261116T090000Z",
  "DTEND:20261116T091500Z",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

const now = new Date(2026, 10, 16, 8);

describe("getCalendarEvents", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    mocks.get.mockResolvedValue({ calendarUrl: SECRET });
    mocks.contains.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("returns nothing, without fetching, when no calendar is connected", async () => {
    mocks.get.mockResolvedValue({});

    await expect(getCalendarEvents(now)).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the parsed events", async () => {
    fetchMock.mockResolvedValue(new Response(ICS));

    const events = await getCalendarEvents(now);

    expect(events.map((e) => e.title)).toEqual(["Standup"]);
    expect(fetchMock).toHaveBeenCalledWith(SECRET, { cache: "no-store" });
  });

  it("reads an Outlook calendar, linking every event to Outlook", async () => {
    const outlook =
      "https://outlook.live.com/owa/calendar/aaa/bbb/calendar.ics";

    mocks.get.mockResolvedValue({ calendarUrl: outlook });
    fetchMock.mockResolvedValue(new Response(ICS));

    const events = await getCalendarEvents(now);

    expect(events.map((e) => e.url)).toEqual([
      "https://outlook.live.com/calendar/",
    ]);
    expect(mocks.contains).toHaveBeenCalledWith({
      origins: ["https://outlook.live.com/*"],
    });
  });

  it("asks to reconnect for an address from a site that isn't supported", async () => {
    mocks.get.mockResolvedValue({ calendarUrl: "https://example.com/a.ics" });

    await expect(getCalendarEvents(now)).rejects.toMatchObject({
      kind: "reconnect",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks to reconnect when the access was taken back, without fetching", async () => {
    mocks.contains.mockResolvedValue(false);

    await expect(getCalendarEvents(now)).rejects.toMatchObject({
      kind: "reconnect",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([403, 404])("asks to reconnect on a %s", async (status) => {
    fetchMock.mockResolvedValue(new Response("", { status }));

    await expect(getCalendarEvents(now)).rejects.toMatchObject({
      kind: "reconnect",
    });
  });

  it.each([500, 503, 429])("counts a %s as offline", async (status) => {
    fetchMock.mockResolvedValue(new Response("", { status }));

    await expect(getCalendarEvents(now)).rejects.toMatchObject({
      kind: "offline",
    });
  });

  it("counts a failed connection as offline", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(getCalendarEvents(now)).rejects.toMatchObject({
      kind: "offline",
    });
  });

  it("never puts the secret address in an error", async () => {
    fetchMock.mockRejectedValue(new TypeError(`Failed to fetch ${SECRET}`));

    const error = await getCalendarEvents(now).catch((e: Error) => e);

    expect(String(error)).not.toContain("private-abc");
  });
});
