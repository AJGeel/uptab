import { afterEach, describe, expect, it, vi } from "vitest";

import { connectCalendar, disconnectCalendar } from "./calendarConnection";

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  remove: vi.fn(),
  set: vi.fn(),
  removeStored: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
  permissions: { request: mocks.request, remove: mocks.remove },
  storage: { local: { set: mocks.set, remove: mocks.removeStored } },
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

  it("forgets the address and gives the access back", async () => {
    await disconnectCalendar();

    expect(mocks.removeStored).toHaveBeenCalledWith("calendarUrl");
    expect(mocks.remove).toHaveBeenCalledWith(ORIGIN);
  });
});
