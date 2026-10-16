import { ReactNode } from "react";

import {
  ForecastChartPoint,
  formatTime,
  getDayLabel,
} from "./forecastChartData";

type TooltipRowProps = {
  label: string;
  children: ReactNode;
};

const TooltipRow = ({ label, children }: TooltipRowProps) => (
  <>
    <dt className="text-black/50">{label}</dt>
    <dd className="text-right tabular-nums">{children}</dd>
  </>
);

type ForecastTooltipProps = {
  active?: boolean;
  point?: ForecastChartPoint;
};

const ForecastTooltip = ({ active, point }: ForecastTooltipProps) => {
  if (!active || !point) {
    return null;
  }

  const date = new Date(point.time);
  const { weather } = point;

  return (
    <div className="min-w-40 rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md ring-1 ring-black/5">
      <p className="text-black/50">
        {getDayLabel(date)} · {formatTime(date)}
      </p>

      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-lg font-medium tabular-nums">
          {Math.round(point.temperature)}°
        </p>

        {weather?.image && (
          <img
            src={weather.image}
            alt={weather.description ?? ""}
            className="-my-2 -mr-2 size-10 drop-shadow"
          />
        )}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
        {weather?.description && (
          <TooltipRow label="Sky">{weather.description}</TooltipRow>
        )}
        <TooltipRow label="Feels like">{point.apparentTemperature}°</TooltipRow>
        <TooltipRow label="Precipitation">{point.precipitation} mm</TooltipRow>
        {point.snowfall > 0 && (
          <TooltipRow label="Snow">{point.snowfall} cm</TooltipRow>
        )}
        <TooltipRow label="Humidity">{point.humidity}%</TooltipRow>
      </dl>
    </div>
  );
};

export default ForecastTooltip;
