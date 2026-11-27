/** A playing easter egg effect. */
export type Effect = {
  stop: () => void;
  /** A small burst at a spot on the screen, in pixels. */
  burst: (x: number, y: number) => void;
};
