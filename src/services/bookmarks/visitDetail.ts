import { formatLastVisit } from "./formatLastVisit";
import { SortMode } from "./sortBookmarks";
import { Visit } from "./visits";

/** What a visit sort ranks by, to show beside each bookmark. */
export const getVisitDetail = (
  sortMode: SortMode,
  visit: Visit | undefined,
  now: number,
) => {
  if (!visit?.visitCount) {
    return undefined;
  }

  if (sortMode === "Recent") {
    return formatLastVisit(visit.lastVisitTime, now);
  }

  if (sortMode === "Popular") {
    return `${visit.visitCount.toLocaleString("en")} ${visit.visitCount === 1 ? "visit" : "visits"}`;
  }

  return undefined;
};
