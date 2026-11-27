import { describe, expect, it } from "vitest";

import { createRateLimit } from "./rateLimit";

describe("createRateLimit", () => {
  it("allows a short burst, then says no", () => {
    const time = 0;
    const take = createRateLimit(3, 500, () => time);

    expect([take(), take(), take(), take()]).toEqual([true, true, true, false]);
  });

  it("gives a token back every refill period", () => {
    let time = 0;
    const take = createRateLimit(3, 500, () => time);

    expect([take(), take(), take()]).toEqual([true, true, true]);
    time = 499;
    expect(take()).toBe(false);
    time = 500;
    expect(take()).toBe(true);
    expect(take()).toBe(false);
  });

  it("never holds more than its capacity, however long you wait", () => {
    let time = 0;
    const take = createRateLimit(2, 500, () => time);

    time = 60_000;
    expect([take(), take(), take()]).toEqual([true, true, false]);
  });

  it("holds spamming to the steady pace", () => {
    let time = 0;
    const take = createRateLimit(3, 500, () => time);
    let allowed = 0;

    // Fifty clicks a second, for ten seconds.
    for (; time < 10_000; time += 20) {
      if (take()) {
        allowed++;
      }
    }

    // The burst of three, then two a second.
    expect(allowed).toBeLessThanOrEqual(3 + 20);
  });
});
