import {
  CalendarPlusIcon,
  CircleNotchIcon,
  CloudSlashIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

import { useSettings } from "@/src/hooks/useSettings";
import type { CalendarStatus } from "@/src/services/calendar/calendarStatus";
import {
  canJoin,
  EventLine,
  formatEventTiming,
  isUnaccepted,
} from "@/src/services/calendar/eventLine";
import { TimeFormat } from "@/src/services/settings/types";
import { cn } from "@/src/utils";

import JoinPill from "./JoinPill";
import PulseDot from "./PulseDot";

type Props = {
  status: CalendarStatus;
  line: EventLine;
  now: number;
  timeFormat: TimeFormat;
  showJoin: boolean;
};

/** Fades in whenever what it shows changes. It doesn't slide, as the whole widget already does. */
const FadeIn = ({ children }: { children: ReactNode }) => (
  <div className="flex min-w-0 items-center gap-1.5 transition-opacity duration-200 motion-reduce:transition-none starting:opacity-0">
    {children}
  </div>
);

const Muted = ({ children }: { children: ReactNode }) => (
  <span className="shrink-0 opacity-70">{children}</span>
);

/** The second line of the date widget: the calendar's state, or what's next. */
const CalendarLine = ({ status, line, now, timeFormat, showJoin }: Props) => {
  const { setShowCalendarPrompt } = useSettings();

  // The line is always this tall, so no state shifts what's around it.
  const renderContents = () => {
    if (status === "notConnected") {
      return (
        <FadeIn key={status}>
          <CalendarPlusIcon
            weight="fill"
            className="size-3.5 shrink-0 opacity-70"
            aria-hidden
          />
          <span className="truncate opacity-70 group-hover:underline">
            Connect your calendar
          </span>
          <span aria-hidden className="shrink-0 opacity-70">
            &middot;
          </span>
          <button
            className="pointer-events-auto relative z-10 shrink-0 rounded-xs whitespace-nowrap opacity-70 duration-150 hover:underline hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            onClick={() => void setShowCalendarPrompt(false)}
          >
            Don&apos;t show this
          </button>
        </FadeIn>
      );
    }

    /*
     * The agenda, which the whole widget opens, explains what to do. No colour
     * here, as none holds up over every photo: it's bolder and underlined instead.
     */
    if (status === "reconnect") {
      return (
        <FadeIn key={status}>
          <WarningIcon
            weight="fill"
            className="size-3.5 shrink-0"
            aria-hidden
          />
          <span className="truncate font-semibold underline underline-offset-2">
            Reconnect calendar
          </span>
        </FadeIn>
      );
    }

    if (status === "loading") {
      return <CircleNotchIcon className="size-3 animate-spin opacity-70" />;
    }

    if (status === "unavailable") {
      return (
        <FadeIn key={status}>
          <Muted>
            <CloudSlashIcon className="size-3.5" aria-hidden />
          </Muted>
          <span className="truncate opacity-70">Couldn&apos;t load events</span>
        </FadeIn>
      );
    }

    if (status !== "ready" && status !== "stale") {
      return null;
    }

    const isStale = status === "stale";
    const staleIcon = isStale && (
      <Muted>
        <CloudSlashIcon
          role="img"
          aria-label="Not updated recently"
          className="size-3.5"
        />
      </Muted>
    );

    if (line.kind === "none") {
      return (
        <FadeIn key="none">
          <span className="truncate opacity-70">Nothing else today</span>
          {staleIcon}
        </FadeIn>
      );
    }

    const { event } = line;
    const isNow = line.kind === "now";
    // Only left to show when nothing accepted is: it gets less weight, and no pulse.
    const isInvite = isUnaccepted(event);

    return (
      <FadeIn key={`${line.kind}-${event.id}`}>
        {isNow && !isInvite && <PulseDot />}
        {/* Quiet, like the weather's text beside it: a bit fainter still for an invitation. */}
        <span
          className={cn(
            "min-w-0 truncate",
            isInvite ? "opacity-50" : "opacity-70",
          )}
        >
          {event.title}
          {isNow && <span aria-hidden> ·</span>}{" "}
          {formatEventTiming(line, now, timeFormat)}
        </span>
        {staleIcon}
        {showJoin && canJoin(event, now) && (
          <JoinPill href={event.meetingLink!} isPrimary={isNow && !isInvite} />
        )}
      </FadeIn>
    );
  };

  return (
    <div
      data-setting="calendar.connection"
      // Only the buttons and links take clicks: the text lets them through to the widget.
      className="pointer-events-none flex h-4 min-w-0 items-center text-xs"
    >
      {renderContents()}
    </div>
  );
};

export default CalendarLine;
