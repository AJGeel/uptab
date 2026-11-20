import { afterEach, describe, expect, it, vi } from "vitest";

import { connectCalendar, disconnectCalendar } from "./calendarConnection";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  request: vi.fn(),
  remove: vi.fn(),
  set: vi.fn(),
  removeStored: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
  permissions: { request: mocks.request, remove: mocks.remove },
  storage: {
    local: { get: mocks.get, set: mocks.set, remove: mocks.removeStored },
  },
}));

const ORIGIN = { origins: ["https://calendar.google.com/*"] };

describe("calendar connection", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("asks the browser in the same tick as the click", () => {
    mocks.request.mockResolvedValue(true);

    // No await: browsers only prompt straight from a user action.
    void connectCalendar("https://calendar.google.com/x/basic.ics");

    expect(mocks.request).toHaveBeenCalledWith(ORIGIN);
  });

  it("keeps the address once allowed", async () => {
    mocks.request.mockResolvedValue(true);

    await expect(
      connectCalendar("https://calendar.google.com/x"),
    ).resolves.toBe(true);
    expect(mocks.set).toHaveBeenCalledWith({
      calendarUrl: "https://calendar.google.com/x",
    });
  });

  it("keeps nothing when declined", async () => {
    mocks.request.mockResolvedValue(false);

    await expect(
      connectCalendar("https://calendar.google.com/x"),
    ).resolves.toBe(false);
    expect(mocks.set).not.toHaveBeenCalled();
  });

  it("asks only for the site the address is on", () => {
    mocks.request.mockResolvedValue(true);

    void connectCalendar(
      "https://outlook.live.com/owa/calendar/a/b/calendar.ics",
    );

    expect(mocks.request).toHaveBeenCalledWith({
      origins: ["https://outlook.live.com/*"],
    });
  });

  it("forgets the address and gives the access back", async () => {
    mocks.get.mockResolvedValue({
      calendarUrl: "https://calendar.google.com/x/basic.ics",
    });

    await disconnectCalendar();

    expect(mocks.removeStored).toHaveBeenCalledWith("calendarUrl");
    expect(mocks.remove).toHaveBeenCalledWith(ORIGIN);
  });

  it("gives back only the access of the calendar it was connected to", async () => {
    mocks.get.mockResolvedValue({
      calendarUrl:
        "https://outlook.office365.com/owa/calendar/a/b/calendar.ics",
    });

    await disconnectCalendar();

    expect(mocks.remove).toHaveBeenCalledWith({
      origins: ["https://outlook.office365.com/*"],
    });
  });
});
