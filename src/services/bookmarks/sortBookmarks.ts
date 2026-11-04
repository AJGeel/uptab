import { Bookmarks } from "webextension-polyfill";

import { getVisit, Visits } from "./visits";

export const SortModes = {
  "A-Z": "A-Z",
  "Z-A": "Z-A",
  Newest: "Newest",
  Oldest: "Oldest",
  Recent: "Recently visited",
  Popular: "Most visited",
} as const;

export type SortMode = keyof typeof SortModes;

/** The modes that need to know what's in the browser's history. */
export const isVisitSort = (sortMode: SortMode) =>
  sortMode === "Recent" || sortMode === "Popular";

/** What the sort dropdown offers: each field, in the direction it starts in. */
export const SortFields = [
  { field: "Name", label: "Name", mode: "A-Z" },
  { field: "Date", label: "Date added", mode: "Newest" },
  { field: "Recent", label: "Recently visited", mode: "Recent" },
  { field: "Popular", label: "Most visited", mode: "Popular" },
] as const;

export type SortField = (typeof SortFields)[number]["field"];

/** The field a sort belongs to, whichever way round it is. */
export const getSortField = (sortMode: SortMode): SortField => {
  switch (sortMode) {
    case "A-Z":
    case "Z-A":
      return "Name";
    case "Newest":
    case "Oldest":
      return "Date";
    default:
      return sortMode;
  }
};

/** The other direction of the same field. The visit sorts only go one way. */
export const reverseSort = (sortMode: SortMode): SortMode => {
  switch (sortMode) {
    case "A-Z":
      return "Z-A";
    case "Z-A":
      return "A-Z";
    case "Newest":
      return "Oldest";
    case "Oldest":
      return "Newest";
    default:
      return sortMode;
  }
};

const byName = (a: Bookmarks.BookmarkTreeNode, b: Bookmarks.BookmarkTreeNode) =>
  a.title.localeCompare(b.title);

/** Sorts in place. Visit modes without `visits` fall back to the name. */
export const sortBookmarks = (
  bookmarks: Bookmarks.BookmarkTreeNode[],
  sortMode: SortMode,
  visits?: Visits,
) =>
  bookmarks.sort((a, b) => {
    switch (sortMode) {
      case "Z-A":
        return byName(b, a);
      case "Newest":
        return (b?.dateAdded ?? 0) - (a?.dateAdded ?? 0);
      case "Oldest":
        return (a?.dateAdded ?? 0) - (b?.dateAdded ?? 0);
      case "Recent":
      case "Popular": {
        const visitA = visits && getVisit(visits, a.url);
        const visitB = visits && getVisit(visits, b.url);
        const recency =
          (visitB?.lastVisitTime ?? 0) - (visitA?.lastVisitTime ?? 0);

        if (sortMode === "Recent") {
          return recency || byName(a, b);
        }

        return (
          (visitB?.visitCount ?? 0) - (visitA?.visitCount ?? 0) ||
          recency ||
          byName(a, b)
        );
      }
      default:
        return byName(a, b);
    }
  });
