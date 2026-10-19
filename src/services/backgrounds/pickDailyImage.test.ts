import { describe, expect, it } from "vitest";

import {
  getEnabledImages,
  getEnabledThemes,
  pickDailyImage,
} from "./pickDailyImage";
import { BackgroundImage, Catalogue } from "./types";

const image = (id: string, theme = "holland"): BackgroundImage => ({
  id,
  theme,
  author: null,
  link: null,
  color: "#000000",
  sources: [{ width: 1920, url: `https://example.com/${id}.webp` }],
  thumbnail: null,
});

const images = Array.from({ length: 20 }, (_, i) => image(`photo-${i}`));

describe("pickDailyImage", () => {
  it("picks the same photo for the same date", () => {
    const first = pickDailyImage(images, "2026-10-18");

    expect(first).toBeDefined();
    expect(pickDailyImage(images, "2026-10-18")).toBe(first);
  });

  it("spreads consecutive dates across the photos", () => {
    const week = Array.from(
      { length: 7 },
      (_, i) => pickDailyImage(images, `2026-10-${10 + i}`)?.id,
    );

    expect(new Set(week).size).toBeGreaterThan(3);
  });

  it("keeps today's stored pick", () => {
    const stored = { date: "2026-10-18", imageId: "photo-7" };

    expect(pickDailyImage(images, "2026-10-18", stored)?.id).toBe("photo-7");
  });

  it("ignores a stored pick from another day", () => {
    const stored = { date: "2026-10-17", imageId: "photo-7" };

    expect(pickDailyImage(images, "2026-10-18", stored)).toBe(
      pickDailyImage(images, "2026-10-18"),
    );
  });

  it("ignores a stored photo that's no longer available", () => {
    const stored = { date: "2026-10-18", imageId: "removed" };

    expect(pickDailyImage(images, "2026-10-18", stored)).toBe(
      pickDailyImage(images, "2026-10-18"),
    );
  });

  it("returns nothing without photos", () => {
    expect(pickDailyImage([], "2026-10-18")).toBeUndefined();
  });
});

describe("getEnabledImages", () => {
  const catalogue: Catalogue = {
    themes: [
      { id: "holland", name: "Holland", coverImageIds: [] },
      { id: "safari", name: "Safari", coverImageIds: [] },
    ],
    images: [image("windmill"), image("lion", "safari")],
  };

  it("returns photos from the enabled themes", () => {
    expect(getEnabledImages(catalogue, ["safari"]).map((i) => i.id)).toEqual([
      "lion",
    ]);
  });

  it("ignores themes that are no longer in the catalogue", () => {
    expect(
      getEnabledImages(catalogue, ["safari", "removed"]).map((i) => i.id),
    ).toEqual(["lion"]);
  });

  it("falls back to holland when no enabled theme is left", () => {
    expect(getEnabledImages(catalogue, ["removed"]).map((i) => i.id)).toEqual([
      "windmill",
    ]);
    expect(getEnabledImages(catalogue, []).map((i) => i.id)).toEqual([
      "windmill",
    ]);
  });

  it("falls back to every photo without holland", () => {
    const noHolland = { ...catalogue, images: [image("lion", "safari")] };

    expect(getEnabledImages(noHolland, ["removed"]).map((i) => i.id)).toEqual([
      "lion",
    ]);
  });
});

describe("getEnabledThemes", () => {
  const catalogue: Catalogue = {
    themes: [
      { id: "holland", name: "Holland", coverImageIds: [] },
      { id: "safari", name: "Safari", coverImageIds: [] },
      { id: "empty", name: "Empty", coverImageIds: [] },
    ],
    images: [image("windmill"), image("lion", "safari")],
  };

  it("keeps enabled themes that have photos, in catalogue order", () => {
    expect(getEnabledThemes(catalogue, ["safari", "holland"])).toEqual([
      "holland",
      "safari",
    ]);
  });

  it("drops themes without photos or no longer in the catalogue", () => {
    expect(getEnabledThemes(catalogue, ["empty", "removed", "safari"])).toEqual(
      ["safari"],
    );
  });

  it("falls back to holland, or else every theme with photos", () => {
    expect(getEnabledThemes(catalogue, [])).toEqual(["holland"]);
    expect(
      getEnabledThemes({ ...catalogue, images: [image("lion", "safari")] }, []),
    ).toEqual(["safari"]);
  });
});
