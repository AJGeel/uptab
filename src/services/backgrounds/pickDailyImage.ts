import { BackgroundImage, Catalogue } from "./types";

export const DEFAULT_THEME = "holland";

/** The photo shown on `date` (yyyy-MM-dd), stored so arrow-key browsing sticks. */
export type DailyPick = { date: string; imageId: string };

/**
 * Photos from the enabled themes. Theme IDs that are no longer in the
 * catalogue are ignored. If nothing is left, falls back to the default
 * theme, or else to every photo.
 */
export const getEnabledImages = (catalogue: Catalogue, themes: string[]) => {
  const byThemes = (ids: string[]) =>
    catalogue.images.filter((image) => ids.includes(image.theme));

  const enabled = byThemes(themes);

  if (enabled.length > 0) {
    return enabled;
  }

  const defaults = byThemes([DEFAULT_THEME]);

  return defaults.length > 0 ? defaults : catalogue.images;
};

/** A well-mixed hash, so consecutive dates don't pick neighbouring photos. */
const hashDate = (date: string) => {
  let hash = [...date].reduce(
    (acc, char) => Math.imul(acc ^ char.charCodeAt(0), 0x01000193),
    0x811c9dc5,
  );

  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);

  return (hash ^ (hash >>> 16)) >>> 0;
};

/**
 * Today's photo: the stored pick if it's from today and still available,
 * otherwise one chosen by the date, so it's the same in every new tab.
 */
export const pickDailyImage = (
  images: BackgroundImage[],
  date: string,
  stored?: DailyPick | null,
): BackgroundImage | undefined => {
  const storedImage =
    stored?.date === date
      ? images.find((image) => image.id === stored.imageId)
      : undefined;

  return storedImage ?? images[hashDate(date) % images.length];
};
