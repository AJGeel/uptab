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
      "flex items-stretch border-l flex-shrink-0 relative bg-white",
      displayMode === "Popup" && "hidden"
    )}
  >
    <label
      className="pointer-events-none absolute left-2 top-2 text-gray-500"
      htmlFor="sortSelect"
    >
      Sort by:
    </label>
    <select
      className="cursor-pointer appearance-none pl-20 pr-8 text-right duration-150 hover:bg-sky-500/10 focus:outline-none"
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
    <ChevronUpDownIcon className="pointer-events-none absolute right-1.5 top-3 h-4 w-4 text-gray-500" />
  </div>
);

export default SortBookmarks;
