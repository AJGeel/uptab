import { getISOWeek } from "date-fns";

export const formatWeekNumber = (date: Date) => `Week ${getISOWeek(date)}`;
