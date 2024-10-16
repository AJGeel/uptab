import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useState } from "react";

import HistoryItem from "@/src/components/History/HistoryItem";
import Spinner from "@/src/components/ui/Spinner";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getHistory, organiseHistory } from "@/src/services/history";

const SearchHeader = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => (
  <div className="mb-6 flex items-center gap-6" id="header">
    <h1 className="text-2xl font-bold">History</h1>
    <div className="relative w-full max-w-sm overflow-hidden rounded-md border bg-gray-50">
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

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { debouncedValue: debouncedSearchQuery } = useDebounce(
    searchQuery,
    200
  );

  const { data, isError, isPending } = useQuery({
    queryFn: () => getHistory({ query: debouncedSearchQuery }),
    queryKey: ["changelog", debouncedSearchQuery],
    placeholderData: (previousData) => previousData,
    select: (data) => organiseHistory(data),
  });

  console.log(data);

  if (isError) {
    return <p>Unable to display history.</p>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl p-8">
        <SearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {isPending ? (
          <Spinner className="size-6" />
        ) : (
          <>
            {Array.from(data.entries()).map(([date, hours]) => (
              <div key={date} className="">
                {/* TODO: Format dates to (Monday, 16-10-2024) or intl */}
                <h2 className="pt-10 text-lg font-bold">
                  {format(parseISO(date), "EEEE yyyy-MM-dd")}
                </h2>
                {Array.from(hours.entries()).map(([hour, items]) => (
                  <div key={`${date}-${hour}`}>
                    <h3 className="py-4 font-medium text-black/80">
                      {hour}:00
                    </h3>
                    {items.map((item) => (
                      <HistoryItem key={item.id} {...item} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </>
          // <>
          //   {/* {data.length === 0 && <p>Nothing was found.</p>} */}
          //   {/* {data.map(({item}) => (
          //     <HistoryItem key={item.id} {...item} />
          //   ))} */}
          // </>
        )}
      </div>
    </main>
  );
};

export default History;
