import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultSettings } from "./defaultSettings";
import { getSettings } from "./getSettings";

const store: Record<string, unknown> = {};

vi.mock("webextension-polyfill", () => ({
  storage: {
    local: {
      get: (key: string) => Promise.resolve({ [key]: store[key] }),
    },
  },
}));

describe("getSettings", () => {
  beforeEach(() => {
    delete store.settings;
  });

  it("returns the defaults when nothing is saved", async () => {
    expect(await getSettings()).toEqual(defaultSettings);
  });

  it("keeps saved background themes instead of adding the defaults", async () => {
    store.settings = { backgrounds: { themes: ["safari"] } };

    expect((await getSettings()).backgrounds.themes).toEqual(["safari"]);
  });

  it("fills in settings added after the user last saved", async () => {
    store.settings = {
      sidebar: { ...defaultSettings.sidebar, isOpen: true },
      homescreen: defaultSettings.homescreen,
    };

    const settings = await getSettings();

    expect(settings.sidebar.isOpen).toBe(true);
    expect(settings.backgrounds.themes).toEqual(["holland"]);
  });
});
