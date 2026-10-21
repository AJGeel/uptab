/**
 * The fixed moment and weather every screenshot shows: a sunny summer
 * afternoon in Amsterdam, then a cloudier day and a showery one, so the
 * forecast chart has some shape.
 */

export const TIME_ZONE = "Europe/Amsterdam";
export const LOCATION = { latitude: 52.3676, longitude: 4.9041 };

/** Saturday 20 June 2026, 16:20 in Amsterdam (UTC+2). */
export const NOW = new Date("2026-06-20T16:20:00+02:00");
/** As the extension formats it, for the stored daily photo. */
export const TODAY = "2026-06-20";

const CURRENT_TEMPERATURE = 25;

/** Per day: lowest and highest temperature, WMO weather code, rain at its peak. */
const DAYS = [
  { low: 15, high: 26, code: 0, rain: 0 },
  { low: 14, high: 22, code: 2, rain: 0 },
  { low: 13, high: 19, code: 80, rain: 1.6 },
];

const SUNRISE = 5;
const SUNSET = 22;

/**
 * A smooth curve over all days: coldest around 03:00, warmest around 15:00,
 * with each day's low and high blended into the next so midnight has no step.
 */
const temperatureAt = (hourOfForecast: number) => {
  const position = Math.min(
    Math.max((hourOfForecast - 12) / 24, 0),
    DAYS.length - 1,
  );
  const index = Math.min(Math.floor(position), DAYS.length - 2);
  const blend = position - index;
  const [today, tomorrow] = [DAYS[index], DAYS[index + 1]];
  const low = today.low + (tomorrow.low - today.low) * blend;
  const high = today.high + (tomorrow.high - today.high) * blend;
  const warmth = (1 + Math.cos(((hourOfForecast - 15) / 24) * 2 * Math.PI)) / 2;

  return Math.round((low + (high - low) * warmth) * 10) / 10;
};

/** Rain from early afternoon to evening, heaviest around 16:00. */
const rainAt = (hour: number, { rain }: (typeof DAYS)[number]) =>
  hour >= 13 && hour <= 19
    ? Math.round(rain * (1 - Math.abs(hour - 16) / 4) * 10) / 10
    : 0;

const pad = (value: number) => String(value).padStart(2, "0");

const units = {
  time: "iso8601",
  temperature_2m: "°C",
  relative_humidity_2m: "%",
  apparent_temperature: "°C",
  precipitation: "mm",
  rain: "mm",
  showers: "mm",
  snowfall: "cm",
  weather_code: "wmo code",
  is_day: "",
};

/** An Open-Meteo forecast response (see src/services/weather/types.ts). */
export const weather = () => {
  const hours = DAYS.flatMap((day, index) =>
    Array.from({ length: 24 }, (_, hour) => ({ day, index, hour })),
  );
  const rain = hours.map(({ day, hour }) => rainAt(hour, day));

  return {
    latitude: LOCATION.latitude,
    longitude: LOCATION.longitude,
    generationtime_ms: 0.1,
    utc_offset_seconds: 7200,
    timezone: TIME_ZONE,
    timezone_abbreviation: "GMT+2",
    elevation: 2,
    current_units: { ...units, interval: "seconds" },
    current: {
      time: "2026-06-20T16:15",
      interval: 900,
      temperature_2m: CURRENT_TEMPERATURE,
      relative_humidity_2m: 48,
      apparent_temperature: CURRENT_TEMPERATURE,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      weather_code: DAYS[0].code,
      is_day: 1,
    },
    hourly_units: units,
    hourly: {
      time: hours.map(
        ({ index, hour }) => `2026-06-${20 + index}T${pad(hour)}:00`,
      ),
      temperature_2m: hours.map((_, i) => temperatureAt(i)),
      relative_humidity_2m: hours.map(() => 55),
      apparent_temperature: hours.map((_, i) => temperatureAt(i)),
      precipitation: rain,
      rain: hours.map(() => 0),
      showers: rain,
      snowfall: hours.map(() => 0),
      weather_code: hours.map(({ day }, i) =>
        rain[i] > 0 ? day.code : Math.min(day.code, 2),
      ),
      is_day: hours.map(({ hour }) =>
        hour >= SUNRISE && hour < SUNSET ? 1 : 0,
      ),
    },
  };
};

/** A Nominatim reverse-geocoding response (see src/services/location/types.ts). */
export const geocode = () => ({
  address: {
    city: "Amsterdam",
    state: "North Holland",
    country: "Netherlands",
    country_code: "nl",
    postcode: "1012",
    road: "Dam",
    house_number: "1",
  },
});
