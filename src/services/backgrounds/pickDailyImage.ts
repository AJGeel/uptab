import { BackgroundImage, Catalogue } from "./types";

/** The photo shown for a stretch of time (`date`: see getPhotoPeriod), stored so arrow-key browsing sticks. */
export type DailyPick = { date: string; imageId: string };

/**
 * The themes in use: the enabled ones that are still in the catalogue and have
 * photos. With none enabled (the default) or none of them left: every theme.
 */
export const getEnabledThemes = (catalogue: Catalogue, themes: string[]) => {
  const available = catalogue.themes
    .map((theme) => theme.id)
    .filter((id) => catalogue.images.some((image) => image.theme === id));
  const enabled = available.filter((id) => themes.includes(id));

  return enabled.length > 0 ? enabled : available;
};

/** Photos from the themes in use (see getEnabledThemes). */
export const getEnabledImages = (catalogue: Catalogue, themes: string[]) => {
  const enabled = getEnabledThemes(catalogue, themes);

  return catalogue.images.filter((image) => enabled.includes(image.theme));
};

/** A well-mixed hash, so similar inputs give unrelated results. */
export const hash = (value: string) => {
  let result = [...value].reduce(
    (acc, char) => Math.imul(acc ^ char.charCodeAt(0), 0x01000193),
    0x811c9dc5,
  );

  result = Math.imul(result ^ (result >>> 16), 0x85ebca6b);
  result = Math.imul(result ^ (result >>> 13), 0xc2b2ae35);

  return (result ^ (result >>> 16)) >>> 0;
};

/**
 * Every photo in the order they're browsed for the date: a shuffle that's the
 * same each time, so going forward and back meets the same photos. Each photo
 * is scored on its own, so devices with slightly different photos (local ones,
 * an older catalogue) still agree on the shared ones.
 */
export const orderImages = (images: BackgroundImage[], date: string) =>
  images
    .map((image) => ({ image, score: hash(`${date}:${image.id}`) }))
    .sort((a, b) => b.score - a.score || (a.image.id < b.image.id ? -1 : 1))
    .map(({ image }) => image);

/**
 * Today's photo: the stored pick if it's from today and still available,
 * otherwise the first of the date's order (see orderImages).
 */
export const pickDailyImage = (
  images: BackgroundImage[],
  date: string,
  stored?: DailyPick | null,
): BackgroundImage | undefined =>
  (stored?.date === date
    ? images.find((image) => image.id === stored.imageId)
    : undefined) ?? orderImages(images, date)[0];
