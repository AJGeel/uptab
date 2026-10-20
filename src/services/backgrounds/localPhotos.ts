import { BackgroundImage } from "./types";

/** The theme ID that local photos use, next to the catalogue's themes. */
export const LOCAL_THEME = "local";

/** Longest side of the stored photo; larger files are scaled down. */
const MAX_SIZE = 3840;
const THUMBNAIL_SIZE = 240;

type LocalPhoto = {
  id: string;
  /** Name, size and date of the original file, to skip it when added again. */
  fileKey: string;
  addedAt: number;
  width: number;
  color: string;
  image: Blob;
  thumbnail: Blob;
};

const DB_NAME = "localPhotos";
const STORE = "photos";

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () =>
      request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const run = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T> | void,
) => {
  const db = await openDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));

    transaction.oncomplete = () => resolve(request?.result as T);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  }).finally(() => db.close());
};

const getFileKey = (file: File) =>
  `${file.name}:${file.size}:${file.lastModified}`;

const resize = async (bitmap: ImageBitmap, maxSize: number) => {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(
    Math.round(bitmap.width * scale),
    Math.round(bitmap.height * scale),
  );

  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return {
    width: canvas.width,
    blob: await canvas.convertToBlob({ type: "image/webp", quality: 0.85 }),
  };
};

/** The photo's average colour, shown while it loads. */
const getColor = (bitmap: ImageBitmap) => {
  const canvas = new OffscreenCanvas(1, 1);
  const context = canvas.getContext("2d");

  context?.drawImage(bitmap, 0, 0, 1, 1);
  const [r, g, b] = context?.getImageData(0, 0, 1, 1).data ?? [0, 0, 0];

  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
};

const toLocalPhoto = async (file: File): Promise<LocalPhoto> => {
  const bitmap = await createImageBitmap(file);

  try {
    const [image, thumbnail] = await Promise.all([
      resize(bitmap, MAX_SIZE),
      resize(bitmap, THUMBNAIL_SIZE),
    ]);

    return {
      id: crypto.randomUUID(),
      fileKey: getFileKey(file),
      addedAt: Date.now(),
      width: image.width,
      color: getColor(bitmap),
      image: image.blob,
      thumbnail: thumbnail.blob,
    };
  } finally {
    bitmap.close();
  }
};

// Object URLs live as long as the tab, so each photo gets one once.
const urls = new Map<string, { image: string; thumbnail: string }>();

const toBackgroundImage = (photo: LocalPhoto): BackgroundImage => {
  if (!urls.has(photo.id)) {
    urls.set(photo.id, {
      image: URL.createObjectURL(photo.image),
      thumbnail: URL.createObjectURL(photo.thumbnail),
    });
  }

  const url = urls.get(photo.id)!;

  return {
    id: photo.id,
    theme: LOCAL_THEME,
    author: null,
    link: null,
    color: photo.color,
    sources: [{ width: photo.width, url: url.image }],
    thumbnail: { width: THUMBNAIL_SIZE, url: url.thumbnail },
  };
};

const revoke = (ids: string[]) =>
  ids.forEach((id) => {
    const url = urls.get(id);

    if (url) {
      URL.revokeObjectURL(url.image);
      URL.revokeObjectURL(url.thumbnail);
      urls.delete(id);
    }
  });

/** Local photos, oldest first. */
export const getLocalPhotos = async () => {
  const photos = await run<LocalPhoto[]>("readonly", (store) => store.getAll());

  return photos.sort((a, b) => a.addedAt - b.addedAt).map(toBackgroundImage);
};

export type AddResult = { added: number; duplicates: number; failed: number };

/** Adds the image files, skipping ones that were added before. */
export const addLocalPhotos = async (
  files: File[],
  onProgress?: (done: number) => void,
): Promise<AddResult> => {
  const photos = await run<LocalPhoto[]>("readonly", (store) => store.getAll());
  const known = new Set(photos.map((photo) => photo.fileKey));
  const result: AddResult = { added: 0, duplicates: 0, failed: 0 };

  for (const [i, file] of files.entries()) {
    if (known.has(getFileKey(file))) {
      result.duplicates++;
    } else {
      try {
        const photo = await toLocalPhoto(file);

        await run("readwrite", (store) => store.add(photo));
        known.add(photo.fileKey);
        result.added++;
      } catch (error) {
        // Out of space: the remaining files won't fit either.
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          throw error;
        }

        result.failed++;
      }
    }

    onProgress?.(i + 1);
  }

  return result;
};

export const deleteLocalPhotos = async (ids: string[]) => {
  await run("readwrite", (store) => ids.forEach((id) => store.delete(id)));
  revoke(ids);
};

export const clearLocalPhotos = async () => {
  await run("readwrite", (store) => store.clear());
  revoke([...urls.keys()]);
};
