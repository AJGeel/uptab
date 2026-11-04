import { runtime } from "webextension-polyfill";

export const FALLBACK_FAVICON = "/favicon-fallback.svg";

const FAVICON_SIZE = 32;

/** Where sites commonly keep an icon, without having to read their pages. */
const WELL_KNOWN_PATHS = [
  "/favicon.ico",
  "/favicon.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
];

const DUCKDUCKGO_ICONS = "https://icons.duckduckgo.com/ip3/";

const isFirefox = () => runtime.getURL("").startsWith("moz-extension:");

const chromeFaviconBase = () => runtime.getURL("/_favicon/");

export const isChromeFavicon = (src: string) =>
  src.startsWith(chromeFaviconBase());

const getChromeFavicon = (url: string) =>
  `${chromeFaviconBase()}?pageUrl=${encodeURIComponent(url)}&size=${FAVICON_SIZE}`;

/*
 * Where to look for a page's icon, best first. Chrome serves icons from its own
 * cache through the `favicon` permission, so nothing leaves the browser. Firefox
 * has no such API, and Chrome's cache doesn't know pages it hasn't visited, so
 * both then ask the site itself. DuckDuckGo's service is the last resort, and
 * is the only step that tells anyone else which sites are bookmarked.
 */
export const getFaviconSources = (url: string) => {
  const sources = isFirefox() ? [] : [getChromeFavicon(url)];

  try {
    const { origin, hostname } = new URL(url);

    if (origin.startsWith("http")) {
      sources.push(
        ...WELL_KNOWN_PATHS.map((path) => `${origin}${path}`),
        `${DUCKDUCKGO_ICONS}${hostname}.ico`,
      );
    }
  } catch {
    // Not a page we can ask.
  }

  return sources;
};

/*
 * For a site it doesn't know, DuckDuckGo answers 404 with a grey 48x48 stand-in
 * that an <img> shows all the same, and the status can't be read without a host
 * permission. So an icon of exactly that size from there is taken as not found,
 * at the cost of the odd real icon of that size.
 */
export const isDuckDuckGoPlaceholder = (
  src: string,
  { naturalWidth, naturalHeight }: HTMLImageElement,
) =>
  src.startsWith(DUCKDUCKGO_ICONS) &&
  naturalWidth === 48 &&
  naturalHeight === 48;

const readBytes = async (src: string) =>
  new Uint8Array(await (await fetch(src)).arrayBuffer());

let defaultIcon: Promise<Uint8Array> | undefined;

/*
 * On a cache miss Chrome answers with its generic globe instead of an error,
 * so a miss is spotted by comparing with the answer for a page it can't know.
 */
export const isMissingFavicon = async (src: string) => {
  if (!isChromeFavicon(src)) {
    return false;
  }

  try {
    defaultIcon ??= readBytes(getChromeFavicon("https://uptab.invalid/"));

    const [icon, expected] = await Promise.all([readBytes(src), defaultIcon]);

    return (
      icon.length === expected.length &&
      icon.every((byte, index) => byte === expected[index])
    );
  } catch {
    return false;
  }
};
