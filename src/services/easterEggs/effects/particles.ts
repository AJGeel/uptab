import { createPainter } from "./draw";
import { Piece, Shape } from "./types";

/** A phosphor icon path, drawn in a 256 by 256 box. */
export const iconShape = (path: string) => new Path2D(path);

type Range = readonly [min: number, max: number];

export type Burst = {
  x: number;
  y: number;
  /** Degrees, 0 to the right and 90 up. */
  angle: number;
  /** Degrees, the pieces fan out this far around the angle. */
  spread: number;
  count: number;
  /** Pixels per frame at 60 fps. */
  speed: Range;
  /** Pulls down, in pixels per frame, per frame. */
  gravity: number;
  /** Keeps this much of the speed every frame. */
  drag?: number;
  /** Pixels. */
  size: Range;
  /** Frames at 60 fps. */
  life: Range;
  /** Degrees per frame, either way. */
  spin: Range;
  /** How far a piece sways side to side, in pixels per frame. */
  sway?: number;
  shape: Shape;
  colors: string[];
  /** The way a piece starts out, in degrees. Random when left out. */
  rotation?: Range;
  /** Mirrors the piece, for one that flies the other way. */
  flip?: boolean;
  /** How solid a piece is at most, from 0 to 1: lower is more subtle. */
  opacity?: number;
  /** Below 1 squashes a piece, so a turning circle shows it turns. */
  squash?: number;
  /** A thin border, for contrast with what's behind it. */
  outline?: string;
  /** Leaves a tail this many steps long, fading behind it, like a burning spark. */
  trail?: number;
  /** How often a spark dims for a moment, from 0 to 1: it glitters. */
  flicker?: number;
  /** Frames at 60 fps it takes to fade out, at the end of its life. */
  fade?: number;
};

const FADE_FRAMES = 40;
/** Keeps a pile-up of fireworks from dragging the page down. */
const MAX_PIECES = 1400;
const random = ([min, max]: Range) => min + Math.random() * (max - min);
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * A layer over the page that lets clicks through, and a way to throw pieces
 * onto it. It only runs while there is something to draw. Drawn on a plain
 * canvas, so there are no workers for Firefox's extension policy to block.
 */
export const createParticles = () => {
  const canvas = document.createElement("canvas");
  const painter = createPainter(canvas);
  const pieces: Piece[] = [];
  let frame: number | undefined;
  let lastTime = 0;

  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    // Over the page, under the modals.
    zIndex: "10",
  });
  document.body.appendChild(canvas);
  painter.resize();
  window.addEventListener("resize", painter.resize);

  const step = (time: number) => {
    // Steps of one frame at 60 fps, so a slow screen isn't a slow animation.
    const delta = Math.min(3, (time - lastTime) / (1000 / 60));

    lastTime = time;
    painter.begin();

    for (let index = pieces.length - 1; index >= 0; index--) {
      const piece = pieces[index];

      if (piece.trailX && piece.trailY) {
        piece.trailX[piece.head] = piece.x;
        piece.trailY[piece.head] = piece.y;
        piece.head = (piece.head + 1) % piece.trailX.length;
        piece.count = Math.min(piece.count + 1, piece.trailX.length);
      }

      piece.age += delta;
      piece.vx *= piece.drag ** delta;
      piece.vy = piece.vy * piece.drag ** delta + piece.gravity * delta;
      piece.swayPhase += piece.swaySpeed * delta;
      piece.x += (piece.vx + Math.sin(piece.swayPhase) * piece.sway) * delta;
      piece.y += piece.vy * delta;
      piece.rotation += piece.spin * delta;

      if (
        piece.age >= piece.life ||
        piece.y > window.innerHeight + 60 ||
        piece.x < -80 ||
        piece.x > window.innerWidth + 80 ||
        // Something that only rises never comes back.
        (piece.gravity <= 0 && piece.y < -200)
      ) {
        // Swap with the last one, which is cheaper than shifting all the rest.
        pieces[index] = pieces[pieces.length - 1];
        pieces.pop();
        continue;
      }

      let fade = Math.min(1, (piece.life - piece.age) / piece.fade);

      if (piece.flicker > 0 && Math.random() < piece.flicker) {
        fade *= 0.3;
      }

      painter.draw(piece, Math.max(0, fade));
    }

    painter.end();
    frame = pieces.length > 0 ? requestAnimationFrame(step) : undefined;
  };

  const throwPieces = (burst: Burst) => {
    for (let index = 0; index < burst.count; index++) {
      if (pieces.length >= MAX_PIECES) {
        break;
      }

      const angle = toRadians(
        burst.angle + (Math.random() - 0.5) * burst.spread,
      );
      const speed = random(burst.speed);

      pieces.push({
        x: burst.x,
        y: burst.y,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        rotation: burst.rotation
          ? toRadians(random(burst.rotation))
          : Math.random() * Math.PI * 2,
        flip: burst.flip ?? false,
        opacity: burst.opacity ?? 1,
        spin: toRadians(random(burst.spin)) * (Math.random() < 0.5 ? -1 : 1),
        size: random(burst.size),
        age: 0,
        life: random(burst.life),
        gravity: burst.gravity,
        drag: burst.drag ?? 1,
        sway: burst.sway ?? 0,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: random([0.02, 0.06]),
        shape: burst.shape,
        color: burst.colors[Math.floor(Math.random() * burst.colors.length)],
        squash: burst.squash ?? 1,
        outline: burst.outline,
        flicker: burst.flicker ?? 0,
        fade: burst.fade ?? FADE_FRAMES,
        trailX: burst.trail ? new Float32Array(burst.trail) : undefined,
        trailY: burst.trail ? new Float32Array(burst.trail) : undefined,
        head: 0,
        count: 0,
      });
    }

    if (frame === undefined && pieces.length > 0) {
      lastTime = performance.now();
      frame = requestAnimationFrame(step);
    }
  };

  return {
    throwPieces,
    /** How many pieces are in the air, to hold back when it's a lot. */
    count: () => pieces.length,
    destroy: () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", painter.resize);
      canvas.remove();
    },
  };
};
