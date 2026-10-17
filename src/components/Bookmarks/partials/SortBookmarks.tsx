import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { SortMode, SortModes } from "@/src/services/bookmarks/sortBookmarks";
import { cn } from "@/src/utils";

import { BookmarksProps } from "../Bookmarks";

type SortProps = BookmarksProps & {
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
};

const SortBookmarks = ({ displayMode, sortMode, setSortMode }: SortProps) => (
  <div
    className={cn(
      "relative flex shrink-0 items-stretch border-l bg-white",
      displayMode === "Popup" && "hidden",
    )}
  >
    <label
      className="pointer-events-none absolute top-2 left-2 text-gray-500"
      htmlFor="sortSelect"
    >
      Sort by:
    </label>
    <select
      className="cursor-pointer appearance-none bg-white pr-8 pl-20 text-right duration-150 hover:bg-sky-500/10 focus:outline-hidden"
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
    <ChevronUpDownIcon className="pointer-events-none absolute top-3 right-1.5 size-4 text-gray-500" />
  </div>
);

export default SortBookmarks;
