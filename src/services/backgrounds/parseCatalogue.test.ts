import { describe, expect, it } from "vitest";

import { parseCatalogue } from "./parseCatalogue";

const image = (overrides: Record<string, unknown> = {}) => ({
  id: "koppelpoort",
  theme: "holland",
  author: "Denise Jans",
  link: null,
  color: "#6b7f94",
  aspectRatio: 1.5,
  sources: [{ width: 1920, url: "https://example.com/koppelpoort-1920.webp" }],
  ...overrides,
});

const catalogue = (overrides: Record<string, unknown> = {}) => ({
  version: 1,
  generatedAt: "2026-10-18T00:00:00.000Z",
  themes: [{ id: "holland", name: "Holland" }],
  images: [image()],
  ...overrides,
});

describe("parseCatalogue", () => {
  it("reads a valid catalogue", () => {
    expect(parseCatalogue(catalogue())).toEqual({
      themes: [{ id: "holland", name: "Holland", coverImageIds: [] }],
      images: [
        {
          id: "koppelpoort",
          theme: "holland",
          author: "Denise Jans",
          link: null,
          color: "#6b7f94",
          sources: [
            { width: 1920, url: "https://example.com/koppelpoort-1920.webp" },
          ],
          thumbnail: null,
        },
      ],
    });
  });

  it("reads thumbnails and cover images", () => {
    const parsed = parseCatalogue(
      catalogue({
        themes: [
          {
            id: "holland",
            name: "Holland",
            coverImageIds: ["koppelpoort", 42, null],
          },
        ],
        images: [
          image({
            thumbnail: {
              width: 240,
              url: "https://example.com/koppelpoort-240.webp",
            },
          }),
          image({ id: "broken-thumb", thumbnail: { width: "small" } }),
        ],
      }),
    );

    expect(parsed?.themes[0].coverImageIds).toEqual(["koppelpoort"]);
    expect(parsed?.images.map((i) => i.thumbnail)).toEqual([
      { width: 240, url: "https://example.com/koppelpoort-240.webp" },
      null,
    ]);
  });

  it("ignores unknown fields", () => {
    const parsed = parseCatalogue(
      catalogue({
        newField: true,
        themes: [{ id: "holland", name: "Holland", emoji: "🌷" }],
        images: [image({ blurhash: "abc" })],
      }),
    );

    expect(parsed?.themes).toEqual([
      { id: "holland", name: "Holland", coverImageIds: [] },
    ]);
    expect(parsed?.images[0]).not.toHaveProperty("blurhash");
    expect(parsed?.images[0]).not.toHaveProperty("aspectRatio");
  });

  it("rejects an unsupported version", () => {
    expect(parseCatalogue(catalogue({ version: 2 }))).toBeUndefined();
    expect(parseCatalogue(catalogue({ version: undefined }))).toBeUndefined();
    expect(parseCatalogue("not a catalogue")).toBeUndefined();
  });

  it("skips images without usable sources", () => {
    const parsed = parseCatalogue(
      catalogue({
        images: [
          image({ id: "empty", sources: [] }),
          image({ id: "missing", sources: undefined }),
          image({ id: "broken", sources: [{ width: "big", url: 1 }] }),
          image({ id: "ok" }),
        ],
      }),
    );

    expect(parsed?.images.map((i) => i.id)).toEqual(["ok"]);
  });

  it("skips images whose theme isn't listed", () => {
    const parsed = parseCatalogue(
      catalogue({ images: [image({ theme: "unknown" }), image()] }),
    );

    expect(parsed?.images).toHaveLength(1);
  });

  it("sorts sources smallest first and defaults optional fields", () => {
    const parsed = parseCatalogue(
      catalogue({
        images: [
          image({
            author: undefined,
            link: undefined,
            color: undefined,
            sources: [
              { width: 3840, url: "https://example.com/3840.webp" },
              { width: 1920, url: "https://example.com/1920.webp" },
            ],
          }),
        ],
      }),
    );

    expect(parsed?.images[0]).toMatchObject({
      author: null,
      link: null,
      color: "#000000",
      sources: [{ width: 1920 }, { width: 3840 }],
    });
  });
});
