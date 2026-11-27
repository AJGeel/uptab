import { createParticles, iconShape } from "./particles";
import { Effect } from "./types";

// Phosphor's Heart (fill): the pink and white hearts of the strooigoed.
const HEART_PATH =
  "M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z";

// Phosphor's Carrot (fill): for the one carrot in every handful, left out for the horse.
const CARROT_PATH =
  "M232,80H199.44a64,64,0,0,1-10.19,77.26c-8.52,8.69-19.61,16.92-31.85,24.51a4,4,0,0,1-4.91-.59l-34.84-34.84a8,8,0,0,0-11.49.18,8.23,8.23,0,0,0,.41,11.38l29.88,29.88a4,4,0,0,1-1,6.39C95.74,214.79,53,228.54,46.78,230.48a16,16,0,0,1-21.26-21.26c2.73-8.71,29-90.27,64.86-133.35a4,4,0,0,1,5.9-.26l42.05,42.06a8,8,0,0,0,11.71-.43,8.19,8.19,0,0,0-.6-11.1L108.08,64.78a4,4,0,0,1,.63-6.18,64,64,0,0,1,67.28-2V24a8,8,0,0,1,8.54-8A8.18,8.18,0,0,1,192,24.28V52.69l26.34-26.35a8,8,0,0,1,11.32,11.32L203.31,64h28.41A8.18,8.18,0,0,1,240,71.47,8,8,0,0,1,232,80Z";

// A thin dark border, so the candy stands out against the photo.
const OUTLINE = "rgba(45, 22, 10, 0.85)";

const random = (min: number, max: number) => min + Math.random() * (max - min);

type Aim = {
  x: number;
  y: number;
  angle: number;
  spread: number;
  /** The speed of the throw, in pixels per frame. */
  speed: number;
};

/** A handful of strooigoed, thrown in from a corner now and then, and a burst wherever you click. */
export const startCandy = (): Effect => {
  const { throwPieces, destroy } = createParticles();
  const heart = iconShape(HEART_PATH);
  const carrot = iconShape(CARROT_PATH);
  let timeout: ReturnType<typeof setTimeout>;
  const pending = new Set<ReturnType<typeof setTimeout>>();

  const later = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      pending.delete(timer);
      callback();
    }, delay);

    pending.add(timer);
  };

  /** Small volleys within a blink, each a little different, like a handful thrown. */
  const scatter = (aim: Aim, amount = 1) => {
    const volleys = (count: number) =>
      Math.max(1, Math.round(random(count * 0.6, count * 1.4) * amount));
    const volley = (speed: number) => ({
      x: aim.x,
      y: aim.y,
      angle: aim.angle + random(-10, 10),
      spread: aim.spread,
      speed: [speed * 0.7, speed * 1.1] as const,
      gravity: random(0.32, 0.46),
      drag: random(0.982, 0.988),
    });

    // Pepernoten
    for (let index = 0; index < volleys(6); index++) {
      later(
        () =>
          throwPieces({
            ...volley(aim.speed),
            count: Math.round(random(1, 4)),
            size: [14, 24],
            life: [150, 240],
            spin: [2, 9],
            squash: random(0.7, 0.9),
            shape: "circle",
            outline: OUTLINE,
            colors: ["#a0623a", "#b8733f", "#8a4f2b", "#c98a52"],
          }),
        random(0, 90),
      );
    }
    // Green pastilles, for contrast
    for (let index = 0; index < volleys(2); index++) {
      later(
        () =>
          throwPieces({
            ...volley(aim.speed),
            count: Math.round(random(1, 3)),
            size: [14, 22],
            life: [150, 240],
            spin: [2, 8],
            squash: random(0.75, 0.9),
            shape: "circle",
            outline: OUTLINE,
            colors: ["#8BAE8E", "#D4E8C9"],
          }),
        random(0, 90),
      );
    }
    // Hearts, turning slowly as they fall
    for (let index = 0; index < volleys(2); index++) {
      later(
        () =>
          throwPieces({
            ...volley(aim.speed),
            count: Math.round(random(1, 2)),
            size: [26, 38],
            life: [170, 260],
            spin: [1, 5],
            sway: 0.5,
            shape: heart,
            outline: OUTLINE,
            colors: ["#f4a6c0", "#ffffff", "#f7b267", "#8BAE8E", "#D4E8C9"],
          }),
        random(0, 90),
      );
    }
    // And always one carrot, a little slower and bigger, tumbling.
    later(
      () =>
        throwPieces({
          ...volley(aim.speed * 0.85),
          count: 1,
          size: [50, 66],
          life: [190, 280],
          spin: [1.5, 4],
          sway: 0.4,
          shape: carrot,
          outline: OUTLINE,
          colors: ["#f28c28"],
        }),
      random(0, 90),
    );
  };

  const throwCandy = () => {
    const fromLeft = Math.random() < 0.5;

    scatter({
      x: fromLeft ? 0 : window.innerWidth,
      y: window.innerHeight,
      angle: fromLeft ? random(62, 82) : random(98, 118),
      spread: 30,
      speed: random(36, 48),
    });
  };

  const schedule = (delay: number) => {
    timeout = setTimeout(() => {
      throwCandy();
      schedule(random(2500, 7000));
    }, delay);
  };

  schedule(1000);

  return {
    stop: () => {
      clearTimeout(timeout);
      pending.forEach(clearTimeout);
      destroy();
    },
    burst: (x, y) =>
      scatter({ x, y, angle: 90, spread: 360, speed: random(11, 16) }, 0.5),
  };
};
