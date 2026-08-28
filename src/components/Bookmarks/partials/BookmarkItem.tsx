import { BackspaceIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Bookmarks, tabs } from "webextension-polyfill";

import { cn } from "@/src/utils";
import { getFavicon } from "@/src/utils/getFavicon";

import ImageWithFallback from "../../ui/ImageWithFallback";

type Props = {
  item: Bookmarks.BookmarkTreeNode;
  isFocused: boolean;
  displayMode: string;
  handleDelete: () => Promise<void>;
  handleAddToShortlink?: () => Promise<void>;
};

const BookmarkItem = ({ item, isFocused, displayMode, handleDelete, handleAddToShortlink }: Props) => (
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
      className="size-4 rounded-sm"
      src={getFavicon(item?.url || "")}
      fallbackSrc="/icon-34.png"
      loading="lazy"
    />
    <p className="grow truncate">{item.title}</p>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
      {handleAddToShortlink && <PlusIcon
        onClick={(event) => {
          event.preventDefault();
          handleAddToShortlink();
        }}
        className="size-7 shrink-0 rounded-md border bg-white p-1 text-gray-500 shadow-sm ring-sky-500 duration-150 hover:text-sky-500 hover:ring-2"
      />}
      <BackspaceIcon
        onClick={(event) => {
          event.preventDefault();
          handleDelete();
        }}
        className="size-7 shrink-0 rounded-md border bg-white p-1 text-gray-500 shadow-sm ring-red-500 duration-150 hover:text-red-500 hover:ring-2"
      />
    </div>
  </a>
);

export default BookmarkItem;
