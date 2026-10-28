import { format } from "date-fns";

import { PhotoChange } from "@/src/services/settings/types";

const HOURS_PER_BLOCK = 6;

/**
 * Names the stretch of time a photo lasts, which is what the stored pick is
 * compared against. Every new tab is a stretch of its own, named by `seed`.
 */
export const getPhotoPeriod = (
  photoChange: PhotoChange,
  now: Date,
  seed: string,
) => {
  switch (photoChange) {
    case "everyTab":
      return seed;
    case "hourly":
      return format(now, "yyyy-MM-dd HH");
    case "sixHours":
      return `${format(now, "yyyy-MM-dd")} ${Math.floor(now.getHours() / HOURS_PER_BLOCK)}`;
    default:
      return format(now, "yyyy-MM-dd");
  }
};
