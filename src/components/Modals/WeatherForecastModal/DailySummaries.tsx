import { useSettings } from "@/src/hooks/useSettings";
import { toDisplayTemperature } from "@/src/services/weather/temperature";
import { cn } from "@/src/utils";

import { DailySummary } from "./forecastChartData";

type DailySummariesProps = {
  summaries: DailySummary[];
};

const DailySummaries = ({ summaries }: DailySummariesProps) => {
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
          <li key={dayKey} className="flex items-center gap-2">
            {weather?.image && (
              <img
                src={weather.image}
                alt={weather.description ?? ""}
                title={weather.description}
                className="-my-2 size-12 shrink-0 drop-shadow-sm"
              />
            )}

            <div className="min-w-0">
              <p className="text-xs text-black/50">{dayLabel}</p>

              <p className="tabular-nums">
                <span className="font-medium">{degrees(high)}°</span>{" "}
                <span className="text-black/40">{degrees(low)}°</span>
                {precipitation > 0 && (
                  <span className="ml-2 text-xs text-sky-600">
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
