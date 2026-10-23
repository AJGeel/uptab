import { describe, expect, it } from "vitest";

import { getFailureHelp, getShortAreaName } from "./locationMessages";

describe("getShortAreaName", () => {
  it("drops the region", () => {
    expect(getShortAreaName("Amersfoort, Utrecht")).toBe("Amersfoort");
  });

  it("keeps a name without a region", () => {
    expect(getShortAreaName("Amersfoort")).toBe("Amersfoort");
  });
});

describe("getFailureHelp", () => {
  it("gives browser specific steps for a blocked permission", () => {
    expect(getFailureHelp("denied", true)).not.toEqual(
      getFailureHelp("denied", false),
    );
  });

  it("has steps for every failure", () => {
    for (const failure of ["denied", "timeout", "unavailable"] as const) {
      expect(getFailureHelp(failure, false).length).toBeGreaterThan(0);
    }
  });
});
