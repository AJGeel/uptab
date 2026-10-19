import { BackgroundImage, Catalogue } from "./types";

export const DEFAULT_THEME = "holland";

/** The photo shown on `date` (yyyy-MM-dd), stored so arrow-key browsing sticks. */
export type DailyPick = { date: string; imageId: string };

/**
 * The themes in use: the enabled ones that are still in the catalogue and have
 * photos. If none are left, the default theme, or else every theme.
 */
export const getEnabledThemes = (catalogue: Catalogue, themes: string[]) => {
  const available = catalogue.themes
    .map((theme) => theme.id)
    .filter((id) => catalogue.images.some((image) => image.theme === id));
  const enabled = available.filter((id) => themes.includes(id));

  if (enabled.length > 0) {
    return enabled;
  }

  return available.includes(DEFAULT_THEME) ? [DEFAULT_THEME] : available;
};

/** Photos from the themes in use (see getEnabledThemes). */
export const getEnabledImages = (catalogue: Catalogue, themes: string[]) => {
  const enabled = getEnabledThemes(catalogue, themes);

  return catalogue.images.filter((image) => enabled.includes(image.theme));
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
