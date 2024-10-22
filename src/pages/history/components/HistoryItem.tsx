import { format } from "date-fns";

import ImageFadeIn from "@/src/components/ui/ImageFadeIn";
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
    className="flex cursor-pointer items-start gap-4 rounded-md px-2 py-1.5 outline-none ring-sky-500 duration-150 hover:bg-gray-100 focus:z-10 focus:ring-2 active:scale-95 active:opacity-70"
  >
    <ImageFadeIn
      className="mt-2 size-4 shrink-0 rounded-sm"
      loading="lazy"
      src={getFavicon(url ?? "")}
      alt={`Favicon for ${url}`}
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
