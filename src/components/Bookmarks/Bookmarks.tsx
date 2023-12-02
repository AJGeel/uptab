import { useQuery } from "@tanstack/react-query";
import { Bookmarks, bookmarks } from "webextension-polyfill";
import ImageWithFallback from "../ImageWithFallback";
import { getFavicon } from "@src/utils/getFavicon";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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

const Bookmarks = ({ autoFocus = false }: BookmarksProps) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const b = await bookmarks.getTree();
      return mapBookmarks(b).filter((item) => !!item.url);
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  if (isPending) {
    return <p className="mt-10">Loading...</p>;
  }

  if (isError) {
    return <p>Unable to display your bookmarks.</p>;
  }

  const filteredBookmarks = data.filter(
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
          autoFocus ? "h-96" : "h-60"
        )}
      >
        <div className="sticky top-0">
          <input
            className="bg-white border-b px-3 py-2 pl-9 focus-within:outline-none w-full"
            placeholder="Search your bookmarks..."
            type="search"
            value={searchQuery}
            autoFocus={autoFocus}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <div className="flex items-center justify-center absolute top-0 left-0 pointer-events-none p-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
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
