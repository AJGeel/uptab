import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { KeyboardEvent } from "react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** The list the arrow keys move through, and the item they're on. */
  listId: string;
  activeItemId?: string;
  autoFocus?: boolean;
};

const SearchBookmarks = ({
  searchQuery,
  setSearchQuery,
  onKeyDown,
  listId,
  activeItemId,
  autoFocus,
}: SearchBarProps) => (
  <>
    <input
      className="w-full min-w-0 bg-white px-3 py-2 pl-9 font-sans focus-within:outline-hidden"
      placeholder="Search your bookmarks..."
      type="search"
      role="combobox"
      aria-expanded
      aria-controls={listId}
      aria-activedescendant={activeItemId}
      value={searchQuery}
      autoFocus={autoFocus}
      onChange={(event) => setSearchQuery(event.target.value)}
      onKeyDown={onKeyDown}
    />
    <div className="pointer-events-none absolute top-0 left-0 flex items-center justify-center p-2.5">
      <MagnifyingGlassIcon weight="bold" className="size-4 text-gray-600" />
    </div>
  </>
);

export default SearchBookmarks;
