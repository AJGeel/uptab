import { useState } from "react";

import { useSettings } from "@/src/hooks/useSettings";
import { cn, formatToday, formatWeekNumber } from "@/src/utils";

import { widgetHover, widgetPress } from "./widgetHover";
import Link from "../../ui/Link";
import Tooltip from "../../ui/Tooltip";

const CalendarWidget = () => {
  const [today] = useState(() => new Date());
  const { data: settings } = useSettings();

  return (
    <Tooltip label="Open Google Calendar">
      <Link
        href="https://calendar.google.com"
        className={cn("flex flex-col", widgetHover, widgetPress)}
      >
        <p className="font-medium">{formatToday(today)}</p>
        {settings?.dateTime.showWeekNumber && (
          <p
            data-setting="time.showWeekNumber time.weekStartsOn"
            className="text-xs opacity-70"
          >
            {formatWeekNumber(today, settings.dateTime.weekStartsOn)}
          </p>
        )}
      </Link>
    </Tooltip>
  );
};

export default CalendarWidget;
