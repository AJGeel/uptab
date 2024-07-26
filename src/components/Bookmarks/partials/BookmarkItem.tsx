import { BackspaceIcon } from "@heroicons/react/24/solid";
import { Bookmarks, tabs } from "webextension-polyfill";

import { cn } from "@/src/utils";
import { getFavicon } from "@/src/utils/getFavicon";

import ImageWithFallback from "../../ui/ImageWithFallback";

type Props = {
  item: Bookmarks.BookmarkTreeNode;
  isFocused: boolean;
  displayMode: string;
  onDelete: () => Promise<void>;
};

const BookmarkItem = ({ item, isFocused, displayMode, onDelete }: Props) => (
  <a
    className={cn(
      "group flex items-center gap-3 duration-150 py-1.5 px-2 hover:bg-sky-500/10 text-gray-600 hover:text-sky-800 focus-within:outline-none outline-none",
      isFocused && "first:bg-sky-500/10"
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
      className="size-4"
      src={getFavicon(item?.url || "")}
      fallbackSrc="/icon-34.png"
      loading="lazy"
    />
    <p className="grow truncate">{item.title}</p>
    <BackspaceIcon
      onClick={(event) => {
        event.preventDefault();
        onDelete();
      }}
      className="size-7 shrink-0 rounded-md border bg-white p-1 text-gray-500 opacity-0 shadow-sm duration-150 hover:border-red-500 hover:text-red-500 group-hover:opacity-100"
    />
  </a>
);

export default BookmarkItem;
