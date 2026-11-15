import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Bookmarks as BookmarksApi } from "webextension-polyfill";

import { useBookmarkIcons } from "@/src/hooks/queries/useBookmarkIcons";
import { useBookmarks } from "@/src/hooks/queries/useBookmarks";
import { useBookmarkVisits } from "@/src/hooks/queries/useBookmarkVisits";
import {
  SHORTLINK_QUERY_KEY,
  useShortlinks,
} from "@/src/hooks/queries/useShortlinks";
import { useBookmarkMutations } from "@/src/hooks/useBookmarkMutations";
import { useBookmarkNavigation } from "@/src/hooks/useBookmarkNavigation";
import { useHistoryAccess } from "@/src/hooks/useHistoryAccess";
import { usePersistedState } from "@/src/hooks/usePersistedState";
import { useSettings } from "@/src/hooks/useSettings";
import { Command } from "@/src/services/bookmarks/commands";
import {
  isVisitSort,
  SortMode,
  SortModes,
} from "@/src/services/bookmarks/sortBookmarks";
import { getVisitDetail } from "@/src/services/bookmarks/visitDetail";
import { getVisit } from "@/src/services/bookmarks/visits";
import { DEFAULT_SEARCH_ENGINE } from "@/src/services/search/searchEngines";
import { addShortlink } from "@/src/services/shortlinks";
import { cn } from "@/src/utils";

import BookmarkItem from "./partials/BookmarkItem";
import CommandList from "./partials/CommandList";
import EditBookmarkModal from "./partials/EditBookmarkModal";
import NoMatches from "./partials/NoMatches";
import Notice from "./partials/Notice";
import RemoveBookmarkModal from "./partials/RemoveBookmarkModal";
import SearchBookmarks from "./partials/SearchBookmarks";
import SortBookmarks from "./partials/SortBookmarks";

export type BookmarksProps = {
  displayMode?: "NewTab" | "Popup";
};

