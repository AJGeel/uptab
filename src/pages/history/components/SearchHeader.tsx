import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type SearchHeaderProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const SearchHeader = ({ searchQuery, setSearchQuery }: SearchHeaderProps) => (
  <div className="flex items-center gap-6">
    <h1 className="text-xl font-bold">History</h1>
    <div className="relative w-full max-w-sm overflow-hidden rounded-md border bg-gray-50 ring-gray-300 ring-offset-2 duration-150 focus-within:ring-2">
      <input
        className="group w-full bg-transparent px-2 py-1.5 pl-9 font-sans focus-within:outline-none"
        placeholder="Search title or url"
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <div className="pointer-events-none absolute left-0 top-0 flex items-center justify-center p-2.5">
        <MagnifyingGlassIcon className="size-4 text-gray-600" />
      </div>
    </div>
  </div>
);

export default SearchHeader;
