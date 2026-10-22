import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchCatalogue } from "./getCatalogue";

vi.mock("webextension-polyfill", () => ({
  storage: { local: { get: () => Promise.resolve({}), set: vi.fn() } },
}));

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

describe("fetchCatalogue", () => {
  afterEach(() => fetchMock.mockReset());

  it("revalidates with the site, so removed themes don't come from the HTTP cache", async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await fetchCatalogue();

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-cache" });
  });

  it("skips the HTTP cache entirely on reload", async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await fetchCatalogue({ reload: true });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "reload" });
  });
});
