import { HistoryItem, OrganisedHistory } from "./types";

/**
 * 1. Group history by day, then by hour.
 * 2. Sorts history in descending order (latest first)
 */
export const organiseHistory = (history: HistoryItem[]): OrganisedHistory => {
  const grouped = history.reduce<OrganisedHistory>((acc, item) => {
    const date = new Date(item.lastVisitTime || 0);
    const [dateString] = date.toISOString().split("T");
    const hourString = date.getUTCHours().toString().padStart(2, "0");

    if (!acc.has(dateString)) {
      acc.set(dateString, new Map());
    }
    const dayMap = acc.get(dateString)!;

    if (!dayMap.has(hourString)) {
      dayMap.set(hourString, []);
    }
    dayMap.get(hourString)!.push(item);

    return acc;
  }, new Map());

  const sorted = new Map(
    [...grouped.entries()]
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, hours]) => [
        date,
        new Map(
          [...hours.entries()].sort(([hourA], [hourB]) =>
            hourB.localeCompare(hourA)
          )
        ),
      ])
  );

  return sorted;
};
