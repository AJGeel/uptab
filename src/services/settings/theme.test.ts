import { beforeEach, describe, expect, it, vi } from "vitest";

import { applyTheme, restoreTheme } from "./theme";

const dataset: Record<string, string | undefined> = {};
const storage = new Map<string, string>();
let systemIsDark = false;

beforeEach(() => {
  delete dataset.theme;
  storage.clear();
  systemIsDark = false;
  vi.stubGlobal("document", { documentElement: { dataset } });
  vi.stubGlobal("window", {
    matchMedia: () => ({ matches: systemIsDark }),
  });
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});

describe("theme", () => {
  it("sets the chosen theme on the page, and remembers it", () => {
    applyTheme("dark");

    expect(dataset.theme).toBe("dark");
    expect(storage.get("uptab.theme")).toBe("dark");
  });

  it("follows the system for the system theme", () => {
    systemIsDark = true;
    applyTheme("system");

    expect(dataset.theme).toBe("dark");
    expect(storage.get("uptab.theme")).toBe("system");

    systemIsDark = false;
    applyTheme("system");

    expect(dataset.theme).toBe("light");
  });

  it("ignores the system for a chosen theme", () => {
    systemIsDark = true;
    applyTheme("light");

    expect(dataset.theme).toBe("light");
  });

  it("brings back the last theme", () => {
    storage.set("uptab.theme", "dark");
    restoreTheme();

    expect(dataset.theme).toBe("dark");
  });

  it("starts with the system's theme when it has nothing, or a value it doesn't know", () => {
    systemIsDark = true;
    restoreTheme();

    expect(dataset.theme).toBe("dark");

    storage.set("uptab.theme", "neon");
    restoreTheme();

    expect(dataset.theme).toBe("dark");
  });
});
