import { getISOWeek, getWeek } from "date-fns";

import { WeekStart } from "@/src/services/settings/types";

/** Monday weeks are numbered the ISO way; Sunday weeks the US way. */
export const formatWeekNumber = (
  date: Date,
  weekStartsOn: WeekStart = "monday",
) =>
  `Week ${
    weekStartsOn === "monday"
      ? getISOWeek(date)
      : getWeek(date, { weekStartsOn: 0, firstWeekContainsDate: 1 })
  }`;
