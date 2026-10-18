import { BackgroundImage, Catalogue, CatalogueTheme } from "./types";

const SUPPORTED_VERSION = 1;

type Unknown = Record<string, unknown>;

const isObject = (value: unknown): value is Unknown =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const parseTheme = (raw: unknown): CatalogueTheme | undefined =>
  isObject(raw) && isString(raw.id) && isString(raw.name)
    ? { id: raw.id, name: raw.name }
    : undefined;

const parseImage = (raw: unknown): BackgroundImage | undefined => {
  if (!isObject(raw) || !isString(raw.id) || !isString(raw.theme)) {
    return;
  }

  const sources = (Array.isArray(raw.sources) ? raw.sources : [])
    .filter(
      (source): source is { width: number; url: string } =>
        isObject(source) &&
        typeof source.width === "number" &&
        isString(source.url),
    )
    .map(({ width, url }) => ({ width, url }))
    .sort((a, b) => a.width - b.width);

  if (sources.length === 0) {
    return;
  }

  return {
    id: raw.id,
    theme: raw.theme,
    author: isString(raw.author) ? raw.author : null,
    link: isString(raw.link) ? raw.link : null,
    color: isString(raw.color) ? raw.color : "#000000",
    sources,
  };
};

/**
 * Reads a catalogue leniently: unknown fields are ignored and broken images
 * are skipped. Returns undefined for an unsupported version, which is a
 * breaking change UpTab can't read.
 */
export const parseCatalogue = (raw: unknown): Catalogue | undefined => {
  if (!isObject(raw) || raw.version !== SUPPORTED_VERSION) {
    return;
  }

  const themes = (Array.isArray(raw.themes) ? raw.themes : [])
    .map(parseTheme)
    .filter((theme) => theme !== undefined);

  const themeIds = new Set(themes.map((theme) => theme.id));

  const images = (Array.isArray(raw.images) ? raw.images : [])
    .map(parseImage)
    .filter(
      (image): image is BackgroundImage =>
        image !== undefined && themeIds.has(image.theme),
    );

  return { themes, images };
};
