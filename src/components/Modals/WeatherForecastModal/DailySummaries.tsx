import { DailySummary } from "./forecastChartData";

type DailySummariesProps = {
  summaries: DailySummary[];
};

const DailySummaries = ({ summaries }: DailySummariesProps) => (
  <ul className="grid grid-cols-3 gap-4">
    {summaries.map(
      ({ dayKey, dayLabel, high, low, precipitation, weather }) => (
        <li key={dayKey} className="flex items-center gap-2">
          {weather?.image && (
            <img
              src={weather.image}
              alt={weather.description ?? ""}
              title={weather.description}
              className="-my-2 size-12 shrink-0 drop-shadow"
            />
          )}

          <div className="min-w-0">
            <p className="text-xs text-black/50">{dayLabel}</p>

            <p className="tabular-nums">
              <span className="font-medium">{high}°</span>{" "}
              <span className="text-black/40">{low}°</span>
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

export default DailySummaries;
