import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { cn } from "@src/utils";

export const SortModes = {
  "A-Z": "A-Z",
  "Z-A": "Z-A",
  Newest: "Newest",
  Oldest: "Oldest",
} as const;

export type SortMode = keyof typeof SortModes;

type SortProps = {
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
  autoFocus?: boolean;
};

const Sort = ({ autoFocus, sortMode, setSortMode }: SortProps) => (
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
);

export default Sort;
