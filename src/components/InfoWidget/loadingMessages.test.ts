import { afterEach, describe, expect, it, vi } from "vitest";

import { LOADING_MESSAGES, pickLoadingMessage } from "./loadingMessages";

describe("pickLoadingMessage", () => {
  afterEach(() => vi.restoreAllMocks());

  it("can pick every message, and never goes past the list", () => {
    const picks = [0, 0.5, 0.999999].map((random) => {
      vi.spyOn(Math, "random").mockReturnValue(random);

      return pickLoadingMessage();
    });

    expect(picks).toEqual([
      LOADING_MESSAGES[0],
      LOADING_MESSAGES[7],
      LOADING_MESSAGES.at(-1),
    ]);
  });

  it("has 15 messages of about the same length, without repeats", () => {
    expect(LOADING_MESSAGES).toHaveLength(15);
    expect(new Set(LOADING_MESSAGES).size).toBe(15);

    for (const message of LOADING_MESSAGES) {
      expect(message.length).toBeLessThanOrEqual(34);
    }
  });
});
