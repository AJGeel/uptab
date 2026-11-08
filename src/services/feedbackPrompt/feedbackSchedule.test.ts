import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({ storage: { local: {} } }));

import { isFeedbackDue } from "./feedbackSchedule";

const asked = new Date(2026, 0, 15).getTime();
const on = (month: number, day: number, year = 2026) =>
  new Date(year, month, day).getTime();

const history = { askedAt: asked, firstSeenAt: on(0, 1, 2025) };

describe("isFeedbackDue", () => {
  it("is due a month after the last ask when monthly", () => {
    expect(isFeedbackDue(history, "monthly", on(1, 14))).toBe(false);
    expect(isFeedbackDue(history, "monthly", on(1, 15))).toBe(true);
  });

  it("is due 3 months after the last ask when quarterly", () => {
    expect(isFeedbackDue(history, "quarterly", on(3, 14))).toBe(false);
    expect(isFeedbackDue(history, "quarterly", on(3, 15))).toBe(true);
  });

  it("is never due when never", () => {
    expect(isFeedbackDue(history, "never", on(0, 1, 2100))).toBe(false);
  });

  it("is due 2 weeks after the first look when never asked", () => {
    const firstSeen = { firstSeenAt: asked };

    expect(isFeedbackDue(firstSeen, "quarterly", on(0, 28))).toBe(false);
    expect(isFeedbackDue(firstSeen, "quarterly", on(0, 29))).toBe(true);
  });
});
