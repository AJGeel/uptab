type Rgb = [number, number, number];

type ScaleStop = { temp: number; rgb: Rgb };

export type GradientStop = { offset: number; color: string };

/** Colors drift toward blue below ~8°C and toward red above ~28°C. */
const TEMPERATURE_SCALE: ScaleStop[] = [
  { temp: -10, rgb: [29, 78, 216] }, // freezing: deep blue
  { temp: 0, rgb: [56, 189, 248] }, // cold: sky blue
  { temp: 8, rgb: [52, 211, 153] }, // chilly edge: fresh green
  { temp: 28, rgb: [251, 191, 36] }, // warm edge: amber
  { temp: 35, rgb: [220, 38, 38] }, // hot: red
];

const GRADIENT_STOP_COUNT = 11;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const toCssColor = ([r, g, b]: Rgb) => `rgb(${r}, ${g}, ${b})`;

export const getTemperatureColor = (temp: number): string => {
  const [first] = TEMPERATURE_SCALE;
  const last = TEMPERATURE_SCALE[TEMPERATURE_SCALE.length - 1];

  if (temp <= first.temp) {
    return toCssColor(first.rgb);
  }

  if (temp >= last.temp) {
    return toCssColor(last.rgb);
  }

  const upperIndex = TEMPERATURE_SCALE.findIndex((stop) => stop.temp >= temp);
  const lower = TEMPERATURE_SCALE[upperIndex - 1];
  const upper = TEMPERATURE_SCALE[upperIndex];
  const t = (temp - lower.temp) / (upper.temp - lower.temp);

  const rgb = lower.rgb.map((channel, i) =>
    Math.round(lerp(channel, upper.rgb[i], t)),
  ) as Rgb;

  return toCssColor(rgb);
};

/**
 * Stops for a vertical gradient spanning a line's bounding box: offset 0 is
 * the top (highest temperature), offset 1 the bottom (lowest).
 *
 * Returns null for a flat line. Its bounding box has zero height, which makes
 * SVG drop the gradient, so callers should use a solid color instead.
 */
export const getTemperatureGradientStops = (
  temperatures: number[],
): GradientStop[] | null => {
  if (temperatures.length === 0) {
    return null;
  }

  const max = Math.max(...temperatures);
  const min = Math.min(...temperatures);

  if (max === min) {
    return null;
  }

  return Array.from({ length: GRADIENT_STOP_COUNT }, (_, i) => {
    const offset = i / (GRADIENT_STOP_COUNT - 1);

    return { offset, color: getTemperatureColor(lerp(max, min, offset)) };
  });
};
