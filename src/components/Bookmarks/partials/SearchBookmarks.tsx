import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { KeyboardEvent } from "react";

/** To focus the search from anywhere, as the `/` hotkey does. */
export const BOOKMARK_SEARCH_ID = "bookmark-search";

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
}: SearchBarProps) => {
  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="relative flex min-w-0 grow">
      <input
        id={BOOKMARK_SEARCH_ID}
        // The caret and the icon take the accent colour. The native clear button is replaced below.
        className="peer w-full min-w-0 cursor-text bg-surface px-9 py-2 font-sans caret-sky-500 focus-within:outline-hidden [&::-webkit-search-cancel-button]:appearance-none"
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
      {/* Follows the input's focus, through `peer`: the duotone fill shows under the bold outline. */}
      <div className="pointer-events-none absolute top-0 left-0 grid h-full place-items-center p-2.5 text-gray-600 duration-150 *:col-start-1 *:row-start-1 peer-focus:text-sky-500 *:first:opacity-0 *:first:duration-150 peer-focus:*:first:opacity-100">
        <MagnifyingGlassIcon weight="duotone" className="size-4" />
        <MagnifyingGlassIcon weight="bold" className="size-4" />
      </div>
      {isSearching && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 duration-150 hover:bg-black/5 hover:text-black active:scale-90"
          onClick={() => {
            setSearchQuery("");
            document.getElementById(BOOKMARK_SEARCH_ID)?.focus();
          }}
        >
          <XIcon weight="bold" className="size-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBookmarks;
