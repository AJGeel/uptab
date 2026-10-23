import { LOCAL_THEME } from "./localPhotos";
import { BackgroundImage, Catalogue } from "./types";

/**
 * The catalogue with local photos added as their own theme, listed first, so
 * they're picked and browsed like any other theme. Works without a catalogue.
 */
export const withLocalPhotos = (
  catalogue: Catalogue | null,
  localImages: BackgroundImage[],
): Catalogue | null => {
  if (localImages.length === 0) {
    return catalogue;
  }

  return {
    themes: [
      { id: LOCAL_THEME, name: "My photos", coverImageIds: [] },
      ...(catalogue?.themes ?? []),
    ],
    images: [...localImages, ...(catalogue?.images ?? [])],
  };
};
