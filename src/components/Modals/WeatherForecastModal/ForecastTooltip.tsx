import { ReactNode } from "react";

import { useSettings } from "@/src/hooks/useSettings";
import { toDisplayTemperature } from "@/src/services/weather/temperature";
import {
  toDisplayWindSpeed,
  windSymbol,
} from "@/src/services/weather/windSpeed";

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
  const { data: settings } = useSettings();
  const unit = settings?.units.temperature ?? "celsius";
  const windUnit = settings?.units.wind ?? "kmh";

  if (!active || !point) {
    return null;
  }

  const date = new Date(point.time);
  const { weather } = point;

  return (
    <div className="min-w-40 rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md ring-1 ring-black/5">
      <p className="text-black/50">
        {getDayLabel(date)} · {formatTime(date, settings?.dateTime.timeFormat)}
      </p>

      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-lg font-medium tabular-nums">
          {Math.round(toDisplayTemperature(point.temperature, unit))}°
        </p>

        {weather?.image && (
          <img
            src={weather.image}
            alt={weather.description ?? ""}
            className="-my-2 -mr-2 size-10 drop-shadow-sm"
          />
        )}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
        {weather?.description && (
          <TooltipRow label="Sky">{weather.description}</TooltipRow>
        )}
        {settings?.forecast.showFeelsLike && (
          <TooltipRow label="Feels like">
            {toDisplayTemperature(point.apparentTemperature, unit)}°
          </TooltipRow>
        )}
        <TooltipRow label="Precipitation">{point.precipitation} mm</TooltipRow>
        {point.snowfall > 0 && (
          <TooltipRow label="Snow">{point.snowfall} cm</TooltipRow>
        )}
        <TooltipRow label="Wind">
          {toDisplayWindSpeed(point.windSpeed, windUnit)} {windSymbol(windUnit)}
        </TooltipRow>
        <TooltipRow label="Humidity">{point.humidity}%</TooltipRow>
      </dl>
    </div>
  );
};

export default ForecastTooltip;
