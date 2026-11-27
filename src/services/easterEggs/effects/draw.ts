import { Piece } from "./types";

/** A path of everything that is drawn the same, so it's drawn at once. */
type Batch = { path: Path2D; color: string; alpha: number };

const OUTLINE_WIDTH = 2;
/** How opaque the three parts of a tail are, newest first, and how wide. */
const TAIL_ALPHA = [0.75, 0.42, 0.18];
const TAIL_WIDTH = [2.6, 1.7, 0.9];
/** Fades are drawn in steps, so pieces that look alike can share a batch. */
const FADE_STEPS = 6;

const glows = new Map<string, HTMLCanvasElement>();

/** A soft round light, drawn once per colour and then only copied. */
const glowSprite = (color: string) => {
  let sprite = glows.get(color);

  if (!sprite) {
    sprite = document.createElement("canvas");
    sprite.width = 128;
    sprite.height = 128;

    const context = sprite.getContext("2d");
    const light = context?.createRadialGradient(64, 64, 0, 64, 64, 64);

    if (context && light) {
      light.addColorStop(0, color);
      light.addColorStop(1, `${color}00`);
      context.fillStyle = light;
      context.fillRect(0, 0, 128, 128);
    }

    glows.set(color, sprite);
  }

  return sprite;
};

/**
 * Draws the pieces. Plain round ones, which is nearly all of a firework, are
 * gathered per colour and fade and drawn at once, since that is far cheaper
 * than a path and a stroke for every spark. The rest are drawn on their own.
 */
export const createPainter = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  let ratio = 1;
  let heads = new Map<string, Batch>();
  let tails = new Map<string, Batch>();

  const resize = () => {
    ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
  };

  const batchFor = (
    batches: Map<string, Batch>,
    key: string,
    color: string,
    alpha: number,
  ) => {
    let batch = batches.get(key);

    if (!batch) {
      batch = { path: new Path2D(), color, alpha };
      batches.set(key, batch);
    }

    return batch.path;
  };

  /** The place `back` steps behind a piece, 0 being where it is. */
  const pointBehind = (piece: Piece, back: number) => {
    if (back === 0 || !piece.trailX || !piece.trailY) {
      return [piece.x * ratio, piece.y * ratio] as const;
    }

    const size = piece.trailX.length;
    const index = (((piece.head - back) % size) + size) % size;

    return [piece.trailX[index] * ratio, piece.trailY[index] * ratio] as const;
  };

  const addTail = (piece: Piece, level: number) => {
    if (piece.count < 2) {
      return;
    }

    for (let part = 0; part < 3; part++) {
      const from = Math.floor((part * piece.count) / 3);
      const to = Math.ceil(((part + 1) * piece.count) / 3);
      const path = batchFor(
        tails,
        `${piece.color}|${level}|${part}`,
        piece.color,
        level * TAIL_ALPHA[part],
      );

      path.moveTo(...pointBehind(piece, from));

      for (let back = from + 1; back <= to; back++) {
        path.lineTo(...pointBehind(piece, back));
      }
    }
  };

  /** One piece on its own: for the ones that turn, squash, or have a shape or border. */
  const drawAlone = (piece: Piece, fade: number) => {
    if (!context) {
      return;
    }

    context.save();
    context.globalAlpha = fade;
    context.translate(piece.x * ratio, piece.y * ratio);

    if (piece.shape === "glow") {
      const size = piece.size * ratio;

      context.drawImage(
        glowSprite(piece.color),
        -size / 2,
        -size / 2,
        size,
        size,
      );
      context.restore();

      return;
    }

    context.fillStyle = piece.color;
    context.rotate(piece.rotation);
    context.scale(ratio, ratio * piece.squash);

    if (piece.shape === "circle") {
      context.beginPath();
      context.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      context.fill();

      if (piece.outline) {
        context.lineWidth = OUTLINE_WIDTH;
        context.strokeStyle = piece.outline;
        context.stroke();
      }
    } else {
      const scale = piece.size / 256;

      context.scale(scale, scale);
      context.translate(-128, -128);
      context.fill(piece.shape);

      if (piece.outline) {
        // In the units of the icon's box, so the border stays as thin on a big piece.
        context.lineWidth = OUTLINE_WIDTH / scale;
        context.lineJoin = "round";
        context.strokeStyle = piece.outline;
        context.stroke(piece.shape);
      }
    }

    context.restore();
  };

  /** Starts a frame. */
  const begin = () => {
    heads = new Map();
    tails = new Map();
    context?.clearRect(0, 0, canvas.width, canvas.height);
  };

  /** Draws a piece, or gathers it to be drawn with the rest at the end. */
  const draw = (piece: Piece, fade: number) => {
    if (piece.shape !== "circle" || piece.squash !== 1 || piece.outline) {
      drawAlone(piece, fade);

      return;
    }

    const level = Math.round(fade * FADE_STEPS) / FADE_STEPS;
    const head = batchFor(heads, `${piece.color}|${level}`, piece.color, level);
    const x = piece.x * ratio;
    const radius = (piece.size / 2) * ratio;

    addTail(piece, level);
    // Each on its own subpath, or the arcs would be joined by lines.
    head.moveTo(x + radius, piece.y * ratio);
    head.arc(x, piece.y * ratio, radius, 0, Math.PI * 2);
  };

  /** Ends a frame: the tails, then the heads on top of them. */
  const end = () => {
    if (!context) {
      return;
    }

    context.lineCap = "round";

    for (const [key, { path, color, alpha }] of tails) {
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.lineWidth = TAIL_WIDTH[Number(key.slice(-1))] * ratio;
      context.stroke(path);
    }

    for (const { path, color, alpha } of heads.values()) {
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.fill(path);
    }

    context.globalAlpha = 1;
  };

  return { resize, begin, draw, end };
};
