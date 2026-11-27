import { Burst } from "./particles";

export const random = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const pick = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

/** Six-digit hex, so a glow can fade to transparent. */
export const PALETTES = [
  ["#ffd166", "#ffb703"],
  ["#ff5d73", "#ff9aa2"],
  ["#4cc9f0", "#a0e7ff"],
  ["#ffffff", "#dbe4ff"],
  ["#b388ff", "#e0c3ff"],
  ["#7bd88f", "#d2ffd9"],
] as const;

const GOLD = ["#ffcf6b", "#ffe9a8", "#ffb347"];

export type Palette = (typeof PALETTES)[number];

export type Shell = (
  x: number,
  y: number,
  scale: number,
  palette: Palette,
) => void;

type Tools = {
  throwPieces: (burst: Burst) => void;
  later: (callback: () => void, delay: number) => void;
};

/** The kinds of shell a rocket can burst into. Every spark burns with a tail. */
export const createShells = ({ throwPieces, later }: Tools): Shell[] => {
  /** Sparks from a point: a ball unless the angle and spread say otherwise. */
  const sparks = (
    x: number,
    y: number,
    piece: Partial<Burst> & Pick<Burst, "count" | "speed">,
  ) =>
    throwPieces({
      x,
      y,
      angle: 90,
      spread: 360,
      gravity: 0.05,
      drag: 0.965,
      size: [3, 5],
      life: [80, 120],
      spin: [0, 0],
      shape: "circle",
      colors: ["#ffffff"],
      trail: 11,
      ...piece,
    });

  /** A soft flash of light, where the shell goes off. */
  const flash = (x: number, y: number, size: number, color: string) =>
    throwPieces({
      x,
      y,
      angle: 90,
      spread: 0,
      count: 1,
      speed: [0, 0],
      gravity: 0,
      size: [size, size * 1.2],
      life: [14, 18],
      spin: [0, 0],
      shape: "glow",
      colors: [color],
    });

  /** Little sparkles going off all over the shell, one by one, as it fades. */
  const twinkle = (x: number, y: number, radius: number, count: number) => {
    for (let index = 0; index < count; index++) {
      const angle = random(0, Math.PI * 2);
      const distance = Math.sqrt(Math.random()) * radius;

      later(
        () =>
          sparks(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance,
            {
              count: 3,
              speed: [0.3, 1.2],
              gravity: 0.02,
              drag: 0.95,
              size: [2, 3.5],
              life: [18, 30],
              colors: ["#ffffff", "#fff3b0"],
              trail: 0,
            },
          ),
        random(250, 1100),
      );
    }
  };

  return [
    // A peony: a ball of colour with a softer one inside, and twinkle after.
    (x, y, scale, palette) => {
      flash(x, y, 170 * scale, palette[0]);
      sparks(x, y, {
        count: Math.round(random(60, 85)),
        speed: [5.5 * scale, 8 * scale],
        colors: [...palette],
        trail: 10,
      });
      sparks(x, y, {
        count: 26,
        speed: [2 * scale, 4.5 * scale],
        gravity: 0.04,
        drag: 0.96,
        life: [55, 85],
        colors: ["#ffffff", palette[0]],
        trail: 5,
      });
      twinkle(x, y, 140 * scale, 14);
    },
    // Two rings, one in the other, in two colours.
    (x, y, scale, palette) => {
      flash(x, y, 150 * scale, palette[1]);
      const tilt = random(0, 360);

      for (let index = 0; index < 34; index++) {
        sparks(x, y, {
          count: 1,
          angle: tilt + (index / 34) * 360,
          spread: 0,
          speed: [7.2 * scale, 7.2 * scale],
          colors: [palette[0]],
          trail: 7,
        });
      }
      for (let index = 0; index < 20; index++) {
        sparks(x, y, {
          count: 1,
          angle: tilt + 6 + (index / 20) * 360,
          spread: 0,
          speed: [4.2 * scale, 4.2 * scale],
          colors: [palette[1]],
          life: [65, 100],
          trail: 6,
        });
      }
    },
    // A willow: gold that hangs and droops in long glittering strands.
    (x, y, scale) => {
      flash(x, y, 190 * scale, "#ffcf6b");
      sparks(x, y, {
        count: 70,
        speed: [3 * scale, 6.2 * scale],
        gravity: 0.085,
        drag: 0.975,
        life: [130, 185],
        colors: GOLD,
        trail: 15,
        flicker: 0.18,
      });
      twinkle(x, y, 170 * scale, 10);
    },
    // A palm: a few thick arms that arch out and fall.
    (x, y, scale, palette) => {
      flash(x, y, 160 * scale, "#ffe9a8");
      const arms = Math.round(random(6, 7));
      const tilt = random(0, 360);

      for (let arm = 0; arm < arms; arm++) {
        sparks(x, y, {
          count: 9,
          angle: tilt + (arm / arms) * 360,
          spread: 9,
          speed: [3.5 * scale, 7.5 * scale],
          gravity: 0.065,
          drag: 0.968,
          life: [90, 130],
          colors: [GOLD[0], palette[1], "#ffffff"],
          trail: 12,
          flicker: 0.1,
        });
      }
    },
    // A crossette: sparks that each split again, a little further out.
    (x, y, scale, palette) => {
      flash(x, y, 150 * scale, palette[0]);
      const spokes = 12;
      const speed = 6.5 * scale;
      const frames = 38;
      // How far a spark has got by then, with the drag it's thrown with.
      const reach = (speed * (1 - 0.97 ** frames)) / (1 - 0.97);

      for (let index = 0; index < spokes; index++) {
        const angle = (index / spokes) * 360 + random(-4, 4);
        const radians = (angle * Math.PI) / 180;
        const splitX = x + Math.cos(radians) * reach;
        const splitY = y - Math.sin(radians) * reach + 14;

        sparks(x, y, {
          count: 1,
          angle,
          spread: 0,
          speed: [speed, speed],
          drag: 0.97,
          life: [frames + 6, frames + 6],
          colors: [palette[0]],
          trail: 7,
        });
        later(
          () =>
            sparks(splitX, splitY, {
              count: 6,
              speed: [1.5, 3.6],
              gravity: 0.04,
              drag: 0.96,
              life: [40, 62],
              colors: [palette[1], "#ffffff"],
              trail: 5,
            }),
          (frames / 60) * 1000,
        );
      }
    },
  ];
};
