import { formatClock } from "./eventLine";

/** "just now", "4 min ago" or "3 h ago": how long since events were last fetched. */
export const formatUpdatedAgo = (updatedAt: number, now: number) => {
  const minutes = Math.floor((now - updatedAt) / 60_000);

  if (minutes < 1) {
    return "just now";
  }

  return minutes < 60
    ? `${minutes} min ago`
    : `${Math.floor(minutes / 60)} h ago`;
};

/** When events were last fetched, as a clock time, for when they're out of date. */
export const formatUpdatedAt = (
  updatedAt: number,
  timeFormat: "24h" | "12h" = "24h",
) => formatClock(updatedAt, timeFormat);
