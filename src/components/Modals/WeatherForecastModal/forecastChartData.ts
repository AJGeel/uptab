import {
  addDays,
  endOfDay,
  format,
  isToday,
  isWithinInterval,
  startOfHour,
} from "date-fns";

// Imported per module: the weather index pulls in the extension storage API.
import { TimeFormat } from "@/src/services/settings/types";
import {
  DEFAULT_EXTRA_FORECAST_DAYS,
  MAX_EXTRA_FORECAST_DAYS,
} from "@/src/services/weather/constants";
import { mapWeatherCode } from "@/src/services/weather/mapWeatherCode";
import { HourlyWeather } from "@/src/services/weather/types";

export type HourlyForecast = Pick<
  HourlyWeather,
  | "time"
  | "temperature_2m"
  | "apparent_temperature"
  | "relative_humidity_2m"
  | "precipitation"
  | "rain"
  | "showers"
  | "snowfall"
  | "weather_code"
  | "is_day"
  | "wind_speed_10m"
>;

export type ForecastChartPoint = {
  time: string;
  /** Kept to one decimal so the line stays smooth; round for display. */
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  /** In km/h. */
  windSpeed: number;
  /** Total of rain, showers and melted snow, in mm. */
  precipitation: number;
  /** Fresh snow, in cm. */
  snowfall: number;
  /** True when most of the precipitation falls as snow. */
  isSnow: boolean;
  dayKey: string;
  dayLabel: string;
  weatherCode: number;
  weather: ReturnType<typeof mapWeatherCode>;
};

export type DailySummary = {
  dayKey: string;
  dayLabel: string;
  high: number;
  low: number;
  precipitation: number;
  weather: ReturnType<typeof mapWeatherCode>;
};

const roundToTenth = (value: number) => Math.round(value * 10) / 10;

export const getDayLabel = (date: Date) =>
  isToday(date) ? "Today" : format(date, "EEEE");

export const formatTime = (date: Date, timeFormat: TimeFormat = "24h") =>
  format(date, timeFormat === "12h" ? "h:mm a" : "HH:mm");

/** A shorter time for the axis, where the labels sit close together. */
export const formatHour = (date: Date, timeFormat: TimeFormat = "24h") =>
  format(date, timeFormat === "12h" ? "h a" : "HH:mm");

/** Hourly points from the current hour through the end of today plus `extraDays`. */
export const buildForecastChartData = (
  hourly: HourlyForecast[],
  now = new Date(),
  extraDays = DEFAULT_EXTRA_FORECAST_DAYS,
): ForecastChartPoint[] => {
  const range = {
    start: startOfHour(now),
    // A setting saved when the limit was higher can exceed what's fetched.
    end: endOfDay(addDays(now, Math.min(extraDays, MAX_EXTRA_FORECAST_DAYS))),
  };

  return hourly
    .map((hour) => ({ hour, date: new Date(hour.time) }))
    .filter(({ date }) => isWithinInterval(date, range))
    .map(({ hour, date }) => ({
      time: hour.time,
      temperature: roundToTenth(hour.temperature_2m),
      apparentTemperature: Math.round(hour.apparent_temperature),
      humidity: Math.round(hour.relative_humidity_2m),
      windSpeed: Math.round(hour.wind_speed_10m),
      precipitation: roundToTenth(hour.precipitation),
      snowfall: roundToTenth(hour.snowfall),
      isSnow:
        hour.snowfall > 0 && hour.rain + hour.showers < hour.precipitation / 2,
      dayKey: format(date, "yyyy-MM-dd"),
      dayLabel: getDayLabel(date),
      weatherCode: hour.weather_code,
      weather: mapWeatherCode(hour.weather_code, hour.is_day === 1),
    }));
};

/** The first point of each new day, skipping the first point in the chart. */
export const getDayBoundaries = (points: ForecastChartPoint[]) =>
  points.filter((point, i) => i > 0 && point.dayKey !== points[i - 1].dayKey);

const TIME_TICK_HOURS = [6, 12, 18];
/** Several days leave little room for each: noon alone is enough. */
const SPARSE_TIME_TICK_HOURS = [12];
const MAX_DAYS_WITH_ALL_TICKS = 3;

/** Times for the x-axis ticks. Midnight is left out: day labels mark it. */
export const getTimeTicks = (points: ForecastChartPoint[]) => {
  const dayCount = new Set(points.map((point) => point.dayKey)).size;
  const tickHours =
    dayCount > MAX_DAYS_WITH_ALL_TICKS
      ? SPARSE_TIME_TICK_HOURS
      : TIME_TICK_HOURS;

  return points
    .filter((point) => tickHours.includes(new Date(point.time).getHours()))
    .map((point) => point.time);
};

/** Roughly the share of the chart a label needs, with the day's hours spread across it. */
const MIN_FIRST_DAY_SHARE = 0.08;

/** The first day may be nearly over, leaving no room for its name before the next one. */
export const hasRoomForFirstDayLabel = (points: ForecastChartPoint[]) => {
  const firstDay = points.filter((point) => point.dayKey === points[0]?.dayKey);

  return firstDay.length >= points.length * MIN_FIRST_DAY_SHARE;
};

/**
 * One summary per day in the chart. Like Open-Meteo's daily `weather_code`,
 * the shown weather is the most severe code of the day (WMO codes increase
 * with severity).
 */
export const buildDailySummaries = (
  points: ForecastChartPoint[],
): DailySummary[] => {
  const days = new Map<string, ForecastChartPoint[]>();

  for (const point of points) {
    days.set(point.dayKey, [...(days.get(point.dayKey) ?? []), point]);
  }

  return Array.from(days.entries()).map(([dayKey, dayPoints]) => {
    const temperatures = dayPoints.map((point) =>
      Math.round(point.temperature),
    );
    const worstCode = Math.max(...dayPoints.map((point) => point.weatherCode));

    return {
      dayKey,
      dayLabel: dayPoints[0].dayLabel,
      high: Math.max(...temperatures),
      low: Math.min(...temperatures),
      precipitation: roundToTenth(
        dayPoints.reduce((sum, point) => sum + point.precipitation, 0),
      ),
      weather: mapWeatherCode(worstCode, true),
    };
  });
};
