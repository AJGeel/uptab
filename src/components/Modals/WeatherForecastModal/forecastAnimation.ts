import { LineProps, matchAppend } from "recharts";

export const ANIMATION_MS = 400;
/** CSS's `ease`, which is what recharts means by "ease" too. */
export const ANIMATION_EASE: [number, number, number, number] = [
  0.25, 0.1, 0.25, 1,
];

/**
 * The line and the rain bars move together when the days change. Hours that
 * stay slide to their new place, and new hours come in at the end.
 */
export const SERIES_ANIMATION = {
  animationDuration: ANIMATION_MS,
  animationEasing: "ease",
  animationMatchBy: matchAppend,
} as const;

const between = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

/**
 * Takes the place of recharts' own for the line. Hours that stay slide to
 * their new place, as the bars do. New hours unroll from where the line used
 * to end: recharts starts them where the other points' shift suggests, which
 * can lie before that end when the time axis rescales, and a curve through
 * points out of order loops.
 */
export const interpolateLine: NonNullable<
  LineProps["animationInterpolateFn"]
> = (items, progress) => {
  // The first render has nothing to move from: the line draws itself in.
  if (!items) {
    return [];
  }

  const oldEnd = items.findLast((item) => item.status === "matched")?.prev;

  return items.flatMap((item) => {
    if (item.status === "removed") {
      return [];
    }

    if (progress === 1) {
      return [item.next];
    }

    const from = item.status === "matched" ? item.prev : oldEnd;

    return [
      {
        ...item.next,
        x: between(from?.x ?? item.next.x ?? 0, item.next.x ?? 0, progress),
        y: between(from?.y ?? item.next.y ?? 0, item.next.y ?? 0, progress),
      },
    ];
  });
};
