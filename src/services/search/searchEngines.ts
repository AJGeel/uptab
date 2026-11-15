export type SearchEngineId =
  "duckduckgo" | "google" | "bing" | "brave" | "ecosia" | "startpage";

export const DEFAULT_SEARCH_ENGINE: SearchEngineId = "duckduckgo";

/*
 * A fixed address, not the browser's own default engine: that would need the
 * `search` permission, and these work the same in Chrome and Firefox.
 */
export const SEARCH_ENGINES: {
  id: SearchEngineId;
  label: string;
  url: string;
}[] = [
  { id: "duckduckgo", label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { id: "ecosia", label: "Ecosia", url: "https://www.ecosia.org/search?q=" },
  { id: "google", label: "Google", url: "https://www.google.com/search?q=" },
];

const getEngine = (id: SearchEngineId) =>
  SEARCH_ENGINES.find((engine) => engine.id === id) ??
  SEARCH_ENGINES.find(
    ({ id: fallback }) => fallback === DEFAULT_SEARCH_ENGINE,
  )!;

export const getSearchEngineLabel = (id: SearchEngineId) => getEngine(id).label;

export const getSearchUrl = (id: SearchEngineId, query: string) =>
  getEngine(id).url + encodeURIComponent(query.trim());
