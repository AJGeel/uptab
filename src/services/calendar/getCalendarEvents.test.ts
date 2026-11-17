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
