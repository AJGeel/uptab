import { describe, expect, it } from "vitest";

import { pickRendition } from "./pickRendition";

const sources = [1920, 2560, 3840].map((width) => ({
  width,
  url: `https://example.com/${width}.webp`,
}));

describe("pickRendition", () => {
  it("picks the smallest source that's wide enough", () => {
    expect(pickRendition(sources, 2000)?.width).toBe(2560);
    expect(pickRendition(sources, 1280)?.width).toBe(1920);
  });

  it("picks an exact match", () => {
    expect(pickRendition(sources, 2560)?.width).toBe(2560);
  });

  it("falls back to the largest source for very wide screens", () => {
    expect(pickRendition(sources, 5120)?.width).toBe(3840);
    expect(pickRendition([sources[0]], 3000)?.width).toBe(1920);
  });

  it("picks the first of equally wide sources", () => {
    const tie = [
      { width: 1920, url: "https://example.com/a.webp" },
      { width: 1920, url: "https://example.com/b.webp" },
    ];

    expect(pickRendition(tie, 1920)?.url).toBe("https://example.com/a.webp");
  });

  it("returns nothing without sources", () => {
    expect(pickRendition([], 1920)).toBeUndefined();
  });
});
