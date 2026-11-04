import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({}) as Record<string, unknown>);

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

import { getBookmarkIcons, setBookmarkIcon } from "./bookmarkIcons";

describe("bookmark icons", () => {
  beforeEach(() => {
    delete store.bookmarkIcons;
  });

  it("starts empty", async () => {
    expect(await getBookmarkIcons()).toEqual({});
  });

  it("keeps an icon per bookmark", async () => {
    await setBookmarkIcon("1", "https://a.com/a.png");
    await setBookmarkIcon("2", "https://b.com/b.png");

    expect(await getBookmarkIcons()).toEqual({
      "1": "https://a.com/a.png",
      "2": "https://b.com/b.png",
    });
  });

  it("replaces an icon", async () => {
    await setBookmarkIcon("1", "https://a.com/a.png");
    await setBookmarkIcon("1", "https://a.com/new.png");

    expect(await getBookmarkIcons()).toEqual({ "1": "https://a.com/new.png" });
  });

  it("removes an icon when it's emptied", async () => {
    await setBookmarkIcon("1", "https://a.com/a.png");
    await setBookmarkIcon("2", "https://b.com/b.png");
    await setBookmarkIcon("1", "");

    expect(await getBookmarkIcons()).toEqual({ "2": "https://b.com/b.png" });
  });
});
