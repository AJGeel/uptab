import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LOCAL_THEME } from "./localPhotos";

/* The browser's image APIs, which Node doesn't have: a file's text is its size, e.g. "4000x3000". */
const canvases: { width: number; height: number }[] = [];

class FakeCanvas {
  constructor(
    public width: number,
    public height: number,
  ) {
    canvases.push(this);
  }

  getContext = () => ({
    drawImage: vi.fn(),
    getImageData: () => ({ data: [10, 128, 255, 255] }),
  });

  convertToBlob = () =>
    Promise.resolve(
      new Blob([`${this.width}x${this.height}`], { type: "image/webp" }),
    );
}

const decode = async (file: File) => {
  if (file.name.startsWith("broken")) {
    throw new Error("Can't decode this");
  }

  if (file.name.startsWith("quota")) {
    throw new DOMException("No room", "QuotaExceededError");
  }

  const [width, height] = (await file.text()).split("x").map(Number);

  return { width, height, close: vi.fn() };
};

const photo = (name: string, size = "800x600", lastModified = 1) =>
  new File([size], name, { lastModified });

let photos: typeof import("./localPhotos");

beforeEach(async () => {
  let now = 1000;

  canvases.length = 0;
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.stubGlobal("OffscreenCanvas", FakeCanvas);
  vi.stubGlobal("createImageBitmap", decode);
  // Each photo gets a later time, so "oldest first" is deterministic.
  vi.spyOn(Date, "now").mockImplementation(() => ++now);
  vi.spyOn(URL, "revokeObjectURL");

  // Its object URLs are kept per module, so every test starts with a fresh one.
  vi.resetModules();
  photos = await import("./localPhotos");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("addLocalPhotos", () => {
  it("stores photos, which come back oldest first", async () => {
    const result = await photos.addLocalPhotos([
      photo("big.jpg", "4000x3000"),
      photo("small.jpg", "800x600"),
    ]);

    expect(result).toEqual({ added: 2, duplicates: 0, failed: 0 });
    expect(
      (await photos.getLocalPhotos()).map((image) => image.sources[0].width),
    ).toEqual([3840, 800]);
  });

  it("scales big photos down to 3840 on the longest side, and adds a thumbnail", async () => {
    await photos.addLocalPhotos([
      photo("big.jpg", "4000x3000"),
      photo("tall.jpg", "1000x4000"),
      photo("small.jpg", "800x600"),
    ]);

    const sizes = canvases.map(({ width, height }) => `${width}x${height}`);

    expect(sizes).toContain("3840x2880");
    expect(sizes).toContain("960x3840");
    expect(sizes).toContain("800x600");
    expect(sizes).toContain("240x180");
    expect(sizes).toContain("60x240");
  });

  it("gives every photo its theme, thumbnail and average colour", async () => {
    await photos.addLocalPhotos([photo("a.jpg")]);

    const [image] = await photos.getLocalPhotos();

    expect(image).toMatchObject({
      theme: LOCAL_THEME,
      author: null,
      link: null,
      color: "#0a80ff",
      thumbnail: { width: 240 },
    });
    expect(image.sources[0].url).toMatch(/^blob:/);
  });

  it("skips a file that was added before, but not a changed one", async () => {
    await photos.addLocalPhotos([photo("a.jpg")]);

    expect(
      await photos.addLocalPhotos([
        photo("a.jpg"),
        photo("a.jpg", "800x600", 2),
      ]),
    ).toEqual({ added: 1, duplicates: 1, failed: 0 });
    expect(await photos.getLocalPhotos()).toHaveLength(2);
  });

  it("counts a file it can't read, and carries on", async () => {
    expect(
      await photos.addLocalPhotos([photo("broken.jpg"), photo("fine.jpg")]),
    ).toEqual({ added: 1, duplicates: 0, failed: 1 });
    expect(await photos.getLocalPhotos()).toHaveLength(1);
  });

  it("stops when the browser is out of space, keeping what was stored", async () => {
    await expect(
      photos.addLocalPhotos([
        photo("fine.jpg"),
        photo("quota.jpg"),
        photo("never.jpg"),
      ]),
    ).rejects.toMatchObject({ name: "QuotaExceededError" });
    expect(await photos.getLocalPhotos()).toHaveLength(1);
  });

  it("reports how many files are done, duplicates included", async () => {
    await photos.addLocalPhotos([photo("a.jpg")]);

    const onProgress = vi.fn();

    await photos.addLocalPhotos(
      [photo("a.jpg"), photo("b.jpg"), photo("broken.jpg")],
      onProgress,
    );

    expect(onProgress.mock.calls.flat()).toEqual([1, 2, 3]);
  });
});

describe("getLocalPhotos", () => {
  it("makes one image URL and one thumbnail URL per photo, however often it's read", async () => {
    const createObjectURL = vi.spyOn(URL, "createObjectURL");

    await photos.addLocalPhotos([photo("a.jpg"), photo("b.jpg")]);

    const first = await photos.getLocalPhotos();
    const second = await photos.getLocalPhotos();

    expect(createObjectURL).toHaveBeenCalledTimes(4);
    expect(second.map((image) => image.sources[0].url)).toEqual(
      first.map((image) => image.sources[0].url),
    );
  });

  it("is empty without photos", async () => {
    expect(await photos.getLocalPhotos()).toEqual([]);
  });
});

describe("deleteLocalPhotos and clearLocalPhotos", () => {
  it("removes the chosen photos and frees their URLs", async () => {
    await photos.addLocalPhotos([photo("a.jpg"), photo("b.jpg")]);

    const [removed, kept] = await photos.getLocalPhotos();

    await photos.deleteLocalPhotos([removed.id]);

    expect((await photos.getLocalPhotos()).map((image) => image.id)).toEqual([
      kept.id,
    ]);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(removed.sources[0].url);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(removed.thumbnail?.url);
  });

  it("removes every photo and frees every URL", async () => {
    await photos.addLocalPhotos([photo("a.jpg"), photo("b.jpg")]);
    await photos.getLocalPhotos();
    await photos.clearLocalPhotos();

    expect(await photos.getLocalPhotos()).toEqual([]);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(4);
  });
});
