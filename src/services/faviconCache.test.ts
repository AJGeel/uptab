import { beforeEach, describe, expect, it, vi } from "vitest";

const DAY = 24 * 60 * 60 * 1000;

describe("favicon cache", () => {
  let store: Record<string, string>;
  let cache: typeof import("./faviconCache");

  beforeEach(async () => {
    store = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    });
    vi.resetModules();
    cache = await import("./faviconCache");
  });

  it("knows nothing about a new page", () => {
    expect(cache.getCachedFaviconIndex("https://a.com", 3)).toBeUndefined();
  });

  it("remembers which source worked", () => {
    cache.setCachedFaviconIndex("https://a.com", 2);

    expect(cache.getCachedFaviconIndex("https://a.com", 3)).toBe(2);
  });

  it("is still there after a reload", async () => {
    cache.setCachedFaviconIndex("https://a.com", 1);
    vi.resetModules();
    cache = await import("./faviconCache");

    expect(cache.getCachedFaviconIndex("https://a.com", 3)).toBe(1);
  });

  it("remembers that nothing was found, for a day", () => {
    const now = 1_000_000;
    cache.setCachedFaviconIndex("https://a.com", 3, now);

    expect(cache.getCachedFaviconIndex("https://a.com", 3, now + DAY - 1)).toBe(
      3,
    );
    expect(
      cache.getCachedFaviconIndex("https://a.com", 3, now + DAY),
    ).toBeUndefined();
  });

  it("starts over when the sources changed under it", () => {
    cache.setCachedFaviconIndex("https://a.com", 5);

    expect(cache.getCachedFaviconIndex("https://a.com", 3)).toBe(3);
  });

  it("works without localStorage", async () => {
    vi.stubGlobal("localStorage", undefined);
    vi.resetModules();
    cache = await import("./faviconCache");

    expect(() => cache.setCachedFaviconIndex("https://a.com", 1)).not.toThrow();
    expect(cache.getCachedFaviconIndex("https://a.com", 3)).toBe(1);
  });
});
