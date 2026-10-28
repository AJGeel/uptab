import { beforeEach, describe, expect, it, vi } from "vitest";

import { applyAccent, restoreAccent } from "./accents";

const dataset: Record<string, string | undefined> = {};
const storage = new Map<string, string>();

beforeEach(() => {
  delete dataset.accent;
  storage.clear();
  vi.stubGlobal("document", { documentElement: { dataset } });
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});

describe("accents", () => {
  it("sets the accent on the page, and remembers it", () => {
    applyAccent("violet");

    expect(dataset.accent).toBe("violet");
    expect(storage.get("uptab.accent")).toBe("violet");
  });

  it("leaves the page in its own colours for the default accent", () => {
    applyAccent("violet");
    applyAccent("sky");

    expect(dataset.accent).toBeUndefined();
  });

  it("brings back the last accent", () => {
    storage.set("uptab.accent", "rose");
    restoreAccent();

    expect(dataset.accent).toBe("rose");
  });

  it("ignores a value it doesn't know", () => {
    storage.set("uptab.accent", "neon");
    restoreAccent();

    expect(dataset.accent).toBeUndefined();
  });
});
