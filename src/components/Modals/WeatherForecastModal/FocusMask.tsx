/** How much of the rest stays visible while a day is picked out. */
const UNFOCUSED_OPACITY = 0.33;

type FocusMaskProps = {
  id: string;
  /** How many points the line has. */
  count: number;
  /** The first and last point of the day to keep clear, or -1 for none. */
  first: number;
  last: number;
};

/**
 * Fades a line outside a day. The line's box runs from its first point to its
 * last, so a point's place is its index over the gaps, and the day ends
 * halfway to the next point, where the rain bars end too.
 */
const FocusMask = ({ id, count, first, last }: FocusMaskProps) => {
  const hasDay = first !== -1 && count > 1;
  const start = hasDay ? Math.max(0, (first - 0.5) / (count - 1)) : -1;
  const end = hasDay ? Math.min(1, (last + 0.5) / (count - 1)) : 2;

  return (
    <mask
      id={id}
      maskUnits="objectBoundingBox"
      maskContentUnits="objectBoundingBox"
      x={-1}
      y={-1}
      width={3}
      height={3}
    >
      <rect
        x={-1}
        y={-1}
        width={3}
        height={3}
        fill="white"
        fillOpacity={hasDay ? UNFOCUSED_OPACITY : 1}
        style={{ transition: "fill-opacity 150ms" }}
      />
      <rect x={start} y={-1} width={end - start} height={3} fill="white" />
    </mask>
  );
};

export default FocusMask;
