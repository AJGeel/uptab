import { useQuery } from "@tanstack/react-query";
import { addHours, format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { InView } from "react-intersection-observer";

import Spinner from "@/src/components/ui/Spinner";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  getHistory,
  getHoursWithHistory,
  organiseHistory,
} from "@/src/services/history";

import HistoryItem from "./components/HistoryItem";
import SearchHeader from "./components/SearchHeader";
import TimelineView from "./components/TimelineView";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { debouncedValue: debouncedSearchQuery } = useDebounce(
    searchQuery,
    200
  );
  const [activeDay, setActiveDay] = useState<string>();
  const [activeHour, setActiveHour] = useState<string>();

  const { data, isError, isPending } = useQuery({
    queryFn: () => getHistory({ query: debouncedSearchQuery }),
    queryKey: ["changelog", debouncedSearchQuery],
    placeholderData: (previousData) => previousData,
    select: (data) => organiseHistory(data),
  });

  const availableHours = useMemo(
    () => getHoursWithHistory(data, activeDay),
    [data, activeDay]
  );

  if (isError) {
    return <p>Unable to display history.</p>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4">
        <div className="sticky top-0 z-10 mb-6 space-y-4 border-b bg-white pb-4 pt-6">
          <SearchHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TimelineView
            activeDay={activeDay}
            activeHour={activeHour}
            availableHours={availableHours}
          />
        </div>
        {isPending ? (
          <Spinner className="size-6" />
        ) : (
          <div>
            {Array.from(data.entries()).length === 0 && <p>*crickets*</p>}
            {Array.from(data.entries()).map(([date, hours]) => (
              <section key={date}>
                <h2 className="mt-10 text-lg font-bold">
                  {format(parseISO(date), "EEEE, yyyy-MM-dd")}
                </h2>
                {Array.from(hours.entries()).map(([hour, items]) => (
                  <InView
                    key={`${date}_${hour}`}
                    as="div"
                    onChange={(inView) => {
                      if (inView) {
                        setActiveHour(hour);
                        setActiveDay(date);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="my-4 font-medium text-black/80">
                        {hour}:00
                      </h3>
                      <button
                        onClick={() => {
                          alert("TODO: Delete the history range");
                        }}
                        className="rounded-md bg-gray-50 px-1.5 py-0.5 text-xs border border-gray-200 duration-150 hover:border-black hover:bg-black hover:text-white focus-visible:ring-2 ring-offset-2 ring-gray-300 outline-none"
                      >
                        Delete
                      </button>
                    </div>
                    {items.map((item) => (
                      <HistoryItem key={item.id} {...item} />
                    ))}
                  </InView>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
