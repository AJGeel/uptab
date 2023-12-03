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
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const b = await bookmarks.getTree();
      return mapBookmarks(b).filter((item) => !!item.url);
    },
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
        "mt-10 w-full border rounded-md bg-white overflow-hidden relative1",
        displayMode === "Popup" && "shadow-lg shadow-sky-800/30 flex-shrink-0"
      )}
    >
      <div className="border-b flex items-stretch relative">
        <SearchBookmarks
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          autoFocus={displayMode === "Popup"}
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
          <p className="py-1.5 px-2 text-gray-600">No results found...</p>
        )}
        {filteredBookmarks.map((item) => (
          <a
            key={item.id}
            className="group flex items-center gap-3 duration-150 py-1.5 px-2 hover:bg-sky-500/10 text-gray-600 hover:text-sky-800 focus-within:outline-none outline-none"
            onClick={(event) => {
              if (displayMode === "Popup") {
                event.preventDefault();
                tabs.create({ url: item.url });
              }
            }}
            href={item.url ?? ""}
          >
            <ImageWithFallback
              className="w-4 h-4"
              src={getFavicon(item?.url || "")}
              fallbackSrc="/icon-34.png"
            />
            <p className="truncate flex-grow">{item.title}</p>
            <BackspaceIcon
              onClick={async (event) => {
                event.preventDefault();

                if (confirm("Are you sure you want to remove this bookmark?")) {
                  await deleteMutation.mutateAsync(item.id);
                }
              }}
              className="w-7 h-7 p-1 flex-shrink-0 border shadow-sm bg-white text-gray-500 rounded-md hover:text-red-500 hover:border-red-500 opacity-0 group-hover:opacity-100 duration-150"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
