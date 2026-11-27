import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";
import {
  usePlotArea,
  useXAxisScale,
  useXAxisTicks,
  useYAxisTicks,
} from "recharts";

import { AXIS_TICK, HAIRLINE_COLOR } from "./chartStyle";
import { ANIMATION_EASE, ANIMATION_MS } from "./forecastAnimation";

export type DayMark = {
  time: string;
  label: string;
  /** The first day has a label only. */
  hasDivider: boolean;
};

type ChartMarksProps = {
  days: DayMark[];
  formatTime: (time: string) => string;
  formatTemperature: (celsius: number) => string;
};

type MarkProps = {
  x: number;
  y: number;
  isInstant: boolean;
  children: ReactNode;
};

/**
 * Slides to its place when that moves, and fades when it comes or goes, in
 * step with the line and the bars.
 */
const Mark = ({ x, y, isInstant, children }: MarkProps) => (
  <motion.g
    initial={{ opacity: 0, x, y }}
    animate={{ opacity: 1, x, y }}
    exit={{ opacity: 0 }}
    transition={{
      duration: isInstant ? 0 : ANIMATION_MS / 1000,
      ease: ANIMATION_EASE,
    }}
  >
    {children}
  </motion.g>
);

/** Keeps the top temperature's label inside the chart, as recharts does. */
const TOP_LABEL_INSET = 8;

/**
 * The chart's axis labels and day dividers. Recharts redraws its own whenever
 * a place changes, so these are drawn here instead, from the same ticks and
 * scales, to move with the data when the days change.
 */
const ChartMarks = ({
  days,
  formatTime,
  formatTemperature,
}: ChartMarksProps) => {
  const plot = usePlotArea();
  const timeScale = useXAxisScale();
  const timeTicks = useXAxisTicks();
  const temperatureTicks = useYAxisTicks("temperature");
  const isInstant = Boolean(useReducedMotion());

  if (!plot || !timeScale) {
    return null;
  }

  const bottom = plot.y + plot.height;

  return (
    <AnimatePresence>
      {days.flatMap(({ time, label, hasDivider }) => {
        const x = timeScale(time, { position: "middle" });

        return x === undefined
          ? []
          : [
              <Mark key={`day-${time}`} x={x} y={plot.y} isInstant={isInstant}>
                {hasDivider && (
                  <line y2={plot.height} stroke={HAIRLINE_COLOR} />
                )}
                <text x={8} y={8} dy="0.71em" {...AXIS_TICK}>
                  {label}
                </text>
              </Mark>,
            ];
      })}

      {timeTicks?.map((tick) => (
        <Mark
          key={`time-${tick.value}`}
          x={tick.coordinate}
          y={bottom}
          isInstant={isInstant}
        >
          <text y={8} dy="0.71em" textAnchor="middle" {...AXIS_TICK}>
            {formatTime(tick.value)}
          </text>
        </Mark>
      ))}

      {temperatureTicks?.map((tick) => (
        <Mark
          key={`temperature-${tick.value}`}
          x={plot.x - 8}
          y={Math.max(tick.coordinate, plot.y + TOP_LABEL_INSET)}
          isInstant={isInstant}
        >
          <text dy="0.355em" textAnchor="end" {...AXIS_TICK}>
            {formatTemperature(tick.value)}
          </text>
        </Mark>
      ))}
    </AnimatePresence>
  );
};

export default ChartMarks;
