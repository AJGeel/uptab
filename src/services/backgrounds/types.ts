/** The fields of the remote catalogue (docs/remote-backgrounds.md) that UpTab uses. */
export type Catalogue = {
  themes: CatalogueTheme[];
  images: BackgroundImage[];
};

export type CatalogueTheme = {
  id: string;
  name: string;
  /** Photos that represent the theme in the picker, in order. */
  coverImageIds: string[];
};

export type BackgroundImage = {
  id: string;
  theme: string;
  author: string | null;
  link: string | null;
  color: string;
  /** Smallest first. */
  sources: { width: number; url: string }[];
  /** A small rendition for the picker, if the catalogue has one. */
  thumbnail: { width: number; url: string } | null;
};
