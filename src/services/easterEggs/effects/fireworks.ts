import { createParticles } from "./particles";
import { createRateLimit } from "./rateLimit";
import { createShells, PALETTES, pick, random, Shell } from "./shells";
import { Effect } from "./types";

/** Rockets going up, and bursting in the sky: now and then by themselves, and wherever you click. */
export const startFireworks = (): Effect => {
  const { throwPieces, count, destroy } = createParticles();
  // A burst of three rockets from clicking, then two a second at most.
  const canLaunchOnClick = createRateLimit(3, 500);
  let timeout: ReturnType<typeof setTimeout>;
  let lastShell: Shell | undefined;
  const pending = new Set<ReturnType<typeof setTimeout>>();

  const later = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      pending.delete(timer);
      callback();
    }, delay);

    pending.add(timer);
  };

  const shells = createShells({ throwPieces, later });

  const explode = (x: number, y: number) => {
    // Never the same kind twice in a row.
    const shell = pick(shells.filter((candidate) => candidate !== lastShell));

    lastShell = shell;
    shell(x, y, random(0.8, 1.3), pick(PALETTES));
  };

  /** A rocket from the bottom of the screen to a spot in the sky, where it bursts. */
  const launch = (fromX: number, toX: number, toY: number) => {
    const startY = window.innerHeight + 10;
    const gravity = 0.18;
    // Frames at 60 fps until it stops rising, which is where it should be.
    const frames = Math.sqrt((2 * (startY - toY)) / gravity);
    const rising = gravity * frames;
    const sideways = (toX - fromX) / frames;
    const rocket = {
      x: fromX,
      y: startY,
      angle: (Math.atan2(rising, sideways) * 180) / Math.PI,
      spread: 0,
      count: 1,
      speed: [
        Math.hypot(rising, sideways),
        Math.hypot(rising, sideways),
      ] as const,
      gravity,
      life: [frames, frames] as const,
      spin: [0, 0] as const,
      shape: "circle" as const,
      fade: 3,
    };

    // A glowing head, and the spark with its tail that burns in it.
    throwPieces({
      ...rocket,
      size: [18, 18],
      shape: "glow",
      colors: ["#fff3b0"],
    });
    throwPieces({
      ...rocket,
      size: [4, 4],
      colors: ["#ffe9a8"],
      trail: 20,
    });
    later(() => explode(toX, toY), (frames / 60) * 1000);
  };

  const skyHeight = () => random(0.12, 0.42) * window.innerHeight;

  /** Now and then a pair or a fan of rockets, so it isn't one at a time. */
  const volley = () => {
    const roll = Math.random();
    const rockets = roll < 0.6 ? 1 : roll < 0.88 ? 2 : 3;
    const centre = random(0.2, 0.8) * window.innerWidth;

    for (let index = 0; index < rockets; index++) {
      later(
        () => {
          const toX =
            rockets === 1
              ? random(0.1, 0.9) * window.innerWidth
              : centre + (index - (rockets - 1) / 2) * random(150, 260);

          // From a little to the side, so they don't all go straight up.
          launch(toX + random(-140, 140), toX, skyHeight());
        },
        index * random(180, 380),
      );
    }
  };

  const schedule = (delay: number) => {
    timeout = setTimeout(() => {
      volley();
      schedule(random(1400, 3800));
    }, delay);
  };

  schedule(600);

  return {
    stop: () => {
      clearTimeout(timeout);
      pending.forEach(clearTimeout);
      destroy();
    },
    /*
     * On demand: a rocket from the bottom toward where you clicked, but never
     * lower than the sky. Spamming doesn't help: a few at a time, then a steady
     * pace, and none while a lot is already in the air.
     */
    burst: (x, y) => {
      if (count() > 700 || !canLaunchOnClick()) {
        return;
      }

      const middle = window.innerWidth / 2;

      launch(
        middle + (x - middle) * 0.4,
        x,
        Math.min(
          Math.max(y, 0.1 * window.innerHeight),
          0.6 * window.innerHeight,
        ),
      );
    },
  };
};
