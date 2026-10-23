import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getReverseGeocoding } from "./getReverseGeocoding";

const store: Record<string, unknown> = {};

vi.mock("webextension-polyfill", () => ({
  storage: {
    local: {
      get: (key: string) => Promise.resolve({ [key]: store[key] }),
      set: (values: Record<string, unknown>) => {
        Object.assign(store, values);
        return Promise.resolve();
      },
    },
  },
}));

const location = { latitude: 52.37, longitude: 4.9 };

const stubFetch = (response: Partial<Response>) => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

describe("getReverseGeocoding", () => {
  beforeEach(() => {
    delete store.cachedReverseGeocoding;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns and caches the address", async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: () => Promise.resolve({ address: { city: "Amsterdam" } }),
    });

    expect(await getReverseGeocoding(location)).toEqual({ city: "Amsterdam" });
    expect(await getReverseGeocoding(location)).toEqual({ city: "Amsterdam" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws on an error response, caching nothing", async () => {
    stubFetch({ ok: false, status: 429 });

    await expect(getReverseGeocoding(location)).rejects.toThrow();
    expect(store.cachedReverseGeocoding).toBeUndefined();
  });

  it("throws on an error body served as a 200, caching nothing", async () => {
    stubFetch({
      ok: true,
      json: () => Promise.resolve({ error: "Unable to geocode" }),
    });

    await expect(getReverseGeocoding(location)).rejects.toThrow();
    expect(store.cachedReverseGeocoding).toBeUndefined();
  });
});
