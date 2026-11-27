export type EggId = "Sinterklaas" | "Christmas";

/** A month (1–12) and a day, in any year. */
type MonthDay = readonly [month: number, day: number];

export type EggRange = {
  egg: EggId;
  from: MonthDay;
  to: MonthDay;
  /** The odds, from 0 to 1, that a new tab shows the egg. */
  chance: number;
};

/*
 * Ranges are inclusive, in local time, and must not overlap: `pickEgg` takes
 * the first match. The odds build up towards the day itself.
 */
export const eggRanges: EggRange[] = [
  { egg: "Sinterklaas", from: [11, 15], to: [12, 1], chance: 0.05 },
  { egg: "Sinterklaas", from: [12, 2], to: [12, 4], chance: 0.25 },
  { egg: "Sinterklaas", from: [12, 5], to: [12, 5], chance: 1 },
  { egg: "Christmas", from: [12, 15], to: [12, 23], chance: 0.1 },
  { egg: "Christmas", from: [12, 24], to: [12, 26], chance: 0.5 },
];

type Egg = {
  title: string;
  /** Replaces the photo of the day for the whole tab. Bundled, so nothing is fetched. */
  background: { src: string; author?: string; link?: string };
};

export const eggs: Record<EggId, Egg> = {
  Sinterklaas: {
    title: "Zet je schoentje 🥕",
    background: {
      src: "/images/eggs/sinterklaas.webp",
      author: "Wouter Supardi Salari",
      link: "https://unsplash.com/photos/a-group-of-rocks-on-a-surface-5vQkYmL4qwc",
    },
  },
  Christmas: {
    title: "🎶 't is the season to be jolly! 🎄",
    background: {
      src: "/images/eggs/christmas.webp",
      author: "Mariana Rascão",
      link: "https://unsplash.com/photos/red-round-fruit-on-white-plastic-container-S4GOLEDaKw4",
    },
  },
};

const toOrdinal = ([month, day]: MonthDay) => month * 100 + day;

export const isInRange = (date: Date, { from, to }: EggRange) => {
  const today = toOrdinal([date.getMonth() + 1, date.getDate()]);

  return today >= toOrdinal(from) && today <= toOrdinal(to);
};

/** The egg for today, or nothing. `random` is a number from 0 up to 1, for testing. */
export const pickEgg = (
  date: Date,
  random: number,
  ranges: EggRange[] = eggRanges,
): EggId | undefined => {
  const range = ranges.find((candidate) => isInRange(date, candidate));

  return range && random < range.chance ? range.egg : undefined;
};
