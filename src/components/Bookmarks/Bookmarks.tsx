import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmarks, bookmarks, tabs } from "webextension-polyfill";
import ImageWithFallback from "../ImageWithFallback";
import { getFavicon } from "@src/utils/getFavicon";
import { useState } from "react";
import { cn } from "@src/utils";
import SearchBookmarks from "./SearchBookmarks";
import SortBookmarks, { SortMode } from "./SortBookmarks";
import { mapBookmarks } from "@src/services/bookmarks/mapBookmarks";
import { BackspaceIcon } from "@heroicons/react/24/solid";

export type BookmarksProps = {
  displayMode?: "NewTab" | "Popup";
};

const Bookmarks = ({ displayMode = "NewTab" }: BookmarksProps) => {
  const queryClient = useQueryClient();
  const [sortMode, setSortMode] = useState<SortMode>("Newest");
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

  const sortedBookmarks = data.sort((a, b) => {
    switch (sortMode) {
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      case "Newest":
        return (b?.dateAdded ?? 0) - (a?.dateAdded ?? 0);
      case "Oldest":
        return (a?.dateAdded ?? 0) - (b?.dateAdded ?? 0);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const filteredBookmarks = sortedBookmarks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (item.url &&
        item.url.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

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
        {filteredBookmarks.map((item) => (
          <a
            key={item.id}
            className={cn(
              "group flex items-center gap-3 duration-150 py-1.5 px-2 hover:bg-sky-500/10 text-gray-600 hover:text-sky-800 focus-within:outline-none outline-none",
              searchQuery.length >= 1 && "first:bg-sky-500/10"
            )}
            onClick={(event) => {
              if (displayMode === "Popup") {
                event.preventDefault();
                tabs.create({ url: item.url });
              }
            }}
            href={item.url ?? ""}
          >
            <ImageWithFallback
              className="h-4 w-4"
              src={getFavicon(item?.url || "")}
              fallbackSrc="/icon-34.png"
            />
            <p className="grow truncate">{item.title}</p>
            <BackspaceIcon
              onClick={async (event) => {
                event.preventDefault();

                if (confirm("Are you sure you want to remove this bookmark?")) {
                  await deleteMutation.mutateAsync(item.id);
                }
              }}
              className="h-7 w-7 shrink-0 rounded-md border bg-white p-1 text-gray-500 opacity-0 shadow-sm duration-150 hover:border-red-500 hover:text-red-500 group-hover:opacity-100"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
