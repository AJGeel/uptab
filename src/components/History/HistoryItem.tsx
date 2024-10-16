import { format } from "date-fns";

import type { HistoryItem } from "@/src/services/history";
import { getFavicon } from "@/src/utils";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return format(date, "HH:mm:ss");
};

const HistoryItem = ({ id, url, title, lastVisitTime }: HistoryItem) => (
  <a
    key={id}
    href={url}
    className="flex cursor-pointer items-start gap-4 rounded-md px-3 py-2 duration-150 hover:bg-gray-100"
  >
    <img
      className="mt-2 size-4 shrink-0"
      loading="lazy"
      src={getFavicon(url ?? "")}
    />
    <div className="flex grow flex-col truncate pr-12">
      <p className="truncate font-medium">{title ?? url}</p>
      <p className="truncate text-[11px] text-black/50">{url}</p>
    </div>
    <p className="shrink-0 text-xs tabular-nums text-black/70">
      {formatTime(lastVisitTime || 0)}
    </p>
  </a>
);

export default HistoryItem;
