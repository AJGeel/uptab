import {
  endOfDay,
  getDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";

export type EggId =
  | "Koningsdag"
  | "Bevrijdingsdag"
  /*
   * TODO(sint-maarten): parked until it has a photo. Search for the tag to bring it back.
   * | "Sint-Maarten"
   */
  | "Sinterklaas"
  | "Christmas"
  | "Oud & Nieuw";

export type EggRange = {
  egg: EggId;
  /** The first day. */
  from: Date;
  /** The last day: it counts until the end of it. */
  to: Date;
  /** The odds, from 0 to 1, that a new tab shows the egg. */
  chance: number;
};

/** Koningsdag is on 27 April, or the day before when that's a Sunday. */
const getKoningsdag = (year: number) => {
  const day = new Date(year, 3, 27);

  return getDay(day) === 0 ? new Date(year, 3, 26) : day;
};

/*
 * The ranges of a year, in local time. They must not overlap: `pickEgg` takes
 * the first match. The odds build up towards the day itself, and the quieter
 * days stay below 100% on purpose, so they feel like a surprise. Months in a
 * Date start at 0: 0 is January and 11 is December.
 */
export const getEggRanges = (year: number): EggRange[] => {
  const koningsdag = getKoningsdag(year);

  return [
    {
      egg: "Oud & Nieuw",
      from: new Date(year, 0, 1),
      to: new Date(year, 0, 1),
      chance: 0.25,
    },
    // Koningsnacht, the evening before, and then the day itself.
    {
      egg: "Koningsdag",
      from: subDays(koningsdag, 1),
      to: subDays(koningsdag, 1),
      chance: 0.2,
    },
    { egg: "Koningsdag", from: koningsdag, to: koningsdag, chance: 0.6 },
    {
      egg: "Bevrijdingsdag",
      from: new Date(year, 4, 5),
      to: new Date(year, 4, 5),
      chance: 0.4,
    },
    /*
     * TODO(sint-maarten): parked until it has a photo.
     * {
     *   egg: "Sint-Maarten",
     *   from: new Date(year, 10, 9),
     *   to: new Date(year, 10, 10),
     *   chance: 0.15,
     * },
     * {
     *   egg: "Sint-Maarten",
     *   from: new Date(year, 10, 11),
     *   to: new Date(year, 10, 11),
     *   chance: 0.55,
     * },
     */
    {
      egg: "Sinterklaas",
      from: new Date(year, 10, 15),
      to: new Date(year, 11, 1),
      chance: 0.05,
    },
    {
      egg: "Sinterklaas",
      from: new Date(year, 11, 2),
      to: new Date(year, 11, 4),
      chance: 0.25,
    },
    {
      egg: "Sinterklaas",
      from: new Date(year, 11, 5),
      to: new Date(year, 11, 5),
      chance: 1,
    },
    {
      egg: "Christmas",
      from: new Date(year, 11, 15),
      to: new Date(year, 11, 23),
      chance: 0.1,
    },
    {
      egg: "Christmas",
      from: new Date(year, 11, 24),
      to: new Date(year, 11, 26),
      chance: 0.5,
    },
    {
      egg: "Oud & Nieuw",
      from: new Date(year, 11, 30),
      to: new Date(year, 11, 30),
      chance: 0.1,
    },
    {
      egg: "Oud & Nieuw",
      from: new Date(year, 11, 31),
      to: new Date(year, 11, 31),
      chance: 0.6,
    },
  ];
};

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
  Koningsdag: {
    title: "Prins Pils 🍻",
    achievement: {
      name: "Oranje Boven",
      explanation:
        "On Koningsdag, UpTab now and then turns your tab orange and fires off confetti. Click the background for more. Don't drink too much, you've likely got things to do tomorrow...",
      tint: "linear-gradient(135deg, rgb(234 88 12 / 0.88), rgb(251 146 60 / 0.5))",
    },
    background: {
      src: "/images/eggs/koningsdag.webp",
      tone: "dark",
      author: "Timothy Dykes",
      link: "https://unsplash.com/photos/a-close-up-of-a-glass-of-beer-with-drops-of-water-Lq1rOaigDoY",
    },
  },
  Bevrijdingsdag: {
    title: "Bevrijdingsdag 🕊️",
    achievement: {
      name: "Never Again",
      explanation:
        "On Bevrijdingsdag, UpTab now and then lets a few small flags drift by. Click the background for a few more.",
      tint: "linear-gradient(135deg, rgb(30 64 175 / 0.85), rgb(220 38 38 / 0.45))",
    },
    background: {
      src: "/images/eggs/bevrijdingsdag.webp",
      author: "Kyle Hang",
      link: "https://unsplash.com/photos/dutch-flag-on-a-classical-building-against-blue-sky-QNrXz_Y83jc",
    },
  },
  /*
   * TODO(sint-maarten): parked until it has a photo (and a tone, and a credit).
   * The music notes effect is done: effects/notes.ts. To bring it back, also
   * enable it in effects/index.ts and in the icons of EggAchievement.tsx, and
   * the tests in eggs.test.ts and eggSchedule.test.ts.
   * "Sint-Maarten": {
   *   title: "Sint Maarten, Sint Maarten 🎶",
   *   achievement: {
   *     name: "Doorstep Diva",
   *     explanation:
   *       "Around Sint-Maarten, UpTab now and then lets a song drift up your tab, like kids singing at the door. Click the background for another verse.",
   *     tint: "linear-gradient(135deg, rgb(120 53 15 / 0.85), rgb(245 158 11 / 0.45))",
   *   },
   *   background: { src: "/images/eggs/sint-maarten.webp" }, // plus tone and credit
   * },
   */
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

export const isInRange = (date: Date, { from, to }: EggRange) =>
  isWithinInterval(date, { start: startOfDay(from), end: endOfDay(to) });

/** The egg for today, or nothing. `random` is a number from 0 up to 1, for testing. */
export const pickEgg = (
  date: Date,
  random: number,
  ranges: EggRange[] = getEggRanges(date.getFullYear()),
): EggId | undefined => {
  const range = ranges.find((candidate) => isInRange(date, candidate));

  return range && random < range.chance ? range.egg : undefined;
};
