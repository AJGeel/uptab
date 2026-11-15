import {
  DropHalfIcon,
  DropIcon,
  SnowflakeIcon,
  WindIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { ReactNode, useState } from "react";

import { useSettings } from "@/src/hooks/useSettings";
import { toDisplayTemperature } from "@/src/services/weather/temperature";
import {
  toDisplayWindSpeed,
  windSymbol,
} from "@/src/services/weather/windSpeed";
import { cn } from "@/src/utils";

import {
  ForecastChartPoint,
  formatTime,
  getDayLabel,
} from "./forecastChartData";
import { RAIN_TEXT_CLASS } from "./rainColor";

type StatProps = {
  icon: ReactNode;
  className?: string;
  children: ReactNode;
};

const Stat = ({ icon, className, children }: StatProps) => (
  <span className={cn("flex items-center gap-1 tabular-nums", className)}>
    {icon}
    {children}
  </span>
);

type ForecastTooltipProps = {
  active?: boolean;
  point?: ForecastChartPoint;
};

const ForecastTooltip = ({ active, point }: ForecastTooltipProps) => {
  const { data: settings } = useSettings();
  const unit = settings?.units.temperature ?? "celsius";
  const windUnit = settings?.units.wind ?? "kmh";

  // The last point stays on screen while the tooltip fades out.
  const [lastPoint, setLastPoint] = useState(point);
  if (point && point !== lastPoint) {
    setLastPoint(point);
  }
  const shown = point ?? lastPoint;

  if (!shown) {
    return null;
  }

  const date = new Date(shown.time);
  const { weather } = shown;

  const degrees = (celsius: number) =>
    Math.round(toDisplayTemperature(celsius, unit));

  return (
    <motion.div
      initial={false}
      animate={
        active && point
          ? { opacity: 1 }
          : { opacity: 0, scale: 0.9, transition: { duration: 0.12 } }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-w-36 rounded-xl bg-surface/95 px-3 py-2.5 text-xs shadow-md ring-1 ring-black/5"
    >
      <p className="text-black/50">
        {getDayLabel(date)} · {formatTime(date, settings?.dateTime.timeFormat)}
      </p>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl leading-tight font-medium tabular-nums">
            {degrees(shown.temperature)}°
          </p>
          {weather?.description && (
            <p className="text-black/60">{weather.description}</p>
          )}
          {settings?.forecast.showFeelsLike && (
            <p className="text-black/40">
              Feels like {degrees(shown.apparentTemperature)}°
            </p>
          )}
        </div>

        {weather?.image && (
          <img
            src={weather.image}
            alt={weather.description ?? ""}
            className="-my-3 -mr-2 size-14 dark:invert"
          />
        )}
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-black/5 pt-2 text-black/60">
        <Stat
          icon={
            <DropIcon weight={shown.precipitation > 0 ? "fill" : "regular"} />
          }
          className={
            shown.precipitation > 0 ? RAIN_TEXT_CLASS : "text-black/30"
          }
        >
          {shown.precipitation} mm
        </Stat>
        {shown.snowfall > 0 && (
          <Stat icon={<SnowflakeIcon />}>{shown.snowfall} cm</Stat>
        )}
        <Stat icon={<WindIcon />}>
          {toDisplayWindSpeed(shown.windSpeed, windUnit)} {windSymbol(windUnit)}
        </Stat>
        <Stat icon={<DropHalfIcon />}>{shown.humidity}%</Stat>
      </div>
    </motion.div>
  );
};

export default ForecastTooltip;
