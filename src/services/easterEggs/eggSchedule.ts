import { differenceInCalendarDays, format, isSameMonth } from "date-fns";

import { EggId, EggRange, getEggRanges } from "./eggs";

export type EggSchedule = {
  egg: EggId;
  /** Each range of days with its own odds, in the order they come. */
  rows: { dates: string; chance: number }[];
  /** The day its first range starts on, to sort by. */
  firstDay: Date;
};

const formatRange = ({ from, to }: EggRange) => {
  if (differenceInCalendarDays(to, from) === 0) {
    return format(from, "d MMM");
  }

  return isSameMonth(from, to)
    ? `${format(from, "d")}–${format(to, "d MMM")}`
    : `${format(from, "d MMM")}–${format(to, "d MMM")}`;
};

/** In the order they come: for the turn of the year, 1 January is the last, not the first. */
const inOrder = (ranges: EggRange[]) => {
  const wraps =
    ranges.some(({ from }) => from.getMonth() === 0 && from.getDate() === 1) &&
    ranges.some(({ to }) => to.getMonth() === 11 && to.getDate() === 31);
  const position = ({ from }: EggRange) =>
    from.getTime() + (wraps && from.getMonth() === 0 ? 366 * 86_400_000 : 0);

  return [...ranges].sort((a, b) => position(a) - position(b));
};

/** What each egg is up to this year, by the day it starts on: for the dev menu. */
export const getEggSchedule = (year: number): EggSchedule[] => {
  const ranges = getEggRanges(year);
  const ids = [...new Set(ranges.map(({ egg }) => egg))];

  return ids
    .map((egg) => {
      const mine = inOrder(ranges.filter((range) => range.egg === egg));

      return {
        egg,
        rows: mine.map((range) => ({
          dates: formatRange(range),
          chance: range.chance,
        })),
        firstDay: mine[0].from,
      };
    })
    .sort((a, b) => a.firstDay.getTime() - b.firstDay.getTime());
};
