import { buildForecastChartData, HourlyForecast } from "./forecastChartData";

export type ForecastMood = "great" | "ok" | "bad";

export const DEFAULT_CLOSE_LABEL = "Looking good!";

export const CLOSE_LABELS: Record<ForecastMood, string[]> = {
  great: [
    "Looking good!",
    "Sunglasses time",
    "Absolutely lovely",
    "Time to go outside",
    "Chef's kiss",
    "Can't complain",
    "Outside awaits",
    "Pure sunshine",
    "Ten out of ten",
    "Nice one, sky",
  ],
  ok: [
    "Could be worse",
    "Fair enough",
    "It's fine, really",
    "Bring a layer",
    "Weather happens",
    "Mediocre, but mine",
    "Not bad, not great",
    "Meh, I'll take it",
    "Good enough",
    "Classic grey area",
  ],
  bad: [
    "It do be like that",
    "Umbrella, assemble",
    "Stay inside, then",
    "Well, that's wet",
    "Cozy indoor day",
    "Rain check on life",
    "Not looking good",
    "Thanks, I hate it",
    "Time for tea",
    "Brace yourself",
  ],
};

/**
 * Judges the next 24 hours by their most severe WMO code (codes increase with
 * severity): clear to partly cloudy is great, overcast, fog and drizzle are
 * ok, and rain, snow and thunderstorms are bad.
 */
export const getForecastMood = (
  hourly: HourlyForecast[],
  now = new Date(),
): ForecastMood | undefined => {
  const points = buildForecastChartData(hourly, now, 0);

  if (points.length === 0) {
    return undefined;
  }

  const worstCode = Math.max(...points.map((point) => point.weatherCode));

  if (worstCode <= 2) {
    return "great";
  }

  return worstCode <= 57 ? "ok" : "bad";
};

export const pickCloseLabel = (
  mood: ForecastMood | undefined,
  random = Math.random,
) => {
  if (!mood) {
    return DEFAULT_CLOSE_LABEL;
  }

  const labels = CLOSE_LABELS[mood];

  return labels[Math.floor(random() * labels.length)];
};
