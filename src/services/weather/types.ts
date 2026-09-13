/** @source https://open-meteo.com/ */

export type DailyWeatherDescription = {
  description: string;
  image: string;
};

export type WeatherDescription = {
  [code: string]: {
    day: DailyWeatherDescription;
    night: DailyWeatherDescription;
  };
};

/**
 * Units returned by Open-Meteo.
 */
type WeatherUnits = {
  time: "iso8601";
  temperature_2m: "°C";
  relative_humidity_2m: "%";
  apparent_temperature: "°C";
  precipitation: "mm";
  rain: "mm";
  showers: "mm";
  snowfall: "cm";
  weather_code: "wmo code";
};

type CurrentUnits = WeatherUnits & {
  interval: "seconds";
};

type HourlyUnits = WeatherUnits;

export type CurrentWeather = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
};

export type OpenMeteoHourlyWeather = {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  weather_code: number[];
};

/**
 * Raw response returned by Open-Meteo.
 */
export type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: CurrentUnits;
  current: CurrentWeather;

  hourly_units: HourlyUnits;
  hourly: OpenMeteoHourlyWeather;
};

/**
 * A single hourly weather observation used by the application.
 */
export type HourlyWeather = {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
};

/**
 * Weather data used by the application.
 *
 * This is intentionally different from OpenMeteoResponse:
 * Open-Meteo returns hourly data as separate arrays, while the
 * application works with an array of hourly weather objects.
 */
export type Weather = {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  timezone_abbreviation: string;

  current: CurrentWeather;
  hourly: HourlyWeather[];
};
