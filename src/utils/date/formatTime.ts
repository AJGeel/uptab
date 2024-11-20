import { format } from "date-fns";

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);

  return format(date, "HH:mm:ss");
};
