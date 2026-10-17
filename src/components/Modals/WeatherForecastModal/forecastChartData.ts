import {
  addDays,
  endOfDay,
  format,
  isToday,
  isWithinInterval,
  startOfHour,
} from "date-fns";

// Imported per module: the weather index pulls in the extension storage API.
import { FORECAST_DAYS } from "@/src/services/weather/constants";
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
>;

export type ForecastChartPoint = {
  time: string;
  /** Kept to one decimal so the line stays smooth; round for display. */
  temperature: number;
  apparentTemperature: number;
  humidity: number;
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

export const formatTime = (date: Date) => format(date, "HH:mm");

/** Hourly points from the current hour through the last fetched day. */
export const buildForecastChartData = (
  hourly: HourlyForecast[],
  now = new Date(),
): ForecastChartPoint[] => {
  const range = {
    start: startOfHour(now),
    end: endOfDay(addDays(now, FORECAST_DAYS - 1)),
  };

  return hourly
    .map((hour) => ({ hour, date: new Date(hour.time) }))
    .filter(({ date }) => isWithinInterval(date, range))
    .map(({ hour, date }) => ({
      time: hour.time,
      temperature: roundToTenth(hour.temperature_2m),
      apparentTemperature: Math.round(hour.apparent_temperature),
      humidity: Math.round(hour.relative_humidity_2m),
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

/** Times for the x-axis ticks. Midnight is left out: day labels mark it. */
export const getTimeTicks = (points: ForecastChartPoint[]) =>
  points
    .filter((point) =>
      TIME_TICK_HOURS.includes(new Date(point.time).getHours()),
    )
    .map((point) => point.time);

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
