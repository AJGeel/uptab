import { ReactNode } from "react";

import {
  ForecastChartPoint,
  formatTime,
  getDayLabel,
} from "./forecastChartData";
import { getTemperatureColor } from "./temperatureColor";

type TooltipRowProps = {
  label: string;
  children: ReactNode;
};

const TooltipRow = ({ label, children }: TooltipRowProps) => (
  <p>
    {label}: <span className="font-medium text-black">{children}</span>
  </p>
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
    <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        {weather?.image && (
          <img
            src={weather.image}
            alt={weather.description ?? ""}
            className="size-10 shrink-0"
          />
        )}

        <div>
          {weather?.description && (
            <p className="font-medium">{weather.description}</p>
          )}
          <p className="text-xs text-black/50">
            {getDayLabel(date)} · {formatTime(date)}
          </p>
        </div>
      </div>

      <div className="space-y-0.5 text-black/70">
        <TooltipRow label="Temperature">
          <span style={{ color: getTemperatureColor(point.temperature) }}>
            {point.temperature}°
          </span>
        </TooltipRow>

        <TooltipRow label="Rain">{point.rain} mm</TooltipRow>
      </div>
    </div>
  );
};

export default ForecastTooltip;
