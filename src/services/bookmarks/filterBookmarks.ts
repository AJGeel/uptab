import { Bookmarks } from "webextension-polyfill";

export const filterBookmarks = (
  bookmarks: Bookmarks.BookmarkTreeNode[],
  searchQuery: string
) =>
  bookmarks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (item.url &&
        item.url.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );
