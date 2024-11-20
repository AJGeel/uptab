import { subDays } from "date-fns";

/** Generates an array that dates of today to 6 days from now */
export const generateDayArray = (startingPoint: Date) =>
  Array.from({ length: 7 }, (_, i) => subDays(startingPoint, i));
