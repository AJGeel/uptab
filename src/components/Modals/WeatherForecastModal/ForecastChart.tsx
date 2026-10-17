import {
  Bar,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DailySummaries from "./DailySummaries";
import {
  buildDailySummaries,
  buildForecastChartData,
  ForecastChartPoint,
  formatTime,
  getDayBoundaries,
  getTimeTicks,
  HourlyForecast,
} from "./forecastChartData";
import ForecastTooltip from "./ForecastTooltip";
import {
  getTemperatureColor,
  getTemperatureGradientStops,
} from "./temperatureColor";

const TEMPERATURE_GRADIENT_ID = "temperatureGradient";

const MUTED_COLOR = "rgba(0, 0, 0, 0.4)";
const HAIRLINE_COLOR = "rgba(0, 0, 0, 0.08)";

const AXIS_TICK = { fontSize: 11, fill: MUTED_COLOR };

const TEMPERATURE_AXIS_PADDING = 2;
const TEMPERATURE_TICK_STEP = 5;

const MIN_PRECIPITATION_AXIS_MAX = 2;
const PRECIPITATION_AXIS_HEADROOM = 1.5;

const getTemperatureTicks = (temperatures: number[]) => {
  const snap = (value: number, round: (n: number) => number) =>
    round(value / TEMPERATURE_TICK_STEP) * TEMPERATURE_TICK_STEP;
  const min = snap(
    Math.min(...temperatures) - TEMPERATURE_AXIS_PADDING,
    Math.floor,
  );
  const max = snap(
    Math.max(...temperatures) + TEMPERATURE_AXIS_PADDING,
    Math.ceil,
  );

  return Array.from(
    { length: (max - min) / TEMPERATURE_TICK_STEP + 1 },
    (_, i) => min + i * TEMPERATURE_TICK_STEP,
  );
};

const precipitationDomain: [number, (dataMax: number) => number] = [
  0,
  (dataMax) =>
    Math.max(dataMax, MIN_PRECIPITATION_AXIS_MAX) * PRECIPITATION_AXIS_HEADROOM,
];

type TemperatureDotProps = {
  cx?: number;
  cy?: number;
  payload?: ForecastChartPoint;
};

const TemperatureDot = ({ cx, cy, payload }: TemperatureDotProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={4}
    fill={getTemperatureColor(payload?.temperature ?? 0)}
    stroke="white"
    strokeWidth={2}
  />
);

const dayLabel = (value: string) => ({
  value,
  position: "insideTopLeft" as const,
  offset: 8,
  fontSize: 11,
  fill: MUTED_COLOR,
});

type ForecastChartProps = {
  hourly: HourlyForecast[];
};

const ForecastChart = ({ hourly }: ForecastChartProps) => {
  const data = buildForecastChartData(hourly);
  const dayBoundaries = getDayBoundaries(data);
  const timeTicks = getTimeTicks(data);
  const summaries = buildDailySummaries(data);

  const temperatures = data.map((point) => point.temperature);
  const temperatureTicks = getTemperatureTicks(temperatures);
  const gradientStops = getTemperatureGradientStops(temperatures);
  const lineColor = gradientStops
    ? `url(#${TEMPERATURE_GRADIENT_ID})`
    : getTemperatureColor(temperatures[0] ?? 0);

  const [firstPoint] = data;

  return (
    <div className="mt-2 space-y-6">
      <DailySummaries summaries={summaries} />

      <div className="h-70 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            {gradientStops && (
              <defs>
                <linearGradient
                  id={TEMPERATURE_GRADIENT_ID}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {gradientStops.map(({ offset, color }) => (
                    <stop key={offset} offset={offset} stopColor={color} />
                  ))}
                </linearGradient>
              </defs>
            )}

            <XAxis
              dataKey="time"
              ticks={timeTicks}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: HAIRLINE_COLOR }}
              tick={AXIS_TICK}
              tickFormatter={(value: string) => formatTime(new Date(value))}
            />

            <YAxis
              yAxisId="precipitation"
              orientation="right"
              domain={precipitationDomain}
              hide
            />

            <YAxis
              yAxisId="temperature"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              width={28}
              domain={[temperatureTicks[0], temperatureTicks.at(-1) ?? 0]}
              ticks={temperatureTicks}
              tickFormatter={(value) => `${value}°`}
            />

            {firstPoint && (
              <ReferenceLine
                x={firstPoint.time}
                yAxisId="temperature"
                stroke="transparent"
                label={dayLabel(firstPoint.dayLabel)}
              />
            )}

            {dayBoundaries.map((point) => (
              <ReferenceLine
                key={point.time}
                x={point.time}
                yAxisId="temperature"
                stroke={HAIRLINE_COLOR}
                label={dayLabel(point.dayLabel)}
              />
            ))}

            <Tooltip
              cursor={{ stroke: HAIRLINE_COLOR, strokeWidth: 1 }}
              content={({ active, payload }) => (
                <ForecastTooltip
                  active={active}
                  point={payload?.[0]?.payload}
                />
              )}
            />

            <Bar
              yAxisId="precipitation"
              dataKey="precipitation"
              name="Precipitation"
              fill="currentColor"
              radius={[2, 2, 0, 0]}
              maxBarSize={6}
            >
              {data.map((point) => (
                <Cell
                  key={point.time}
                  className={
                    point.isSnow ? "text-indigo-300/70" : "text-sky-400/50"
                  }
                />
              ))}
            </Bar>

            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke={lineColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              dot={false}
              activeDot={TemperatureDot}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;
