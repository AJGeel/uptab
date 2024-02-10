import { Bookmarks } from "webextension-polyfill";

export const SortModes = {
  "A-Z": "A-Z",
  "Z-A": "Z-A",
  Newest: "Newest",
  Oldest: "Oldest",
} as const;

export type SortMode = keyof typeof SortModes;

export const sortBookmarks = (
  bookmarks: Bookmarks.BookmarkTreeNode[],
  sortMode: SortMode
) =>
  bookmarks.sort((a, b) => {
    switch (sortMode) {
      case SortModes["A-Z"]:
        return a.title.localeCompare(b.title);
      case SortModes["Z-A"]:
        return b.title.localeCompare(a.title);
      case SortModes.Newest:
        return (b?.dateAdded ?? 0) - (a?.dateAdded ?? 0);
      case SortModes.Oldest:
        return (a?.dateAdded ?? 0) - (b?.dateAdded ?? 0);
      default:
        return a.title.localeCompare(b.title);
    }
  });
