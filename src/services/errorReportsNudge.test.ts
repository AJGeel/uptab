import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({ storage: { local: {} } }));

import { isErrorReportsNudgeDue } from "./errorReportsNudge";

const DAY = 24 * 60 * 60 * 1000;
const firstSeenAt = Date.UTC(2026, 10, 1);

describe("isErrorReportsNudgeDue", () => {
  it("waits a day after the first look", () => {
    const base = { firstSeenAt, isEnabled: false };

    expect(
      isErrorReportsNudgeDue({ ...base, now: firstSeenAt + DAY - 1 }),
    ).toBe(false);
    expect(isErrorReportsNudgeDue({ ...base, now: firstSeenAt + DAY })).toBe(
      true,
    );
  });

  it("keeps being due until it's been closed", () => {
    expect(
      isErrorReportsNudgeDue({
        firstSeenAt,
        isEnabled: false,
        now: firstSeenAt + 30 * DAY,
      }),
    ).toBe(true);
  });

  it("never comes back once closed", () => {
    expect(
      isErrorReportsNudgeDue({
        firstSeenAt,
        isEnabled: false,
        nudgedAt: firstSeenAt + DAY,
        now: firstSeenAt + 365 * DAY,
      }),
    ).toBe(false);
  });

  it("isn't due when error reports are already on", () => {
    expect(
      isErrorReportsNudgeDue({
        firstSeenAt,
        isEnabled: true,
        now: firstSeenAt + 30 * DAY,
      }),
    ).toBe(false);
  });
});
