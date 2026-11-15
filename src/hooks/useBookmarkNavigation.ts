import { KeyboardEvent, useState } from "react";
import { Bookmarks, tabs, windows } from "webextension-polyfill";

import { Command, findCommands } from "@/src/services/bookmarks/commands";
import { filterBookmarks } from "@/src/services/bookmarks/filterBookmarks";
import { moveHighlight } from "@/src/services/bookmarks/moveHighlight";
import {
  SortMode,
  sortBookmarks,
} from "@/src/services/bookmarks/sortBookmarks";
import { Visits } from "@/src/services/bookmarks/visits";
import { resolveQuery } from "@/src/services/search/resolveQuery";
import { SearchEngineId } from "@/src/services/search/searchEngines";
import { safeHref } from "@/src/utils/safeHref";

type Options = {
  bookmarks: Bookmarks.BookmarkTreeNode[];
  sortMode: SortMode;
  /** For the sorts by visits. */
  visits?: Visits;
  searchQuery: string;
  searchEngine: SearchEngineId;
  /** Enter on a command, typed after a colon. */
  onRunCommand: (command: Command) => void;
  /** Esc clears the search first. */
  onClearQuery: () => void;
  /** Whether Esc, with nothing left to clear, leaves the search box. Not in the popup, where Esc closes it. */
  canLeaveSearch: boolean;
};

/** The bookmarks (or commands) to list, and the keys that move through them from the search box. */
export const useBookmarkNavigation = ({
  bookmarks,
  sortMode,
  visits,
  searchQuery,
  searchEngine,
  onRunCommand,
  onClearQuery,
  canLeaveSearch,
}: Options) => {
  // Set by the arrow keys; searching also starts on the first result.
  const [highlight, setHighlight] = useState<number>();

  const commands = findCommands(searchQuery);
  const entries = commands
    ? []
    : filterBookmarks(sortBookmarks(bookmarks, sortMode, visits), searchQuery);
  // What the arrow keys move through.
  const count = commands ? commands.length : entries.length;

  const getActiveIndex = () => {
    if (count === 0) {
      return undefined;
    }

    if (highlight === undefined) {
      return searchQuery.trim() !== "" ? 0 : undefined;
    }

    return Math.min(highlight, count - 1);
  };

  const activeIndex = getActiveIndex();
  const activeEntry =
    activeIndex === undefined ? undefined : entries[activeIndex];
  const activeCommand =
    activeIndex === undefined ? undefined : commands?.[activeIndex];

  /** What Enter opens when nothing matches: the text as an address, or a web search. */
  const queryTarget =
    !commands && entries.length === 0 && searchQuery.trim() !== ""
      ? resolveQuery(searchQuery, searchEngine)
      : undefined;

  const openQueryTarget = () => {
    if (queryTarget) {
      void tabs.create({ url: queryTarget.url });
    }
  };

  const getEntryId = (entry: Bookmarks.BookmarkTreeNode) =>
    `bookmark-${entry.id}`;

  const getCommandId = (command: Command) => `command-${command.name}`;

  const getItemId = (index: number) =>
    commands ? getCommandId(commands[index]) : getEntryId(entries[index]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const next = moveHighlight(activeIndex, event.key, count);
        setHighlight(next);

        if (next !== undefined) {
          const id = getItemId(next);
          requestAnimationFrame(() =>
            document.getElementById(id)?.scrollIntoView({ block: "nearest" }),
          );
        }
        break;
      }
      case "Home":
      case "End": {
        if (count === 0) {
          break;
        }

        event.preventDefault();
        const next = event.key === "Home" ? 0 : count - 1;
        setHighlight(next);
        requestAnimationFrame(() =>
          document
            .getElementById(getItemId(next))
            ?.scrollIntoView({ block: "nearest" }),
        );
        break;
      }
      case "Enter": {
        event.preventDefault();
        event.stopPropagation();

        if (activeCommand) {
          onRunCommand(activeCommand);
          break;
        }

        const url = activeEntry ? safeHref(activeEntry.url) : queryTarget?.url;

        if (!url) {
          break;
        }

        // ⌘ or Ctrl: a tab behind this one. Shift: a window.
        if (event.shiftKey) {
          void windows.create({ url });
        } else {
          void tabs.create({ url, active: !(event.metaKey || event.ctrlKey) });
        }
        break;
      }
      case "Escape":
        // One layer at a time: the highlight, the text, then the box itself.
        if (highlight !== undefined) {
          event.preventDefault();
          event.stopPropagation();
          setHighlight(undefined);
        } else if (searchQuery !== "") {
          event.preventDefault();
          event.stopPropagation();
          onClearQuery();
        } else if (canLeaveSearch) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.blur();
        }
        break;
      default:
        break;
    }
  };

  return {
    entries,
    activeEntry,
    commands,
    activeCommand,
    activeItemId:
      activeIndex === undefined ? undefined : getItemId(activeIndex),
    getCommandId,
    queryTarget,
    openQueryTarget,
    getEntryId,
    resetHighlight: () => setHighlight(undefined),
    handleKeyDown,
  };
};
