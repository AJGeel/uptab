import { useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSettings } from "@/src/hooks/useSettings";
import { DEFAULT_EXTRA_FORECAST_DAYS } from "@/src/services/weather/constants";
import { toDisplayTemperature } from "@/src/services/weather/temperature";
import { cn } from "@/src/utils";

import ChartMarks, { DayMark } from "./ChartMarks";
import { HAIRLINE_COLOR } from "./chartStyle";
import DailySummaries from "./DailySummaries";
import FocusMask from "./FocusMask";
import { interpolateLine, SERIES_ANIMATION } from "./forecastAnimation";
import {
  buildDailySummaries,
  buildForecastChartData,
  ForecastChartPoint,
  formatHour,
  getDayBoundaries,
  getTimeTicks,
  hasRoomForFirstDayLabel,
  HourlyForecast,
} from "./forecastChartData";
import ForecastLayout from "./ForecastLayout";
import ForecastTooltip from "./ForecastTooltip";
import { RAIN_COLOR_CLASS } from "./rainColor";
import {
  getTemperatureColor,
  getTemperatureGradientStops,
} from "./temperatureColor";

const TEMPERATURE_GRADIENT_ID = "temperatureGradient";
const FOCUS_MASK_ID = "focusedDayMask";

/*
 * ChartMarks draws the labels. Recharts still has to render the axes' ticks:
 * the ticks ChartMarks reads are the rendered ones.
 */
const noTick = () => null;

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
    stroke="var(--color-surface)"
    strokeWidth={2}
  />
);

type ForecastChartProps = {
  hourly: HourlyForecast[];
};

const ForecastChart = ({ hourly }: ForecastChartProps) => {
  const { data: settings } = useSettings();
  const isAnimated = !useReducedMotion();
  const unit = settings?.units.temperature ?? "celsius";
  // The chart starts at the hour the modal was opened in.
  const [now] = useState(() => new Date());
  const extraDays =
    settings?.dateTime.forecastDays ?? DEFAULT_EXTRA_FORECAST_DAYS;
  const data = buildForecastChartData(hourly, now, extraDays);
  // The day whose summary is under the pointer: the rest of the chart steps back.
  const [focusedDay, setFocusedDay] = useState<string>();
  const firstFocused = data.findIndex((point) => point.dayKey === focusedDay);
  const lastFocused = data.findLastIndex(
    (point) => point.dayKey === focusedDay,
  );
  const timeTicks = getTimeTicks(data);
  const [firstPoint] = data;
  const dayMarks: DayMark[] = [
    ...(firstPoint && hasRoomForFirstDayLabel(data)
      ? [
          {
            time: firstPoint.time,
            label: firstPoint.dayLabel,
            hasDivider: false,
          },
        ]
      : []),
    ...getDayBoundaries(data).map((point) => ({
      time: point.time,
      label: point.dayLabel,
      hasDivider: true,
    })),
  ];
  // The next 24 hours run into tomorrow, which isn't shown above the chart.
  const summaries = buildDailySummaries(data).slice(0, extraDays + 1);

  const temperatures = data.map((point) => point.temperature);
  const temperatureTicks = getTemperatureTicks(temperatures);
  const gradientStops = getTemperatureGradientStops(temperatures);
  const lineColor = gradientStops
    ? `url(#${TEMPERATURE_GRADIENT_ID})`
    : getTemperatureColor(temperatures[0] ?? 0);

  return (
    <ForecastLayout
      summaries={
        <DailySummaries
          summaries={summaries}
          focusedDay={focusedDay}
          onFocusDay={setFocusedDay}
        />
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            {gradientStops && (
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
            )}

            <FocusMask
              id={FOCUS_MASK_ID}
              count={data.length}
              first={firstFocused}
              last={lastFocused}
            />
          </defs>

          <XAxis
            dataKey="time"
            ticks={timeTicks}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: HAIRLINE_COLOR }}
            tick={noTick}
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
            tick={noTick}
            width={28}
            domain={[temperatureTicks[0], temperatureTicks.at(-1) ?? 0]}
            ticks={temperatureTicks}
          />

          <ChartMarks
            days={dayMarks}
            formatTime={(time) =>
              formatHour(new Date(time), settings?.dateTime.timeFormat)
            }
            formatTemperature={(celsius) =>
              `${Math.round(toDisplayTemperature(celsius, unit))}°`
            }
          />

          <Tooltip
            cursor={{ stroke: HAIRLINE_COLOR, strokeWidth: 1 }}
            isAnimationActive={false}
            wrapperStyle={{ visibility: "visible" }}
            content={({ active, payload }) => (
              <ForecastTooltip active={active} point={payload?.[0]?.payload} />
            )}
          />

          <Bar
            yAxisId="precipitation"
            dataKey="precipitation"
            name="Precipitation"
            fill="currentColor"
            radius={[2, 2, 0, 0]}
            maxBarSize={6}
            isAnimationActive={isAnimated}
            {...SERIES_ANIMATION}
          >
            {data.map((point) => (
              <Cell
                key={point.time}
                className={cn(
                  "duration-150",
                  RAIN_COLOR_CLASS,
                  focusedDay && point.dayKey !== focusedDay && "opacity-33",
                )}
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
            isAnimationActive={isAnimated}
            animationInterpolateFn={interpolateLine}
            {...SERIES_ANIMATION}
            mask={data.length > 1 ? `url(#${FOCUS_MASK_ID})` : undefined}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ForecastLayout>
  );
};

export default ForecastChart;
