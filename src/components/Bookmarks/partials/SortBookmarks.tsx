import {
  getSortField,
  isVisitSort,
  reverseSort,
  SortFields,
  SortMode,
} from "@/src/services/bookmarks/sortBookmarks";
import { cn } from "@/src/utils";

import Select from "../../ui/Select";
import { BookmarksProps } from "../Bookmarks";

type SortProps = BookmarksProps & {
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
  /** Without it, sorting by visits asks for it first. */
  hasHistoryAccess: boolean;
};

const directionLabels: Partial<Record<SortMode, string>> = {
  "A-Z": "A to Z",
  "Z-A": "Z to A",
  Newest: "Newest first",
  Oldest: "Oldest first",
};

const SortBookmarks = ({
  displayMode,
  sortMode,
  setSortMode,
  hasHistoryAccess,
}: SortProps) => {
  const currentField = getSortField(sortMode);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-l bg-white px-1",
        displayMode === "Popup" && "hidden",
      )}
    >
      <Select
        ariaLabel="Sort by"
        value={currentField}
        options={SortFields.map(({ field, label, mode }) => {
          const isCurrent = field === currentField;
          const isReversible = reverseSort(mode) !== mode;

          return {
            value: field,
            label,
            // Choosing the one that's already chosen flips its direction.
            ...(isCurrent && isReversible
              ? {
                  hint: `${directionLabels[sortMode]} · click to reverse`,
                  onClick: () => setSortMode(reverseSort(sortMode)),
                }
              : {}),
            ...(isVisitSort(mode) && !hasHistoryAccess
              ? { hint: "needs history access" }
              : {}),
          };
        })}
        triggerLabel={
          <span className="flex items-center gap-1 whitespace-nowrap">
            <span className="font-normal text-gray-500">Sort by:</span>
            {SortFields.find(({ field }) => field === currentField)?.label}
          </span>
        }
        className="py-1"
        onValueChange={(value) => {
          const field = SortFields.find((option) => option.field === value);

          if (field && field.field !== currentField) {
            setSortMode(field.mode);
          }
        }}
      />
    </div>
  );
};

export default SortBookmarks;
