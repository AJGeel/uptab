import { createParticles } from "./particles";
import { createRateLimit } from "./rateLimit";
import { random } from "./shells";
import { Effect } from "./types";

/** How solid a flag is: low, so it's something you only just notice. */
const OPACITY = 0.3;

/** Small flags that drift up slowly now and then, and the flag spreading out like a ripple wherever you click. */
export const startFlags = (): Effect => {
  const { throwPieces, destroy } = createParticles();
  const canBurst = createRateLimit(4, 350);

  const flag = (x: number, y: number, angle: number, speed: number) =>
    throwPieces({
      x,
      y,
      angle,
      spread: 0,
      count: 1,
      speed: [speed, speed],
      gravity: 0,
      size: [16, 26],
      // Long enough to cross the screen, and a slow fade at the end.
      life: [1000, 1250],
      fade: 90,
      spin: [0.05, 0.25],
      // Leaning a little, never upside down.
      rotation: [-15, 15],
      sway: 0.35,
      opacity: OPACITY,
      shape: "flag",
      colors: ["#ffffff"],
    });

  const interval = setInterval(
    () =>
      flag(
        random(0.05, 0.95) * window.innerWidth,
        window.innerHeight + 30,
        random(84, 96),
        random(0.5, 0.9),
      ),
    1300,
  );

  // A few to start with, so it isn't empty.
  for (let index = 0; index < 3; index++) {
    flag(
      random(0.1, 0.9) * window.innerWidth,
      random(0.4, 0.9) * window.innerHeight,
      random(84, 96),
      random(0.5, 0.9),
    );
  }

  return {
    stop: () => {
      clearInterval(interval);
      destroy();
    },
    // One flag spreading out from where you click: red, white and blue in bands.
    burst: (x, y) => {
      if (!canBurst()) {
        return;
      }

      throwPieces({
        x,
        y,
        angle: 90,
        spread: 0,
        count: 1,
        speed: [0, 0],
        gravity: 0,
        size: [34, 34],
        grow: 3.2,
        life: [130, 130],
        fade: 110,
        spin: [0, 0],
        opacity: 0.7,
        shape: "ripple",
        colors: ["#ffffff"],
      });
    },
  };
};
