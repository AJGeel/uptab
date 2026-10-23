import { useState } from "react";

import { cn, formatToday, formatWeekNumber } from "@/src/utils";

import { widgetHover, widgetPress } from "./widgetHover";
import Link from "../../ui/Link";
import Tooltip from "../../ui/Tooltip";

const CalendarWidget = () => {
  const [today] = useState(() => new Date());

  return (
    <Tooltip label="Open Google Calendar">
      <Link
        href="https://calendar.google.com"
        className={cn("flex flex-col", widgetHover, widgetPress)}
      >
        <p className="font-medium">{formatToday(today)}</p>
        <p className="text-xs opacity-70">{formatWeekNumber(today)}</p>
      </Link>
    </Tooltip>
  );
};

export default CalendarWidget;
