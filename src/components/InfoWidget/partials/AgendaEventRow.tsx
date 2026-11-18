import { MapPinIcon, VideoCameraIcon } from "@phosphor-icons/react";

import {
  formatClock,
  getMeetingProvider,
  isUnaccepted,
} from "@/src/services/calendar/eventLine";
import { getMapsUrl, isPlace } from "@/src/services/calendar/eventUrl";
import type { CalendarEvent } from "@/src/services/calendar/types";
import { TimeFormat } from "@/src/services/settings/types";
import { cn } from "@/src/utils";

import JoinPill from "./JoinPill";
import PulseDot from "./PulseDot";
import Tooltip from "../../ui/Tooltip";

type Props = {
  event: CalendarEvent;
  now: number;
  timeFormat: TimeFormat;
  showJoin: boolean;
  /** The small accent label, on the event that's on or next. */
  badge?: string;
};

/** A line through the text that fades in with the row, and out on hover or focus. */
const STRIKE = [
  "line-through decoration-current transition-[text-decoration-color] duration-300 motion-reduce:transition-none starting:decoration-transparent",
  "group-hover:decoration-transparent group-focus-within:decoration-transparent",
].join(" ");

/** One timed event in the agenda: its times, title, where or how, and a way to join. */
const AgendaEventRow = ({ event, now, timeFormat, showJoin, badge }: Props) => {
  const isOver = event.end <= now;
  const isNow = event.start <= now && !isOver;
  // An invitation that isn't accepted is shown, but with less weight. Once it's over, it's just a past event.
  const isInvite = isUnaccepted(event) && !isOver;
  const inviteLabel = event.response === "declined" ? "Declined" : "Invited";
  const hasPlace = Boolean(event.location || event.meetingLink);

  return (
    <li
      className={cn(
        "group relative flex items-start gap-3 rounded-xl p-2 transition-[background-color,opacity] duration-150 hover:bg-black/5",
        // Past events and unaccepted invitations stay in view, but barely. They clear up on hover.
        (isOver || isInvite) &&
          "opacity-50 focus-within:opacity-100 hover:opacity-100",
      )}
    >
      <div className="w-14 shrink-0 text-sm leading-snug whitespace-nowrap">
        <p
          className={cn(
            isInvite ? "font-medium" : "font-semibold",
            isOver && STRIKE,
          )}
        >
          {formatClock(event.start, timeFormat)}
        </p>
        <p className={cn("text-gray-600", isOver && STRIKE)}>
          {formatClock(event.end, timeFormat)}
        </p>
      </div>

      <div className="min-w-0 grow">
        <p
          className={cn(
            "truncate text-sm leading-snug",
            isInvite ? "font-normal" : "font-medium",
          )}
        >
          {/* Covers the whole row, so the pill and the place sit above it. */}
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "rounded-xs after:absolute after:inset-0 after:rounded-xl focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:outline-sky-500",
              isOver && STRIKE,
            )}
          >
            {event.title}
          </a>
        </p>

        {hasPlace && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600">
            {event.meetingLink ? (
              <>
                <VideoCameraIcon className="size-3.5 shrink-0" aria-hidden />
                <span className={cn("truncate", isOver && STRIKE)}>
                  {getMeetingProvider(event.meetingLink)}
                </span>
              </>
            ) : (
              <>
                <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
                {isPlace(event.location!) ? (
                  <Tooltip label="Open in Google Maps" side="bottom">
                    <a
                      href={getMapsUrl(event.location!)}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "relative z-10 truncate rounded-xs hover:underline focus-visible:outline-2 focus-visible:outline-sky-500",
                        isOver && STRIKE,
                      )}
                    >
                      {event.location}
                    </a>
                  </Tooltip>
                ) : (
                  <span className={cn("truncate", isOver && STRIKE)}>
                    {event.location}
                  </span>
                )}
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-px">
        {isInvite && (
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
            {inviteLabel}
          </span>
        )}
        {badge && (
          <span className="flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-sky-800 dark:text-sky-300">
            {isNow && <PulseDot />}
            {badge}
          </span>
        )}
        {showJoin && event.meetingLink && !isOver && (
          <JoinPill
            href={event.meetingLink}
            isPrimary={isNow && !isInvite}
            placement="agenda"
          />
        )}
      </div>
    </li>
  );
};

export default AgendaEventRow;
