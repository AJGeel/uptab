import { BackgroundImage } from "./types";

/**
 * The smallest source at least `targetWidth` wide, else the largest one.
 * Sources are sorted smallest first (see parseCatalogue).
 */
export const pickRendition = (
  sources: BackgroundImage["sources"],
  targetWidth: number,
) => sources.find((source) => source.width >= targetWidth) ?? sources.at(-1);
