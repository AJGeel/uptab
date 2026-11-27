/** A playing easter egg effect. */
export type Effect = {
  stop: () => void;
  /** A small burst at a spot on the screen, in pixels. */
  burst: (x: number, y: number) => void;
};

/** A glow is a soft round light, for flashes: its colour must be a six-digit hex. */
export type Shape = "circle" | "glow" | "flag" | "ripple" | Path2D;

export type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  flip: boolean;
  opacity: number;
  /** How many pixels its size grows every frame: for a ripple. */
  grow: number;
  spin: number;
  size: number;
  age: number;
  life: number;
  gravity: number;
  drag: number;
  sway: number;
  swayPhase: number;
  swaySpeed: number;
  shape: Shape;
  color: string;
  squash: number;
  outline?: string;
  flicker: number;
  fade: number;
  /** The last places it was at, in a ring: the newest is just before `head`. */
  trailX?: Float32Array;
  trailY?: Float32Array;
  head: number;
  count: number;
};
