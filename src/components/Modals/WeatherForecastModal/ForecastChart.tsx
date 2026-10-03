import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  buildForecastChartData,
  ForecastChartPoint,
  formatTime,
  getDayBoundaries,
  HourlyForecast,
} from "./forecastChartData";
import ForecastTooltip from "./ForecastTooltip";
import {
  getTemperatureColor,
  getTemperatureGradientStops,
} from "./temperatureColor";

const TEMPERATURE_GRADIENT_ID = "temperatureGradient";

const AXIS_TICK = { fontSize: 12 };
const Y_AXIS_WIDTH = 40;

const DAY_SEPARATOR_COLOR = "rgba(0, 0, 0, 0.25)";
const DAY_LABEL_COLOR = "rgba(0, 0, 0, 0.45)";

type TemperatureDotProps = {
  cx?: number;
  cy?: number;
  payload?: ForecastChartPoint;
};

const TemperatureDot = ({ cx, cy, payload }: TemperatureDotProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={5}
    fill={getTemperatureColor(payload?.temperature ?? 0)}
    stroke="white"
    strokeWidth={2}
  />
);

type ForecastChartProps = {
  hourly: HourlyForecast[];
};

const ForecastChart = ({ hourly }: ForecastChartProps) => {
  const data = buildForecastChartData(hourly);
  const dayBoundaries = getDayBoundaries(data);

  const temperatures = data.map((point) => point.temperature);
  const gradientStops = getTemperatureGradientStops(temperatures);
  const lineColor = gradientStops
    ? `url(#${TEMPERATURE_GRADIENT_ID})`
    : getTemperatureColor(temperatures[0] ?? 0);

  return (
    <div className="mt-4 h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
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

          <CartesianGrid
            strokeDasharray="10 5"
            stroke="currentColor"
            horizontal={false}
            className="text-black/10"
          />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tick={AXIS_TICK}
            tickFormatter={(value: string) => formatTime(new Date(value))}
          />

          <YAxis
            yAxisId="rain"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            width={Y_AXIS_WIDTH}
            tickFormatter={(value) => `${value} mm`}
          />

          <YAxis
            yAxisId="temperature"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            width={Y_AXIS_WIDTH}
            tickFormatter={(value) => `${value}°`}
          />

          {dayBoundaries.map((point) => (
            <ReferenceLine
              key={point.time}
              x={point.time}
              yAxisId="temperature"
              stroke={DAY_SEPARATOR_COLOR}
              strokeDasharray="4 4"
              label={{
                value: point.dayLabel,
                position: "insideTopLeft",
                fontSize: 12,
                fill: DAY_LABEL_COLOR,
              }}
            />
          ))}

          <Tooltip
            cursor={{ fill: "currentColor", className: "text-black/5" }}
            content={({ active, payload }) => (
              <ForecastTooltip active={active} point={payload?.[0]?.payload} />
            )}
          />

          <Bar
            yAxisId="rain"
            dataKey="rain"
            name="Rain"
            fill="currentColor"
            className="text-sky-400"
            radius={[3, 3, 0, 0]}
            maxBarSize={12}
          />

          <Line
            yAxisId="temperature"
            type="monotone"
            dataKey="temperature"
            name="Temperature"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={false}
            activeDot={TemperatureDot}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
