import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getHistory, organiseHistory } from "@/src/services/history";
import { getFavicon } from "@/src/utils";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return format(date, "HH:mm:ss");
};

const History = () => {
  const { data, isError, isPending } = useQuery({
    queryFn: getHistory,
    queryKey: ["changelog"],
    select: (data) => organiseHistory(data),
  });

  if (isError) {
    return <p>Something has gone wrong.</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl p-12">
        <h2 className="mb-6 text-2xl font-bold">History</h2>
        {Object.entries(data).map(([date, hours]) => (
          <div key={date}>
            <h3 className="text-lg font-bold first:hidden">{date}</h3>
            {Object.entries(hours).map(([hours, items]) => (
              <div key={`${date}-${hours}`}>
                <h4 className="tabular-nums text-black/70">{hours}</h4>
                {items.map(({ id, url, title, lastVisitTime }) => (
                  <a
                    key={id}
                    href={url}
                    className="flex cursor-pointer items-start gap-4 rounded-md px-3 py-2 duration-150 hover:bg-gray-100"
                  >
                    <img
                      className="size-4 shrink-0"
                      loading="lazy"
                      src={getFavicon(url ?? "")}
                    />
                    <div className="flex grow flex-col truncate pr-12">
                      <p className="truncate font-medium">{title ?? url}</p>
                      <p className="truncate text-xs text-black/70">{url}</p>
                    </div>
                    <p className="shrink-0 text-xs tabular-nums text-black/70">
                      {formatTime(lastVisitTime || 0)}
                    </p>
                  </a>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default History;
