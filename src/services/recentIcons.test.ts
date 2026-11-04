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

import { addRecentIcon, getRecentIcons } from "./recentIcons";

describe("recent icons", () => {
  beforeEach(() => {
    delete store.recentIcons;
  });

  it("lists the newest first", async () => {
    await addRecentIcon("https://a.com/1.png");
    await addRecentIcon("https://a.com/2.png");

    expect(await getRecentIcons()).toEqual([
      "https://a.com/2.png",
      "https://a.com/1.png",
    ]);
  });

  it("moves a reused icon to the front without repeating it", async () => {
    await addRecentIcon("https://a.com/1.png");
    await addRecentIcon("https://a.com/2.png");
    await addRecentIcon("https://a.com/1.png");

    expect(await getRecentIcons()).toEqual([
      "https://a.com/1.png",
      "https://a.com/2.png",
    ]);
  });

  it("keeps the latest 10", async () => {
    for (let index = 1; index <= 12; index++) {
      await addRecentIcon(`https://a.com/${index}.png`);
    }

    const recent = await getRecentIcons();

    expect(recent).toHaveLength(10);
    expect(recent[0]).toBe("https://a.com/12.png");
    expect(recent[9]).toBe("https://a.com/3.png");
  });

  it("ignores emojis", async () => {
    await addRecentIcon("🚀");

    expect(await getRecentIcons()).toEqual([]);
  });
});
