import {
  CalendarPlusIcon,
  CircleNotchIcon,
  CloudSlashIcon,
  VideoCameraIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import type { CalendarStatus } from "@/src/services/calendar/calendarStatus";
import {
  canJoin,
  EventLine,
  formatEventTiming,
} from "@/src/services/calendar/eventLine";
import { TimeFormat } from "@/src/services/settings/types";
import { cn } from "@/src/utils";

type Props = {
  status: CalendarStatus;
  line: EventLine;
  now: number;
  timeFormat: TimeFormat;
  showJoin: boolean;
};

/** Fades in sliding from the right, whenever what it shows changes. */
const FadeIn = ({ children }: { children: ReactNode }) => (
  <div className="flex min-w-0 items-center gap-1.5 transition-[opacity,translate] duration-200 motion-reduce:transition-none starting:translate-x-2 starting:opacity-0 motion-reduce:starting:translate-x-0">
    {children}
  </div>
);

/** Covers the whole widget, so the text on top of it can't take the click. */
const triggerStyles =
  "flex min-w-0 items-center gap-1.5 rounded-xs text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-sky-500";

const Muted = ({ children }: { children: ReactNode }) => (
  <span className="shrink-0 opacity-70">{children}</span>
);

const JoinPill = ({
  href,
  isPrimary,
}: {
  href: string;
  isPrimary: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    data-setting="calendar.showJoinButton"
    className={cn(
      // The pseudo-element makes the small pill comfortable to hit.
      "relative z-10 inline-flex h-4 shrink-0 items-center gap-1 rounded-full px-1.5 text-[11px] leading-none font-medium whitespace-nowrap duration-150 before:absolute before:-inset-x-1 before:-inset-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
      isPrimary
        ? "bg-sky-500 text-on-accent hover:brightness-110"
        : "bg-black/5 hover:bg-black/10",
    )}
  >
    <VideoCameraIcon weight="fill" className="size-3" aria-hidden />
    Join
  </a>
);

/** The second line of the date widget: the calendar's state, or what's next. */
const CalendarLine = ({ status, line, now, timeFormat, showJoin }: Props) => {
  const openModal = useModalStore((state) => state.openModal);
  const connect = () => openModal(Modals.calendarConnect);

  // The line is always this tall, so no state shifts what's around it.
  const renderContents = () => {
    if (status === "notConnected" || status === "reconnect") {
      const isReconnect = status === "reconnect";

      return (
        <FadeIn key={status}>
          <button className={triggerStyles} onClick={connect}>
            {isReconnect ? (
              <WarningIcon
                weight="fill"
                className="size-3.5 shrink-0 text-amber-600"
                aria-hidden
              />
            ) : (
              <CalendarPlusIcon
                weight="fill"
                className="size-3.5 shrink-0 text-sky-600 dark:text-sky-300"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "truncate font-medium group-hover:underline",
                isReconnect && "text-amber-800",
              )}
            >
              {isReconnect ? "Reconnect calendar" : "Connect your calendar"}
            </span>
          </button>
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

    return (
      <FadeIn key={`${line.kind}-${event.id}`}>
        {isNow && (
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-sky-500 ring-2 ring-sky-500/25"
          />
        )}
        <span className="min-w-0 truncate">
          <span className="font-medium">{event.title}</span>{" "}
          {isNow && <span aria-hidden>·</span>}{" "}
          <span className="opacity-70">
            {formatEventTiming(line, now, timeFormat)}
          </span>
        </span>
        {staleIcon}
        {showJoin && canJoin(event, now) && (
          <JoinPill href={event.meetingLink!} isPrimary={isNow} />
        )}
      </FadeIn>
    );
  };

  return (
    <div
      data-setting="calendar.connection"
      className="flex h-4 min-w-0 items-center text-xs"
    >
      {renderContents()}
    </div>
  );
};

export default CalendarLine;
