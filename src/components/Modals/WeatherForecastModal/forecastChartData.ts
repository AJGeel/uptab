import {
  addDays,
  endOfDay,
  format,
  isToday,
  isWithinInterval,
  startOfHour,
} from "date-fns";

import { mapWeatherCode } from "@/src/services/weather";

export type HourlyForecast = {
  time: string;
  temperature_2m: number;
  rain: number;
  weather_code: Parameters<typeof mapWeatherCode>[0];
};

export type ForecastChartPoint = {
  time: string;
  temperature: number;
  rain: number;
  dayLabel: string;
  weather: ReturnType<typeof mapWeatherCode>;
};

const FORECAST_DAYS_AHEAD = 2;

export const getDayLabel = (date: Date) =>
  isToday(date) ? "Today" : format(date, "EEEE");

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Hourly points from the current hour through the end of the day after tomorrow. */
export const buildForecastChartData = (
  hourly: HourlyForecast[],
  now = new Date(),
): ForecastChartPoint[] => {
  const range = {
    start: startOfHour(now),
    end: endOfDay(addDays(now, FORECAST_DAYS_AHEAD)),
  };

  return hourly
    .filter((hour) => isWithinInterval(new Date(hour.time), range))
    .map((hour) => ({
      time: hour.time,
      temperature: Math.round(hour.temperature_2m),
      rain: Number(hour.rain.toFixed(1)),
      dayLabel: getDayLabel(new Date(hour.time)),
      weather: mapWeatherCode(hour.weather_code),
    }));
};

/** The first point of each new day, skipping the first point in the chart. */
export const getDayBoundaries = (points: ForecastChartPoint[]) =>
  points.filter(
    (point, i) => i > 0 && point.dayLabel !== points[i - 1].dayLabel,
  );
