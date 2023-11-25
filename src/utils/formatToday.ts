import { format } from "date-fns";

export const formatToday = (date: Date) => format(date, "EEEE, do MMM yyyy");
