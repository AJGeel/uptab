import { describe, expect, it } from "vitest";

import { CalendarError } from "./calendarError";
import { getCalendarStatus, STALE_AFTER_MS } from "./calendarStatus";

const now = 1_000_000_000;
const base = {
  isConnected: true,
  hasEvents: true,
  error: null,
  dataUpdatedAt: now - 1000,
  now,
};

describe("getCalendarStatus", () => {
  it("waits until the saved address is read", () => {
    expect(getCalendarStatus({ ...base, isConnected: undefined })).toBe(
      "pending",
    );
  });

  it("is not connected without an address, whatever was saved", () => {
    expect(getCalendarStatus({ ...base, isConnected: false })).toBe(
      "notConnected",
    );
  });

  it("is loading before the first events arrive", () => {
    expect(getCalendarStatus({ ...base, hasEvents: false })).toBe("loading");
  });

  it("is ready with fresh events", () => {
    expect(getCalendarStatus(base)).toBe("ready");
  });

  it("turns stale after an hour without an update", () => {
    expect(
      getCalendarStatus({ ...base, dataUpdatedAt: now - STALE_AFTER_MS }),
    ).toBe("ready");
    expect(
      getCalendarStatus({ ...base, dataUpdatedAt: now - STALE_AFTER_MS - 1 }),
    ).toBe("stale");
  });

  it("keeps showing saved events when a refresh failed", () => {
    expect(
      getCalendarStatus({ ...base, error: new CalendarError("offline") }),
    ).toBe("stale");
  });

  it("is unavailable when it failed and nothing is saved", () => {
    expect(
      getCalendarStatus({
        ...base,
        hasEvents: false,
        error: new CalendarError("offline"),
      }),
    ).toBe("unavailable");
  });

  it("asks to reconnect, with or without saved events", () => {
    const error = new CalendarError("reconnect");

    expect(getCalendarStatus({ ...base, error })).toBe("reconnect");
    expect(getCalendarStatus({ ...base, hasEvents: false, error })).toBe(
      "reconnect",
    );
  });
});
