import type { LinePointItem } from "recharts";
import { describe, expect, it } from "vitest";

import { interpolateLine } from "./forecastAnimation";

const point = (x: number, y: number): LinePointItem => ({ value: y, x, y });
const layout = "horizontal" as const;

// Three hours become five: the first three slide left, two more join.
const growing = [
  { status: "matched", prev: point(0, 10), next: point(0, 10) },
  { status: "matched", prev: point(50, 20), next: point(30, 20) },
  { status: "matched", prev: point(100, 30), next: point(60, 30) },
  { status: "added", next: point(80, 25) },
  { status: "added", next: point(100, 15) },
] as const;

describe("interpolateLine", () => {
  it("draws nothing when there is nothing to move from", () => {
    expect(interpolateLine(null, 0.5, layout)).toEqual([]);
  });

  it("ends on the new points", () => {
    expect(interpolateLine(growing, 1, layout)).toEqual(
      growing.map((item) => item.next),
    );
  });

  it("starts new hours where the line used to end", () => {
    const [, , , firstNew, lastNew] = interpolateLine(growing, 0, layout);

    expect([firstNew.x, firstNew.y]).toEqual([100, 30]);
    expect([lastNew.x, lastNew.y]).toEqual([100, 30]);
  });

  it("slides the hours that stay", () => {
    const [, middle] = interpolateLine(growing, 0.5, layout);

    expect(middle.x).toBe(40);
  });

  it("keeps the points in order the whole way, so the curve never loops", () => {
    for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 0.9]) {
      const xs = interpolateLine(growing, progress, layout).map(
        (item) => item.x ?? 0,
      );

      expect(xs).toEqual([...xs].sort((a, b) => a - b));
    }
  });

  it("drops removed hours", () => {
    const shrinking = [
      { status: "matched", prev: point(0, 10), next: point(0, 10) },
      { status: "removed", prev: point(100, 30) },
    ] as const;

    expect(interpolateLine(shrinking, 0.5, layout)).toHaveLength(1);
  });
});
