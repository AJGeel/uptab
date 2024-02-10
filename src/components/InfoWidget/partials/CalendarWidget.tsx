import { formatToday, formatWeekNumber } from "@/src/utils";

import Link from "../../ui/Link";

const CalendarWidget = () => {
  const today = new Date();

  return (
    <Link href="https://calendar.google.com" className="flex flex-col">
      <p className="font-medium">{formatToday(today)}</p>
      <p className="text-xs opacity-70">{formatWeekNumber(today)}</p>
    </Link>
  );
};

export default CalendarWidget;
