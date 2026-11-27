import { createParticles, iconShape } from "./particles";
import { createRateLimit } from "./rateLimit";
import { random } from "./shells";
import { Effect } from "./types";

// Phosphor's Crown (fill): for the odd crown in the confetti.
const CROWN_PATH =
  "M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146,73.4a28,28,0,1,0-36.06,0L85.91,128.74l-26.79-33a28,28,0,1,0-26.6,12L47,194.63A16,16,0,0,0,62.78,208H193.22A16,16,0,0,0,209,194.63l14.47-86.85A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80ZM220,92a12,12,0,1,1,12-12A12,12,0,0,1,220,92Z";

/** Mostly orange, with the red, white and blue of the flag. */
const COLORS = [
  "#ff6f00",
  "#ff6f00",
  "#ff8f1f",
  "#ff8f1f",
  "#ffa94d",
  "#ffffff",
  "#1e4785",
  "#ae1c28",
];

/** Orange confetti shot from the corners now and then, and a puff of it wherever you click. */
export const startKingsday = (): Effect => {
  const { throwPieces, destroy } = createParticles();
  const confetti = iconShape("M48 80h160v96H48z");
  const crown = iconShape(CROWN_PATH);
  const canBurst = createRateLimit(5, 250);
  let timeout: ReturnType<typeof setTimeout>;
  const pending = new Set<ReturnType<typeof setTimeout>>();

  const later = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      pending.delete(timer);
      callback();
    }, delay);

    pending.add(timer);
  };

  /** Confetti in small volleys, each a little different, and now and then a crown. */
  const shoot = (
    x: number,
    y: number,
    angle: number,
    spread: number,
    speed: number,
    amount: number,
  ) => {
    for (let volley = 0; volley < 7; volley++) {
      later(
        () =>
          throwPieces({
            x,
            y,
            angle: angle + random(-8, 8),
            spread,
            count: Math.max(1, Math.round(random(4, 8) * amount)),
            speed: [speed * 0.6, speed * 1.1],
            gravity: 0.14,
            drag: random(0.968, 0.978),
            size: [14, 24],
            life: [170, 260],
            spin: [3, 12],
            sway: 0.7,
            squash: random(0.35, 1),
            shape: confetti,
            colors: COLORS,
          }),
        random(0, 120),
      );
    }

    if (Math.random() < 0.5) {
      throwPieces({
        x,
        y,
        angle,
        spread,
        count: 1,
        speed: [speed * 0.7, speed * 0.9],
        gravity: 0.14,
        drag: 0.975,
        size: [38, 50],
        life: [190, 260],
        spin: [1, 3],
        sway: 0.4,
        shape: crown,
        colors: ["#ff7a00"],
        outline: "rgba(45, 22, 10, 0.85)",
      });
    }
  };

  const fire = () => {
    const fromLeft = Math.random() < 0.5;
    const angle = random(62, 82);

    shoot(
      fromLeft ? 0 : window.innerWidth,
      window.innerHeight,
      fromLeft ? angle : 180 - angle,
      30,
      random(28, 40),
      1,
    );
  };

  const schedule = (delay: number) => {
    timeout = setTimeout(() => {
      fire();
      schedule(random(2200, 5000));
    }, delay);
  };

  schedule(800);

  return {
    stop: () => {
      clearTimeout(timeout);
      pending.forEach(clearTimeout);
      destroy();
    },
    burst: (x, y) => {
      if (canBurst()) {
        shoot(x, y, 90, 360, random(9, 14), 0.8);
      }
    },
  };
};
