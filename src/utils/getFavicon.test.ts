import { beforeEach, describe, expect, it, vi } from "vitest";

const getURL = vi.hoisted(() => vi.fn());

vi.mock("webextension-polyfill", () => ({ runtime: { getURL } }));

import {
  getFaviconSources,
  isDuckDuckGoPlaceholder,
  isMissingFavicon,
} from "./getFavicon";

const setBrowser = (origin: string) =>
  getURL.mockImplementation((path: string) => `${origin}${path}`);

const WELL_KNOWN = [
  "https://example.com/favicon.ico",
  "https://example.com/favicon.png",
  "https://example.com/favicon.svg",
  "https://example.com/apple-touch-icon.png",
  "https://example.com/apple-touch-icon-precomposed.png",
  "https://icons.duckduckgo.com/ip3/example.com.ico",
];

describe("getFaviconSources", () => {
  it("asks Chrome's cache first, then the site itself, then DuckDuckGo", () => {
    setBrowser("chrome-extension://abc");

    expect(getFaviconSources("https://example.com/page?a=b")).toEqual([
      "chrome-extension://abc/_favicon/?pageUrl=https%3A%2F%2Fexample.com%2Fpage%3Fa%3Db&size=32",
      ...WELL_KNOWN,
    ]);
  });

  it("skips the cache on Firefox", () => {
    setBrowser("moz-extension://abc");

    expect(getFaviconSources("https://example.com/some/page")).toEqual(
      WELL_KNOWN,
    );
  });

  it("has nothing to ask for a page that isn't on the web", () => {
    setBrowser("moz-extension://abc");

    expect(getFaviconSources("")).toEqual([]);
    expect(getFaviconSources("about:blank")).toEqual([]);
    expect(getFaviconSources("chrome://settings")).toEqual([]);
  });
});

describe("isDuckDuckGoPlaceholder", () => {
  const image = (size: number) =>
    ({ naturalWidth: size, naturalHeight: size }) as HTMLImageElement;
  const duckDuckGo = "https://icons.duckduckgo.com/ip3/example.com.ico";

  it("spots DuckDuckGo's stand-in by its size", () => {
    expect(isDuckDuckGoPlaceholder(duckDuckGo, image(48))).toBe(true);
    expect(isDuckDuckGoPlaceholder(duckDuckGo, image(32))).toBe(false);
  });

  it("only looks at DuckDuckGo's icons", () => {
    expect(
      isDuckDuckGoPlaceholder("https://example.com/favicon.png", image(48)),
    ).toBe(false);
  });
});

describe("isMissingFavicon", () => {
  const respondWith = (bytes: Record<string, number[]>) =>
    vi.stubGlobal(
      "fetch",
      vi.fn((src: string) =>
        Promise.resolve({
          arrayBuffer: () =>
            Promise.resolve(new Uint8Array(bytes[src] ?? [1]).buffer),
        }),
      ),
    );

  beforeEach(() => setBrowser("chrome-extension://abc"));

  it("spots Chrome's generic icon by the answer for an unknown page", async () => {
    const [missing] = getFaviconSources("https://never-visited.com");
    const [known] = getFaviconSources("https://visited.com");
    const [sentinel] = getFaviconSources("https://uptab.invalid/");

    respondWith({ [sentinel]: [9, 9], [missing]: [9, 9], [known]: [1, 2, 3] });

    expect(await isMissingFavicon(missing)).toBe(true);
    expect(await isMissingFavicon(known)).toBe(false);
  });

  it("leaves other icons alone without fetching", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect(await isMissingFavicon("https://example.com/icon.png")).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
