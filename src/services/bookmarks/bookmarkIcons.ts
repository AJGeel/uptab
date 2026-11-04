import { storage } from "webextension-polyfill";

/** Custom icons by bookmark id. The browser has no place for them, so UpTab keeps them. */
export type BookmarkIcons = Record<string, string>;

export const getBookmarkIcons = async (): Promise<BookmarkIcons> => {
  const data = (await storage.local.get("bookmarkIcons")) as {
    bookmarkIcons?: BookmarkIcons;
  };

  return data.bookmarkIcons ?? {};
};

/** An empty icon takes the custom one away. */
export const setBookmarkIcon = async (id: string, icon: string) => {
  const icons = { ...(await getBookmarkIcons()), [id]: icon };

  if (!icon) {
    delete icons[id];
  }

  await storage.local.set({ bookmarkIcons: icons });
};
