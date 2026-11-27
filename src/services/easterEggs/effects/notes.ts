/*
 * TODO(sint-maarten): finished, but parked until the egg has a photo. It isn't
 * switched on in effects/index.ts or in eggs.ts yet.
 */
import { createParticles, iconShape } from "./particles";
import { createRateLimit } from "./rateLimit";
import { pick, random } from "./shells";
import { Effect } from "./types";

// Phosphor's Music Note and Music Notes (fill): kids singing at the door.
const NOTE_PATH =
  "M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34Z";
const NOTES_PATH =
  "M212.92,17.71a7.89,7.89,0,0,0-6.86-1.46l-128,32A8,8,0,0,0,72,56V166.1A36,36,0,1,0,88,196V102.25l112-28V134.1A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.71Z";

/** A thin dark border, so the notes stand out on any photo. */
const OUTLINE = "rgba(60, 30, 10, 0.5)";

/** Music notes drifting up now and then, and a few more from where you click. */
export const startNotes = (): Effect => {
  const { throwPieces, destroy } = createParticles();
  const shapes = [iconShape(NOTE_PATH), iconShape(NOTES_PATH)];
  const canBurst = createRateLimit(4, 400);

  const note = (
    x: number,
    y: number,
    angle: number,
    speed: number,
    life: number,
  ) =>
    throwPieces({
      x,
      y,
      angle,
      spread: 0,
      count: 1,
      speed: [speed, speed],
      gravity: 0,
      drag: 1,
      size: [26, 44],
      life: [life, life * 1.2],
      fade: 80,
      spin: [0.1, 0.45],
      // Leaning a little, like a tune that sways.
      rotation: [-22, 22],
      sway: 0.55,
      shape: pick(shapes),
      colors: ["#ffd27f", "#ffb347", "#fff4d6", "#ffffff"],
      outline: OUTLINE,
    });

  const interval = setInterval(
    () =>
      note(
        random(0.05, 0.95) * window.innerWidth,
        window.innerHeight + 40,
        random(80, 100),
        random(0.9, 1.6),
        650,
      ),
    700,
  );

  // A few to start with, so it isn't quiet.
  for (let index = 0; index < 4; index++) {
    note(
      random(0.1, 0.9) * window.innerWidth,
      random(0.45, 0.95) * window.innerHeight,
      random(80, 100),
      random(0.9, 1.6),
      500,
    );
  }

  return {
    stop: () => {
      clearInterval(interval);
      destroy();
    },
    burst: (x, y) => {
      if (!canBurst()) {
        return;
      }

      for (let index = 0; index < 4; index++) {
        note(
          x + random(-30, 30),
          y + random(-10, 20),
          random(55, 125),
          random(1.2, 2.4),
          260,
        );
      }
    },
  };
};
