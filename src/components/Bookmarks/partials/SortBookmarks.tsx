import { SortMode, SortModes } from "@/src/services/bookmarks/sortBookmarks";
import { cn } from "@/src/utils";

import Select from "../../ui/Select";
import { BookmarksProps } from "../Bookmarks";

type SortProps = BookmarksProps & {
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
};

const options = Object.values(SortModes).map((mode) => ({
  value: mode,
  label: mode,
}));

const SortBookmarks = ({ displayMode, sortMode, setSortMode }: SortProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center border-l bg-white px-1",
      displayMode === "Popup" && "hidden",
    )}
  >
    <Select
      ariaLabel="Sort by"
      value={sortMode}
      options={options}
      triggerLabel={
        <>
          <span className="font-normal text-gray-500">Sort by:</span>{" "}
          {SortModes[sortMode]}
        </>
      }
      className="py-1"
      onValueChange={(value) => setSortMode(value as SortMode)}
    />
  </div>
);

export default SortBookmarks;
