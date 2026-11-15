import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { descriptions } from "./weatherDescriptions";

const publicDir = resolve(import.meta.dirname, "../../../public");

describe("weatherDescriptions", () => {
  it("only uses icons that are bundled", () => {
    const images = Object.values(descriptions).flatMap(({ day, night }) => [
      day.image,
      night.image,
    ]);

    expect(images.length).toBeGreaterThan(0);

    for (const image of images) {
      expect(image).toMatch(/^\/weather\/[a-z-]+\.svg$/);
      expect(existsSync(resolve(publicDir, `.${image}`)), image).toBe(true);
    }
  });

  it("bundles no icons that go unused", () => {
    const used = new Set(
      Object.values(descriptions).flatMap(({ day, night }) => [
        day.image,
        night.image,
      ]),
    );
    const bundled = readdirSync(resolve(publicDir, "weather"))
      .filter((file) => file.endsWith(".svg"))
      .map((file) => `/weather/${file}`);

    expect(bundled.filter((image) => !used.has(image))).toEqual([]);
  });
});
