const STORAGE_KEY = "faviconCache";

/** An icon that wasn't found is looked for again after this long. */
const NOT_FOUND_TTL = 24 * 60 * 60 * 1000;

/** `index` is which of the page's sources worked, or past the last one when none did. */
type Entry = { index: number; at: number };

let entries: Record<string, Entry> | undefined;

/*
 * Kept in localStorage, as unlike the extension storage it can be read
 * straight away, so a new tab shows its icons from the first frame.
 */
const load = () => {
  if (!entries) {
    try {
      entries = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      entries = {};
    }
  }

  return entries as Record<string, Entry>;
};

/** Which source to start with, or undefined when nothing is known (or worth trusting). */
export const getCachedFaviconIndex = (
  url: string,
  sourceCount: number,
  now = Date.now(),
) => {
  const entry = load()[url];

  if (!entry) {
    return;
  }

  if (entry.index >= sourceCount) {
    return now - entry.at < NOT_FOUND_TTL ? sourceCount : undefined;
  }

  return entry.index;
};

export const setCachedFaviconIndex = (
  url: string,
  index: number,
  now = Date.now(),
) => {
  const cache = load();

  if (cache[url]?.index === index) {
    return;
  }

  cache[url] = { index, at: now };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Full or unavailable: the icons are found again next time.
  }
};
