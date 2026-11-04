import {
  BackspaceIcon,
  PencilSimpleIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Bookmarks, tabs } from "webextension-polyfill";

import { cn } from "@/src/utils";

import Favicon from "../../ui/Favicon";
import Tooltip from "../../ui/Tooltip";

type Props = {
  item: Bookmarks.BookmarkTreeNode;
  /** Replaces the site's own icon. */
  icon?: string;
  id: string;
  isHighlighted: boolean;
  /** Light grey on the right, until the actions show on hover: when they last visited. */
  detail?: string;
  displayMode: string;
  handleEdit: () => void;
  handleDelete: () => void;
  handleAddToShortlink?: () => Promise<void>;
};

const BookmarkItem = ({
  item,
  icon,
  id,
  isHighlighted,
  detail,
  displayMode,
  handleEdit,
  handleDelete,
  handleAddToShortlink,
}: Props) => (
  <a
    id={id}
    role="option"
    aria-selected={isHighlighted}
    className={cn(
      "group relative flex scroll-mt-9 items-center gap-3 px-2 py-1.5 text-gray-600 outline-hidden duration-150 focus-within:outline-hidden hover:bg-sky-500/10 hover:text-sky-800 focus-visible:bg-sky-500/10 focus-visible:text-sky-800",
      isHighlighted && "bg-sky-500/10 text-sky-800",
    )}
    onClick={(event) => {
      if (displayMode === "Popup") {
        event.preventDefault();
        tabs.create({ url: item.url });
      }
    }}
    href={item.url ?? ""}
  >
    <Favicon
      className="size-4 rounded-xs"
      icon={icon}
      url={item?.url}
      loading="lazy"
    />
    <p className="grow truncate">{item.title}</p>
    {detail && (
      <span className="pointer-events-none absolute right-2 text-xs whitespace-nowrap text-gray-400 duration-200 group-hover:opacity-0">
        {detail}
      </span>
    )}
    <div className="flex scale-90 items-center gap-1 opacity-0 duration-200 group-hover:scale-100 group-hover:opacity-100">
      {handleAddToShortlink && (
        <Tooltip label="Pin it as a shortlink">
          <PlusIcon
            weight="bold"
            onClick={(event) => {
              event.preventDefault();
              handleAddToShortlink();
            }}
            className="size-7 shrink-0 rounded-lg border bg-white p-1 text-gray-500 shadow-xs ring-sky-500 duration-150 hover:text-sky-500 hover:ring-2"
          />
        </Tooltip>
      )}
      <Tooltip label="Edit bookmark">
        <PencilSimpleIcon
          weight="fill"
          onClick={(event) => {
            event.preventDefault();
            handleEdit();
          }}
          className="size-7 shrink-0 rounded-lg border bg-white p-1 text-gray-500 shadow-xs ring-sky-500 duration-150 hover:text-sky-500 hover:ring-2"
        />
      </Tooltip>
      <Tooltip label="Remove bookmark">
        <BackspaceIcon
          weight="fill"
          onClick={(event) => {
            event.preventDefault();
            handleDelete();
          }}
          className="size-7 shrink-0 rounded-lg border bg-white p-1 text-gray-500 shadow-xs ring-red-500 duration-150 hover:text-red-500 hover:ring-2"
        />
      </Tooltip>
    </div>
  </a>
);

export default BookmarkItem;
