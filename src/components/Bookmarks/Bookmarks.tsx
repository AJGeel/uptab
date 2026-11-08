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
import {
  isVisitSort,
  SortMode,
  SortModes,
} from "@/src/services/bookmarks/sortBookmarks";
import { getVisitDetail } from "@/src/services/bookmarks/visitDetail";
import { getVisit } from "@/src/services/bookmarks/visits";
import { addShortlink } from "@/src/services/shortlinks";
import { cn } from "@/src/utils";

import BookmarkItem from "./partials/BookmarkItem";
import EditBookmarkModal from "./partials/EditBookmarkModal";
import SearchBookmarks from "./partials/SearchBookmarks";
import SortBookmarks from "./partials/SortBookmarks";
import Button, { buttonVariants } from "../ui/Button";
import Modal from "../ui/Modal";

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

  const { entries, activeEntry, getEntryId, resetHighlight, handleKeyDown } =
    useBookmarkNavigation({
      bookmarks: data ?? [],
      sortMode: sortBy,
      visits,
      searchQuery,
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
          activeItemId={activeEntry ? getEntryId(activeEntry) : undefined}
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
          <div
            role="status"
            className="flex shrink-0 items-start gap-2 bg-amber-50 px-2 py-1.5 text-xs text-amber-950"
          >
            <p className="grow">{notice}</p>
            <Button
              label="Dismiss"
              variant={buttonVariants.inline}
              onClick={() => setNotice(undefined)}
            />
          </div>
        )}

        {isReady && entries.length === 0 && (
          <p className="px-2 py-1.5 text-gray-600">
            Nothing matches that. Try another word?
          </p>
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

      <Modal
        isVisible={!!bookmarkToRemove}
        onClose={() => setBookmarkToRemove(undefined)}
        title="Ready to say goodbye?"
        subtitle={
          <>
            <strong className="font-semibold">{bookmarkToRemove?.title}</strong>{" "}
            is about to vanish from your browser&apos;s bookmarks too. No
            take-backs.
          </>
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Phew, keep it!"
              variant={buttonVariants.secondary}
              onClick={() => setBookmarkToRemove(undefined)}
            />
            <Button
              label="Bye bye, bookmark!"
              className="bg-red-500 ring-red-500"
              onClick={() => {
                if (bookmarkToRemove) {
                  deleteMutation.mutate(bookmarkToRemove.id);
                }

                setBookmarkToRemove(undefined);
                setBookmarkToEdit(undefined);
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default Bookmarks;
