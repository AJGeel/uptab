import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Bookmarks, bookmarks, tabs } from "webextension-polyfill";

import { filterBookmarks } from "@/src/services/bookmarks/filterBookmarks";
import { mapBookmarks } from "@/src/services/bookmarks/mapBookmarks";
import {
  SortMode,
  SortModes,
  sortBookmarks,
} from "@/src/services/bookmarks/sortBookmarks";
import { cn } from "@/src/utils";

import BookmarkItem from "./partials/BookmarkItem";
import SearchBookmarks from "./partials/SearchBookmarks";
import SortBookmarks from "./partials/SortBookmarks";

export type BookmarksProps = {
  displayMode?: "NewTab" | "Popup";
};

const Bookmarks = ({ displayMode = "NewTab" }: BookmarksProps) => {
  const queryClient = useQueryClient();
  const [sortMode, setSortMode] = useState<SortMode>(SortModes.Newest);
  const [searchQuery, setSearchQuery] = useState("");

  const { isPending, isError, data } = useQuery({
    queryFn: async () => {
      const b = await bookmarks.getTree();
      return mapBookmarks(b).filter((item) => !!item.url);
    },
    queryKey: ["bookmarks"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await bookmarks.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  if (isPending) {
    return <p className="mt-10">Loading...</p>;
  }

  if (isError) {
    return <p>Unable to display your bookmarks.</p>;
  }

  const sortedBookmarks = sortBookmarks(data, sortMode);
  const filteredBookmarks = filterBookmarks(sortedBookmarks, searchQuery);

  return (
    <div
      className={cn(
        "mt-10 w-full border rounded-md bg-white overflow-hidden relative",
        displayMode === "Popup" && "shadow-lg shadow-sky-800/30 flex-shrink-0"
      )}
    >
      <div className="relative flex items-stretch border-b">
        <SearchBookmarks
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          autoFocus={displayMode === "Popup"}
          handleSubmit={() => {
            if (searchQuery.length >= 1 && filteredBookmarks.length >= 1) {
              tabs.create({ url: filteredBookmarks[0].url });
            }
          }}
        />
        <SortBookmarks
          sortMode={sortMode}
          setSortMode={setSortMode}
          displayMode={displayMode}
        />
      </div>
      <div
        className={cn(
          "flex flex-col overflow-y-auto flex-grow",
          displayMode === "Popup" ? "h-[380px]" : "h-60"
        )}
      >
        {filteredBookmarks.length === 0 && (
          <p className="px-2 py-1.5 text-gray-600">No results found...</p>
        )}

        {filteredBookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            item={bookmark}
            isFocused={searchQuery.length >= 1}
            displayMode={displayMode}
            onDelete={async () => {
              if (confirm("Are you sure you want to remove this bookmark?")) {
                await deleteMutation.mutateAsync(bookmark.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
