import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSubmit: () => void;
  autoFocus?: boolean;
};

const SearchBookmarks = ({
  searchQuery,
  setSearchQuery,
  handleSubmit,
  autoFocus,
}: SearchBarProps) => (
  <>
    <input
      className="w-full bg-white px-3 py-2 pl-9 font-sans focus-within:outline-none"
      placeholder="Search your bookmarks..."
      type="search"
      value={searchQuery}
      autoFocus={autoFocus}
      onChange={(event) => setSearchQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          handleSubmit();
        }
      }}
    />
    <div className="pointer-events-none absolute left-0 top-0 flex items-center justify-center p-2.5">
      <MagnifyingGlassIcon className="size-4 text-gray-600" />
    </div>
  </>
);

export default SearchBookmarks;
