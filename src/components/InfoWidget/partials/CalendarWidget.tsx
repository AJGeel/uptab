import { useCalendarEvents } from "@/src/hooks/queries/useCalendarEvents";
import { useNow } from "@/src/hooks/useNow";
import { useSettings } from "@/src/hooks/useSettings";
import { getCalendarStatus } from "@/src/services/calendar/calendarStatus";
import { getEventLine } from "@/src/services/calendar/eventLine";
import { cn, formatToday } from "@/src/utils";

import CalendarLine from "./CalendarLine";
import { widgetHover, widgetPress } from "./widgetHover";
import Link from "../../ui/Link";
import Tooltip from "../../ui/Tooltip";

type Props = {
  /** The sidebar has its own setting for showing events. */
  isSidebar?: boolean;
};

const CalendarWidget = ({ isSidebar }: Props) => {
  const now = useNow();
  const { data: settings } = useSettings();
  const { isConnected, data, error, dataUpdatedAt } = useCalendarEvents();

  const status = getCalendarStatus({
    isConnected,
    hasEvents: data !== undefined,
    error,
    dataUpdatedAt,
    now,
  });
  const isPrompt = status === "notConnected";
  // Connecting is always offered, but events only show where they're switched on.
  const showLine =
    isPrompt || !isSidebar || settings?.calendar.showInSidebar !== false;

  return (
    <div
      className={cn(
        "group relative flex max-w-72 min-w-0 flex-col",
        widgetHover,
        widgetPress,
      )}
    >
      {/* Stays a link to Google Calendar until the agenda takes its place. */}
      {!isPrompt && status !== "reconnect" && (
        <Tooltip label="Open Google Calendar">
          <Link
            href="https://calendar.google.com"
            className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            <span className="sr-only">Open Google Calendar</span>
          </Link>
        </Tooltip>
      )}

      <p className="font-medium">{formatToday(new Date(now))}</p>

      {showLine && (
        <CalendarLine
          status={status}
          line={getEventLine(data ?? [], now)}
          now={now}
          timeFormat={settings?.dateTime.timeFormat ?? "24h"}
          showJoin={settings?.calendar.showJoinButton !== false}
        />
      )}
    </div>
  );
};

export default CalendarWidget;
