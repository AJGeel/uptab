export type EggId = "Sinterklaas" | "Christmas" | "Oud & Nieuw";

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
  { egg: "Oud & Nieuw", from: [12, 30], to: [12, 30], chance: 0.1 },
  { egg: "Oud & Nieuw", from: [12, 31], to: [12, 31], chance: 0.6 },
  { egg: "Oud & Nieuw", from: [1, 1], to: [1, 1], chance: 0.25 },
];

type Egg = {
  title: string;
  /** The achievement shown when you try to change the photo of an egg. */
  achievement: {
    name: string;
    /** A short explanation of what this is, and what to do. */
    explanation: string;
    /** A CSS gradient laid over the photo in the achievement's banner. */
    tint: string;
  };
  /** Replaces the photo of the day for the whole tab. Bundled, so nothing is fetched. */
  background: {
    src: string;
    /**
     * How the photo looks behind the widgets: light gets dark text, dark gets
     * white text. Light when left out.
     */
    tone?: "light" | "dark";
    author?: string;
    link?: string;
  };
};

export const eggs: Record<EggId, Egg> = {
  Sinterklaas: {
    title: "Zet je schoentje 🥕",
    achievement: {
      name: "Pepernoot Enthusiast",
      explanation:
        "Around Sinterklaas, UpTab now and then swaps your photo for pepernoten and throws some strooigoed. Click the background to throw more.",
      tint: "linear-gradient(135deg, rgb(185 28 28 / 0.85), rgb(180 83 9 / 0.5))",
    },
    background: {
      src: "/images/eggs/sinterklaas.webp",
      author: "Wouter Supardi Salari",
      link: "https://unsplash.com/photos/a-group-of-rocks-on-a-surface-5vQkYmL4qwc",
    },
  },
  Christmas: {
    achievement: {
      name: "Snowflake Catcher",
      explanation:
        "Around Christmas, UpTab now and then swaps your photo for a cosy tree and lets it snow. Click the background for an extra flurry.",
      tint: "linear-gradient(135deg, rgb(4 120 87 / 0.85), rgb(180 83 9 / 0.5))",
    },
    title: "🎶 't is the season to be jolly! 🎄",
    background: {
      src: "/images/eggs/christmas.webp",
      tone: "dark",
      author: "visualsbying",
      link: "https://unsplash.com/photos/close-up-of-a-decorated-christmas-tree-with-lights-yV_8eB2Jz9s",
    },
  },
  "Oud & Nieuw": {
    achievement: {
      name: "Oliebol Optimist",
      explanation:
        "Around New Year's Eve, UpTab now and then puts on a firework show over a plate of oliebollen. Click the background to launch rockets, a few at a time.",
      tint: "linear-gradient(135deg, rgb(30 27 75 / 0.88), rgb(162 28 175 / 0.5))",
    },
    title: "🎆 Happy new year! 🥂",
    background: {
      src: "/images/eggs/oud-en-nieuw.webp",
      tone: "dark",
      author: "Bern Fresen",
      link: "https://unsplash.com/photos/brown-and-white-round-ceramic-bowl-on-brown-wooden-table-qAWrzGCDpzM",
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
