import { afterEach, describe, expect, it, vi } from "vitest";

import { mapPlace, searchPlaces } from "./searchPlaces";

const amsterdam = {
  id: 1,
  name: "Amsterdam",
  admin1: "North Holland",
  country: "Netherlands",
  latitude: 52.37,
  longitude: 4.89,
};

const stubFetch = (response: Partial<Response>) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

describe("mapPlace", () => {
  it("labels with the name and region", () => {
    expect(mapPlace(amsterdam).label).toBe("Amsterdam, North Holland");
  });

  it("uses the country without a region", () => {
    expect(mapPlace({ ...amsterdam, admin1: undefined }).label).toBe(
      "Amsterdam, Netherlands",
    );
  });

  it("doesn't repeat the name", () => {
    expect(mapPlace({ ...amsterdam, admin1: "Amsterdam" }).label).toBe(
      "Amsterdam",
    );
  });
});

describe("searchPlaces", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps the results", async () => {
    stubFetch({
      ok: true,
      json: () => Promise.resolve({ results: [amsterdam] }),
    });

    expect(await searchPlaces("Amsterdam")).toEqual([
      {
        id: 1,
        label: "Amsterdam, North Holland",
        latitude: 52.37,
        longitude: 4.89,
      },
    ]);
  });

  it("returns nothing when Open-Meteo has no matches", async () => {
    stubFetch({ ok: true, json: () => Promise.resolve({}) });

    expect(await searchPlaces("zzzzzz")).toEqual([]);
  });

  it("throws on an error response", async () => {
    stubFetch({ ok: false });

    await expect(searchPlaces("Amsterdam")).rejects.toThrow();
  });
});
