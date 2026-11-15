import { SearchEngineId, getSearchUrl } from "./searchEngines";

const WEB_URL = /^https?:\/\/\S+$/i;
/** `example.com`, `sub.example.co.uk/path?x`, `localhost:3000`, `192.168.0.1`. */
const BARE_ADDRESS =
  /^(?:(?:[a-z0-9-]+\.)+[a-z]{2,}|localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?(?:[/?#]\S*)?$/i;

export type QueryTarget = { kind: "address" | "search"; url: string };

/**
 * What <kbd>Enter</kbd> opens when nothing matches: the text as an address if it
 * looks like one, otherwise a web search. Only web addresses are opened, so
 * `javascript:` and the like end up as a search.
 */
export const resolveQuery = (
  query: string,
  engine: SearchEngineId,
): QueryTarget => {
  const text = query.trim();

  if (WEB_URL.test(text)) {
    return { kind: "address", url: text };
  }

  if (BARE_ADDRESS.test(text)) {
    return { kind: "address", url: `https://${text}` };
  }

  return { kind: "search", url: getSearchUrl(engine, text) };
};
