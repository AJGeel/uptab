import { useQuery } from "@tanstack/react-query";
import { Bookmarks, bookmarks } from "webextension-polyfill";
import ImageWithFallback from "../ImageWithFallback";
import { getFavicon } from "@src/utils/getFavicon";
import { useState } from "react";
import { cn } from "@src/utils";
import SearchBar from "./SearchBar";
import Sort, { SortMode } from "./Sort";
import { mapBookmarks } from "@src/services/bookmarks/mapBookmarks";

type BookmarksProps = {
  autoFocus?: boolean;
};

const Bookmarks = ({ autoFocus = false }: BookmarksProps) => {
  const [sortMode, setSortMode] = useState<SortMode>("Newest");
  const [searchQuery, setSearchQuery] = useState("");

  const { isPending, isError, data } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const b = await bookmarks.getTree();
      return mapBookmarks(b).filter((item) => !!item.url);
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
    <div className="mt-10 w-full">
      <div
        className={cn(
          "flex flex-col overflow-y-auto border rounded-md mt-2 bg-white",
          autoFocus
            ? " h-[400px] shadow-lg shadow-sky-800/30 flex-shrink-0"
            : "h-60"
        )}
      >
        <div className="sticky top-0 border-b flex items-stretch">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            autoFocus={autoFocus}
          />
          <Sort
            sortMode={sortMode}
            setSortMode={setSortMode}
            autoFocus={autoFocus}
          />
        </div>
        {filteredBookmarks.length === 0 && (
          <p className="py-1.5 px-2 text-gray-600">No results found...</p>
        )}
        {filteredBookmarks.map((item) => (
          <a
            key={item.id}
            className="flex items-center gap-3 duration-150 py-1.5 px-2 hover:bg-sky-500/10 text-gray-600 hover:text-sky-800 focus-within:outline-none"
            href={item.url ?? ""}
          >
            <ImageWithFallback
              className="w-4 h-4"
              src={getFavicon(item?.url || "")}
              fallbackSrc="/icon-34.png"
            />
            <p className="truncate">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
