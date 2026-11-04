import { describe, expect, it } from "vitest";

import { moveHighlight } from "./moveHighlight";

describe("moveHighlight", () => {
  it("has nothing to highlight in an empty list", () => {
    expect(moveHighlight(undefined, "ArrowDown", 0)).toBeUndefined();
    expect(moveHighlight(2, "ArrowUp", 0)).toBeUndefined();
  });

  it("starts at the top going down, and at the bottom going up", () => {
    expect(moveHighlight(undefined, "ArrowDown", 5)).toBe(0);
    expect(moveHighlight(undefined, "ArrowUp", 5)).toBe(4);
  });

  it("moves one item at a time", () => {
    expect(moveHighlight(1, "ArrowDown", 5)).toBe(2);
    expect(moveHighlight(3, "ArrowUp", 5)).toBe(2);
  });

  it("stops at the ends instead of wrapping", () => {
    expect(moveHighlight(4, "ArrowDown", 5)).toBe(4);
    expect(moveHighlight(0, "ArrowUp", 5)).toBe(0);
  });

  it("recovers when the list got shorter than the highlight", () => {
    expect(moveHighlight(9, "ArrowDown", 3)).toBe(2);
    expect(moveHighlight(9, "ArrowUp", 3)).toBe(1);
  });
});
