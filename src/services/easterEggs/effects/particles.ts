export type Shape = "circle" | Path2D;

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
  /** Below 1 squashes a piece, so a turning circle shows it turns. */
  squash?: number;
  /** A thin border, for contrast with what's behind it. */
  outline?: string;
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
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
};

const FADE_FRAMES = 40;
const OUTLINE_WIDTH = 2;
const random = ([min, max]: Range) => min + Math.random() * (max - min);
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * A layer over the page that lets clicks through, and a way to throw pieces
 * onto it. It only runs while there is something to draw. Drawn on a plain
 * canvas, so there are no workers for Firefox's extension policy to block.
 */
export const createParticles = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
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

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
  };

  resize();
  window.addEventListener("resize", resize);

  const draw = (piece: Piece) => {
    if (!context) {
      return;
    }

    const ratio = canvas.width / window.innerWidth;
    const fade = Math.min(1, (piece.life - piece.age) / FADE_FRAMES);

    context.save();
    context.globalAlpha = Math.max(0, fade);
    context.fillStyle = piece.color;
    context.translate(piece.x * ratio, piece.y * ratio);
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

  const step = (time: number) => {
    // Steps of one frame at 60 fps, so a slow screen isn't a slow animation.
    const delta = Math.min(3, (time - lastTime) / (1000 / 60));

    lastTime = time;
    context?.clearRect(0, 0, canvas.width, canvas.height);

    for (let index = pieces.length - 1; index >= 0; index--) {
      const piece = pieces[index];

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
        piece.x > window.innerWidth + 80
      ) {
        pieces.splice(index, 1);
      } else {
        draw(piece);
      }
    }

    frame = pieces.length > 0 ? requestAnimationFrame(step) : undefined;
  };

  const throwPieces = (burst: Burst) => {
    for (let index = 0; index < burst.count; index++) {
      const angle = toRadians(
        burst.angle + (Math.random() - 0.5) * burst.spread,
      );
      const speed = random(burst.speed);

      pieces.push({
        x: burst.x,
        y: burst.y,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
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
      });
    }

    if (frame === undefined && pieces.length > 0) {
      lastTime = performance.now();
      frame = requestAnimationFrame(step);
    }
  };

  return {
    throwPieces,
    destroy: () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", resize);
      canvas.remove();
    },
  };
};
