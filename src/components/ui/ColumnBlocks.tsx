const WIDTH = 20;
const HEIGHT = 16;
const GAP = 2;
const ROWS = 2;

/** Blocks in a number of columns, to show how a list is laid out. */
const ColumnBlocks = ({
  columns,
  className,
}: {
  columns: number;
  className?: string;
}) => {
  const blockWidth = (WIDTH - GAP * (columns - 1)) / columns;
  const blockHeight = (HEIGHT - GAP * (ROWS - 1)) / ROWS;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      fill="currentColor"
    >
      {Array.from({ length: ROWS * columns }, (_, index) => (
        <rect
          key={index}
          x={(index % columns) * (blockWidth + GAP)}
          y={Math.floor(index / columns) * (blockHeight + GAP)}
          width={blockWidth}
          height={blockHeight}
          rx={1}
        />
      ))}
    </svg>
  );
};

export default ColumnBlocks;
