import { MapPinIcon, VideoCameraIcon } from "@phosphor-icons/react";

import {
  formatClock,
  getMeetingProvider,
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

/** One timed event in the agenda: its times, title, where or how, and a way to join. */
const AgendaEventRow = ({ event, now, timeFormat, showJoin, badge }: Props) => {
  const isOver = event.end <= now;
  const isNow = event.start <= now && !isOver;

  return (
    <li
      className={cn(
        "relative flex items-start gap-3 rounded-xl p-2 duration-150 hover:bg-black/5",
        // Past events stay in view, but quiet.
        isOver && "opacity-50",
      )}
    >
      <div className="w-14 shrink-0 text-sm leading-snug whitespace-nowrap">
        <p className="font-semibold">{formatClock(event.start, timeFormat)}</p>
        <p className="text-gray-600">{formatClock(event.end, timeFormat)}</p>
      </div>

      <div className="min-w-0 grow">
        <p className="truncate text-sm leading-snug font-medium">
          {/* Covers the whole row, so the pill and the place sit above it. */}
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xs after:absolute after:inset-0 after:rounded-xl focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:outline-sky-500"
          >
            {event.title}
          </a>
        </p>

        {(event.location || event.meetingLink) && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600">
            {event.meetingLink ? (
              <>
                <VideoCameraIcon className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">
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
                      className="relative z-10 truncate rounded-xs hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
                    >
                      {event.location}
                    </a>
                  </Tooltip>
                ) : (
                  <span className="truncate">{event.location}</span>
                )}
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-px">
        {badge && (
          <span className="flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-sky-800 dark:text-sky-300">
            {isNow && <PulseDot />}
            {badge}
          </span>
        )}
        {showJoin && event.meetingLink && !isOver && (
          <JoinPill
            href={event.meetingLink}
            isPrimary={isNow}
            placement="agenda"
          />
        )}
      </div>
    </li>
  );
};

export default AgendaEventRow;
