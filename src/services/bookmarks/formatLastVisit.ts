const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
/** Past this, "N weeks ago" stops saying anything useful. */
const VAGUE_AFTER = 8 * WEEK;

const plural = (count: number, unit: string) =>
  `${count} ${unit}${count === 1 ? "" : "s"} ago`;

/** How long ago a visit was, roughly: "5 hours ago", "2 weeks ago". */
export const formatLastVisit = (time: number, now: number) => {
  const elapsed = now - time;

  if (elapsed < MINUTE) {
    return "Just now";
  }

  if (elapsed < HOUR) {
    return `${Math.floor(elapsed / MINUTE)} min ago`;
  }

  if (elapsed < DAY) {
    return plural(Math.floor(elapsed / HOUR), "hour");
  }

  if (elapsed < WEEK) {
    return plural(Math.floor(elapsed / DAY), "day");
  }

  if (elapsed < VAGUE_AFTER) {
    return plural(Math.floor(elapsed / WEEK), "week");
  }

  return "A while back";
};
