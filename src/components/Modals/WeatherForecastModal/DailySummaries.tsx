import { DropIcon } from "@phosphor-icons/react";

import { useSettings } from "@/src/hooks/useSettings";
import { toDisplayTemperature } from "@/src/services/weather/temperature";
import { cn } from "@/src/utils";

import { DailySummary } from "./forecastChartData";
import { RAIN_TEXT_CLASS } from "./rainColor";

type DailySummariesProps = {
  summaries: DailySummary[];
  /** The day under the pointer, if any. The others fade. */
  focusedDay?: string;
  onFocusDay?: (dayKey?: string) => void;
};

const DailySummaries = ({
  summaries,
  focusedDay,
  onFocusDay,
}: DailySummariesProps) => {
  const unit = useSettings().data?.units.temperature ?? "celsius";
  const degrees = (celsius: number) =>
    Math.round(toDisplayTemperature(celsius, unit));

  return (
    <ul
      className={cn(
        "grid gap-4",
        // More than three days wrap to a second row.
        summaries.length > 3 ? "grid-cols-4" : "grid-cols-3",
      )}
    >
      {summaries.map(
        ({ dayKey, dayLabel, high, low, precipitation, weather }) => (
          <li
            key={dayKey}
            onPointerEnter={() => onFocusDay?.(dayKey)}
            onPointerLeave={() => onFocusDay?.(undefined)}
            className={cn(
              /*
               * The padding is cancelled by the margin, so the ring has room
               * without moving anything.
               */
              "-m-2 flex items-center gap-2 rounded-xl p-2 ring-3 ring-sky-500/0 duration-150",
              focusedDay === dayKey && "ring-sky-500",
              focusedDay && focusedDay !== dayKey && "opacity-33",
            )}
          >
            {weather?.image && (
              <img
                src={weather.image}
                alt={weather.description ?? ""}
                title={weather.description}
                className="-my-2 size-12 shrink-0 dark:invert"
              />
            )}

            <div className="min-w-0">
              <p className="text-xs text-black/50">{dayLabel}</p>

              <p className="flex items-center gap-1 tabular-nums">
                <span className="font-medium">
                  {degrees(low)}–{degrees(high)}°
                </span>
                {precipitation > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center text-xs",
                      RAIN_TEXT_CLASS,
                    )}
                  >
                    <DropIcon weight="fill" className="mr-0.5" />
                    {precipitation} mm
                  </span>
                )}
              </p>
            </div>
          </li>
        ),
      )}
    </ul>
  );
};

export default DailySummaries;
