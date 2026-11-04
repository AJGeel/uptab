import { KeyboardEvent, useState } from "react";
import { Bookmarks, tabs } from "webextension-polyfill";

import { filterBookmarks } from "@/src/services/bookmarks/filterBookmarks";
import { moveHighlight } from "@/src/services/bookmarks/moveHighlight";
import {
  SortMode,
  sortBookmarks,
} from "@/src/services/bookmarks/sortBookmarks";
import { Visits } from "@/src/services/bookmarks/visits";

type Options = {
  bookmarks: Bookmarks.BookmarkTreeNode[];
  sortMode: SortMode;
  /** For the sorts by visits. */
  visits?: Visits;
  searchQuery: string;
};

/** The bookmarks to list, and the keys that move through them from the search box. */
export const useBookmarkNavigation = ({
  bookmarks,
  sortMode,
  visits,
  searchQuery,
}: Options) => {
  // Set by the arrow keys; searching also starts on the first result.
  const [highlight, setHighlight] = useState<number>();

  const entries = filterBookmarks(
    sortBookmarks(bookmarks, sortMode, visits),
    searchQuery,
  );

  const getActiveIndex = () => {
    if (entries.length === 0) {
      return undefined;
    }

    if (highlight === undefined) {
      return searchQuery.trim() !== "" ? 0 : undefined;
    }

    return Math.min(highlight, entries.length - 1);
  };

  const activeIndex = getActiveIndex();
  const activeEntry =
    activeIndex === undefined ? undefined : entries[activeIndex];

  const getEntryId = (entry: Bookmarks.BookmarkTreeNode) =>
    `bookmark-${entry.id}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const next = moveHighlight(activeIndex, event.key, entries.length);
        setHighlight(next);

        if (next !== undefined) {
          const id = getEntryId(entries[next]);
          requestAnimationFrame(() =>
            document.getElementById(id)?.scrollIntoView({ block: "nearest" }),
          );
        }
        break;
      }
      case "Enter":
        event.preventDefault();
        event.stopPropagation();

        if (activeEntry) {
          tabs.create({ url: activeEntry.url });
        }
        break;
      case "Escape":
        if (highlight !== undefined) {
          event.preventDefault();
          event.stopPropagation();
          setHighlight(undefined);
        }
        break;
      default:
        break;
    }
  };

  return {
    entries,
    activeEntry,
    getEntryId,
    resetHighlight: () => setHighlight(undefined),
    handleKeyDown,
  };
};
