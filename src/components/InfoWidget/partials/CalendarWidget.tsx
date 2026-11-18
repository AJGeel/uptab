import { Popover } from "@base-ui/react/popover";
import { useState } from "react";

import { useCalendarEvents } from "@/src/hooks/queries/useCalendarEvents";
import { useCalendarDebugStore } from "@/src/hooks/stores/useCalendarDebugStore";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useNow } from "@/src/hooks/useNow";
import { useSettings } from "@/src/hooks/useSettings";
import {
  CalendarStatus,
  getCalendarStatus,
} from "@/src/services/calendar/calendarStatus";
import { getDebugView } from "@/src/services/calendar/debugView";
import { getEventLine } from "@/src/services/calendar/eventLine";
import { cn, formatToday } from "@/src/utils";

import CalendarAgenda from "./CalendarAgenda";
import CalendarLine from "./CalendarLine";
import { widgetHover, widgetPress } from "./widgetHover";
import Tooltip from "../../ui/Tooltip";

type Props = {
  /** The sidebar has its own setting for showing events. */
  isSidebar?: boolean;
};

const getTriggerLabel = (status: CalendarStatus) => {
  switch (status) {
    case "reconnect":
      return "Your calendar needs reconnecting";
    case "loading":
      return "Loading your events…";
    case "unavailable":
      return "Couldn't load your events";
    case "stale":
      return "See today's events (not updated recently)";
    default:
      return "See today's events";
  }
};

const CalendarWidget = ({ isSidebar }: Props) => {
  const now = useNow();
  const { data: settings } = useSettings();
  const { isConnected, data, error, dataUpdatedAt, refetch } =
    useCalendarEvents();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const debugState = useCalendarDebugStore((state) => state.state);
  const real = {
    status: getCalendarStatus({
      isConnected,
      hasEvents: data !== undefined,
      error,
      dataUpdatedAt,
      now,
    }),
    events: data ?? [],
    dataUpdatedAt,
  };
  // TEMPORARY: forced by the debug panel.
  const view = debugState ? getDebugView(debugState, now) : real;
  const { status, events } = view;
  const line = getEventLine(events, now);
  const timeFormat = settings?.dateTime.timeFormat ?? "24h";
  const showJoin = settings?.calendar.showJoinButton !== false;
  const isPrompt = status === "notConnected";
  // The prompt connects instead, and until it's known nothing is connected yet.
  const canOpenAgenda = !isPrompt && status !== "pending";
  // Connecting is always offered, but events only show where they're switched on.
  const isShownHere = isSidebar
    ? settings?.calendar.showInSidebar
    : settings?.calendar.showOnHomescreen;
  const showLine = isPrompt
    ? settings?.calendar.showConnectPrompt !== false
    : isShownHere !== false;

  return (
    <div
      className={cn(
        "group relative flex max-w-72 min-w-0 flex-col",
        widgetHover,
        widgetPress,
      )}
    >
      {/* The whole date connects, also when the prompt itself is hidden. */}
      {isPrompt && (
        <Tooltip label="Show your Google Calendar events here" side="bottom">
          <button
            className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            onClick={() => openModal(Modals.calendarConnect)}
          >
            <span className="sr-only">Connect your calendar</span>
          </button>
        </Tooltip>
      )}

      {canOpenAgenda && (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          {/* Says what the widget is for right now, which matters most when tabbing to it. */}
          <Tooltip
            label={getTriggerLabel(status)}
            side="bottom"
            disabled={isOpen}
          >
            <Popover.Trigger className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
              <span className="sr-only">{getTriggerLabel(status)}</span>
            </Popover.Trigger>
          </Tooltip>

          <Popover.Portal>
            {/* A faint dimming, to draw the eye to the agenda. */}
            <Popover.Backdrop className="fixed inset-0 z-40 bg-scrim/15 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Popover.Positioner sideOffset={12} className="z-50">
              <Popover.Popup className="origin-(--transform-origin) rounded-2xl border bg-surface/95 text-black shadow-lg outline-hidden backdrop-blur-lg transition-[opacity,translate] duration-150 ease-out data-ending-style:-translate-y-1 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:opacity-0">
                <CalendarAgenda
                  status={status}
                  events={events}
                  line={line}
                  now={now}
                  timeFormat={timeFormat}
                  showJoin={showJoin}
                  updatedAt={view.dataUpdatedAt}
                  onRetry={refetch}
                  onClose={() => setIsOpen(false)}
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}

      <p className="pointer-events-none font-medium">
        {formatToday(new Date(now))}
      </p>

      {showLine && (
        <CalendarLine
          status={status}
          line={line}
          now={now}
          timeFormat={timeFormat}
          showJoin={showJoin}
        />
      )}
    </div>
  );
};

export default CalendarWidget;
