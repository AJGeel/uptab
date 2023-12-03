import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  autoFocus?: boolean;
};

const SearchBookmarks = ({
  searchQuery,
  setSearchQuery,
  autoFocus,
}: SearchBarProps) => (
  <>
    <input
      className="bg-white px-3 py-2 pl-9 focus-within:outline-none w-full font-sans"
      placeholder="Search your bookmarks..."
      type="search"
      value={searchQuery}
      autoFocus={autoFocus}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
    <div className="flex items-center justify-center absolute top-0 left-0 pointer-events-none p-2.5">
      <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
    </div>
  </>
);

export default SearchBookmarks;