const Bookmarks = ({ displayMode = "NewTab" }: BookmarksProps) => {
  const queryClient = useQueryClient();

  const [sortMode, setSortMode, isSortHydrated] = usePersistedState<SortMode>(
    "bookmarks.sortMode",
    SortModes.Newest,
  );

  const [searchQuery, setSearchQuery, isSearchHydrated] = usePersistedState(
    "bookmarks.searchQuery",
    "",
  );

  const [notice, setNotice] = useState<string>();
  const [bookmarkToEdit, setBookmarkToEdit] =
    useState<BookmarksApi.BookmarkTreeNode>();
  const [bookmarkToRemove, setBookmarkToRemove] =
    useState<BookmarksApi.BookmarkTreeNode>();
  // A new tab is a fresh page, so the times only need to be right when it opens.
  const [now] = useState(() => Date.now());
  const { hasAccess, requestAccess } = useHistoryAccess();

  const { isPending, isError, data } = useBookmarks();

  // A saved visit sort without access (it was revoked) falls back to newest.
  const sortBy =
    isVisitSort(sortMode) && !hasAccess ? SortModes.Newest : sortMode;
  const { data: visits, isPending: isLoadingVisits } = useBookmarkVisits(
    data ?? [],
    !isPending && !!hasAccess && isVisitSort(sortBy),
  );

  const { data: settings, updateSettings } = useSettings();
  const searchEngine = settings?.search.engine ?? DEFAULT_SEARCH_ENGINE;

  const {
    entries,
    activeEntry,
    commands,
    activeCommand,
    activeItemId,
    getCommandId,
    queryTarget,
    openQueryTarget,
    getEntryId,
    resetHighlight,
    handleKeyDown,
  } = useBookmarkNavigation({
    bookmarks: data ?? [],
    sortMode: sortBy,
    visits,
    searchQuery,
    searchEngine,
    onRunCommand: (command) => runCommand(command),
    onClearQuery: () => {
      setSearchQuery("");
      resetHighlight();
    },
    canLeaveSearch: displayMode === "NewTab",
  });

  const { data: shortlinks } = useShortlinks();
  const { data: icons, isPending: isLoadingIcons } = useBookmarkIcons();

  const { deleteMutation, editMutation } = useBookmarkMutations(() =>
    setBookmarkToEdit(undefined),
  );

  const addShortlinkMutation = useMutation({
    mutationFn: addShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHORTLINK_QUERY_KEY });
    },
  });

  if (isPending) {
    return;
  }

  if (isError) {
    return <p>Couldn&apos;t load your bookmarks.</p>;
  }

  const changeSortMode = (mode: SortMode) => {
    resetHighlight();
    setNotice(undefined);

    if (isVisitSort(mode) && !hasAccess) {
      /*
       * The browser only shows its prompt for a request made straight from the click.
       * A request the browser refuses outright counts as a no.
       */
      requestAccess()
        .catch(() => false)
        .then((isGranted) => {
          if (isGranted) {
            setSortMode(mode);
          } else {
            setNotice(
              "Sorting by visits needs access to your browsing history. Your sort stays as it was.",
            );
          }
        });

      return;
    }

    setSortMode(mode);
  };

  const runCommand = (command: Command) => {
    changeSortMode(command.run(sortBy));
    setSearchQuery("");
  };

  // Until the saved choices are in, the list would show the defaults first.
  const isReady =
    isSortHydrated &&
    isSearchHydrated &&
    hasAccess !== undefined &&
    !isLoadingIcons &&
    !(isVisitSort(sortBy) && isLoadingVisits);

  return (
    <div
      data-setting="sidebar.showBookmarks"
      className={cn(
        "relative mt-10 w-full overflow-hidden rounded-2xl border bg-surface first:mt-0",
        displayMode === "Popup" && "shrink-0 shadow-lg shadow-sky-800/30",
      )}
    >
      <div className="relative flex items-stretch border-b">
        <SearchBookmarks
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            resetHighlight();
          }}
          onKeyDown={handleKeyDown}
          listId="bookmarks-list"
          activeItemId={activeItemId}
          autoFocus={displayMode === "Popup"}
        />
        <SortBookmarks
          sortMode={sortBy}
          hasHistoryAccess={!!hasAccess}
          setSortMode={changeSortMode}
          displayMode={displayMode}
        />
      </div>
      <div
        className={cn(
          "flex grow flex-col overflow-y-auto",
          displayMode === "Popup" ? "h-95" : "h-60",
        )}
      >
        {notice && (
          <Notice message={notice} onDismiss={() => setNotice(undefined)} />
        )}

        {isReady && !commands && entries.length === 0 && (
          <NoMatches
            query={searchQuery}
            target={queryTarget}
            onOpen={openQueryTarget}
            engine={searchEngine}
            onEngineChange={(engine) =>
              settings &&
              updateSettings({
                ...settings,
                search: { ...settings.search, engine },
              })
            }
          />
        )}
        {commands && (
          <CommandList
            commands={commands}
            activeCommand={activeCommand}
            getId={getCommandId}
            onRun={runCommand}
          />
        )}

        <div id="bookmarks-list" role="listbox" aria-label="Bookmarks">
          {isReady &&
            entries.map((bookmark) => {
              const isAlreadyShortlink = shortlinks?.some(
                (shortlink) => shortlink.url === bookmark.url,
              );

              return (
                <BookmarkItem
                  key={bookmark.id}
                  item={bookmark}
                  icon={icons?.[bookmark.id]}
                  id={getEntryId(bookmark)}
                  isHighlighted={bookmark === activeEntry}
                  detail={getVisitDetail(
                    sortBy,
                    visits && getVisit(visits, bookmark.url),
                    now,
                  )}
                  displayMode={displayMode}
                  handleEdit={() => setBookmarkToEdit(bookmark)}
                  handleDelete={() => setBookmarkToRemove(bookmark)}
                  handleAddToShortlink={
                    isAlreadyShortlink
                      ? undefined
                      : async () => {
                          if (!bookmark.url) {
                            return;
                          }

                          await addShortlinkMutation.mutateAsync({
                            id: crypto.randomUUID(),
                            url: bookmark.url,
                            title: bookmark.title,
                            subtitle: "",
                          });
                        }
                  }
                />
              );
            })}
        </div>
      </div>

      <EditBookmarkModal
        bookmark={bookmarkToEdit}
        icon={bookmarkToEdit && icons?.[bookmarkToEdit.id]}
        // Hidden behind the removal prompt, which brings it back if you keep the bookmark.
        isVisible={!!bookmarkToEdit && !bookmarkToRemove}
        isSaving={editMutation.isPending}
        onSave={(changes) =>
          bookmarkToEdit &&
          editMutation.mutate({ id: bookmarkToEdit.id, ...changes })
        }
        onDelete={() => setBookmarkToRemove(bookmarkToEdit)}
        onClose={() => setBookmarkToEdit(undefined)}
      />

      <RemoveBookmarkModal
        bookmark={bookmarkToRemove}
        onCancel={() => setBookmarkToRemove(undefined)}
        onConfirm={() => {
          if (bookmarkToRemove) {
            deleteMutation.mutate(bookmarkToRemove.id);
          }

          setBookmarkToRemove(undefined);
          setBookmarkToEdit(undefined);
        }}
      />
    </div>
  );
};

export default Bookmarks;
