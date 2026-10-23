import { describe, expect, it } from "vitest";

import { LOCAL_THEME } from "./localPhotos";
import { getEnabledImages } from "./pickDailyImage";
import { BackgroundImage, Catalogue } from "./types";
import { withLocalPhotos } from "./withLocalPhotos";

const image = (id: string, theme: string): BackgroundImage => ({
  id,
  theme,
  author: null,
  link: null,
  color: "#000000",
  sources: [{ width: 1920, url: `blob:${id}` }],
  thumbnail: null,
});

const catalogue: Catalogue = {
  themes: [{ id: "holland", name: "Holland", coverImageIds: [] }],
  images: [image("koppelpoort", "holland")],
};

const local = [image("mine", LOCAL_THEME)];

describe("withLocalPhotos", () => {
  it("leaves the catalogue alone without local photos", () => {
    expect(withLocalPhotos(catalogue, [])).toBe(catalogue);
    expect(withLocalPhotos(null, [])).toBeNull();
  });

  it("mixes local photos with the enabled themes", () => {
    const merged = withLocalPhotos(catalogue, local)!;

    expect(
      getEnabledImages(merged, ["holland", LOCAL_THEME]).map((i) => i.id),
    ).toEqual(["mine", "koppelpoort"]);
    expect(getEnabledImages(merged, ["holland"]).map((i) => i.id)).toEqual([
      "koppelpoort",
    ]);
  });

  it("works without a catalogue", () => {
    const merged = withLocalPhotos(null, local)!;

    expect(getEnabledImages(merged, [LOCAL_THEME]).map((i) => i.id)).toEqual([
      "mine",
    ]);
  });

  it("falls back to the default theme once local photos are gone", () => {
    expect(
      getEnabledImages(withLocalPhotos(catalogue, [])!, [LOCAL_THEME]).map(
        (i) => i.id,
      ),
    ).toEqual(["koppelpoort"]);
  });
});
