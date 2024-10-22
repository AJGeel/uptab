import { format } from "date-fns";

export const formatHourDisplay = (dateStr: string, hourStr: string) => {
  const fullDateTime = `${dateStr}T${hourStr}:00:00Z`;
  const date = new Date(fullDateTime);

  return format(date, "HH:00");
};
