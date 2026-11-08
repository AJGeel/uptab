import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({ storage: { local: {} } }));

import { isFeedbackDue } from "./feedbackSchedule";

const asked = new Date(2026, 0, 15).getTime();
const on = (month: number, day: number, year = 2026) =>
  new Date(year, month, day).getTime();

describe("isFeedbackDue", () => {
  it("is due a month after the last ask when monthly", () => {
    expect(isFeedbackDue(asked, "monthly", on(1, 14))).toBe(false);
    expect(isFeedbackDue(asked, "monthly", on(1, 15))).toBe(true);
  });

  it("is due 3 months after the last ask when quarterly", () => {
    expect(isFeedbackDue(asked, "quarterly", on(3, 14))).toBe(false);
    expect(isFeedbackDue(asked, "quarterly", on(3, 15))).toBe(true);
  });

  it("is never due when never", () => {
    expect(isFeedbackDue(asked, "never", on(0, 1, 2100))).toBe(false);
  });
});
