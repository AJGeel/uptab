import { useQuery } from "@tanstack/react-query";
import { Bookmarks, bookmarks } from "webextension-polyfill";
import ImageWithFallback from "../ImageWithFallback";
import { getFavicon } from "@src/utils/getFavicon";
import { useState } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@src/utils";

const mapBookmarks = (
  bookmarkNodes: Bookmarks.BookmarkTreeNode[],
  parentId?: string
) => {
  return bookmarkNodes.flatMap((node) => {
    const bookmark = {
      id: node.id,
      parentId,
      title: node.title,
      url: node.url,
      dateAdded: node.dateAdded,
    };

    const children: Bookmarks.BookmarkTreeNode[] = node.children
      ? mapBookmarks(node.children, node.id)
      : [];

    return [bookmark, ...children];
  });
};

type BookmarksProps = {
  autoFocus?: boolean;
};

const SortModes = {
  "A-Z": "A-Z",
  "Z-A": "Z-A",
  Newest: "Newest",
  Oldest: "Oldest",
} as const;

type SortMode = keyof typeof SortModes;

const Bookmarks = ({ autoFocus = false }: BookmarksProps) => {
  const [sortMode, setSortMode] = useState<SortMode>("Newest");
  const [searchQuery, setSearchQuery] = useState("");

  const { isPending, isError, data } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const b = await bookmarks.getTree();
      console.log(b);
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
          {/* To Extract: Search Bar */}
          <input
            className="bg-white px-3 py-2 pl-9 focus-within:outline-none w-full font-sans"
            placeholder="Search your bookmarks..."
            type="search"
            value={searchQuery}
            autoFocus={autoFocus}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <div className="flex items-center justify-center absolute top-0 left-0 pointer-events-none p-2.5">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
          </div>
          {/* To Extract: Sort Mode  */}
          <div
            className={cn(
              "flex items-stretch border-l flex-shrink-0 relative bg-white",
              autoFocus ? "hidden" : ""
            )}
          >
            <label
              className="absolute left-2 top-2 pointer-events-none text-gray-500"
              htmlFor="sortSelect"
            >
              Sort by:
            </label>
            <select
              className="pl-20 pr-8 text-right appearance-none focus:outline-none hover:bg-sky-500/10 cursor-pointer duration-150"
              id="sortSelect"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              {Object.keys(SortModes).map((mode) => (
                <option key={mode} value={mode as SortMode}>
                  {SortModes[mode as SortMode]}
                </option>
              ))}
            </select>
            <ChevronUpDownIcon className="w-4 h-4 pointer-events-none absolute right-1.5 top-3 text-gray-500" />
          </div>
        </div>
        {filteredBookmarks.length === 0 && (
          <p className="py-1.5 px-2 text-gray-600">No results found...</p>
        )}
        {filteredBookmarks.map((item) => (
          <a
            className="flex items-center gap-3 duration-150 py-1.5 px-2 hover:bg-sky-500/10 text-gray-600 hover:text-sky-800 focus-within:outline-none"
            key={item.id}
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
