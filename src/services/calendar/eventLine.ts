import { addDays, format, startOfDay } from "date-fns";

import type { CalendarEvent } from "./types";

/** The Join button shows from this long before an event starts. */
export const JOIN_LEAD_MS = 10 * 60 * 1000;

const MINUTE_MS = 60 * 1000;

export type EventLine =
  | { kind: "now"; event: CalendarEvent }
  | { kind: "next"; event: CalendarEvent }
  | { kind: "allDay"; event: CalendarEvent }
  | { kind: "none" };

/** An invitation that hasn't been accepted: not answered yet, or turned down. */
export const isUnaccepted = ({ response }: CalendarEvent) =>
  response === "needsAction" || response === "declined";

/**
 * What the date widget says: what's on right now, else what's next today.
 * All-day events only show when no timed event is left today. Invitations
 * that aren't accepted come last, as they're the least likely to matter.
 */
export const getEventLine = (
  events: CalendarEvent[],
  now: number,
): EventLine => {
  const endOfToday = addDays(startOfDay(now), 1).getTime();
  const today = events.filter(
    ({ start, end }) => end > now && start < endOfToday,
  );
  const timed = today.filter(({ allDay }) => !allDay);
  const accepted = timed.filter((event) => !isUnaccepted(event));
  const invited = timed.filter(isUnaccepted);

  const pick = (candidates: CalendarEvent[]): EventLine | undefined => {
    const current = candidates.find(({ start }) => start <= now);

    if (current) {
      return { kind: "now", event: current };
    }

    const next = candidates.find(({ start }) => start > now);

    return next ? { kind: "next", event: next } : undefined;
  };

  const allDay = today.find((event) => event.allDay);

  return (
    pick(accepted) ??
    (allDay ? { kind: "allDay", event: allDay } : undefined) ??
    pick(invited) ?? { kind: "none" }
  );
};

/** From shortly before the event until it ends, for events with a meeting link. */
export const canJoin = (
  { start, end, meetingLink }: CalendarEvent,
  now: number,
) => Boolean(meetingLink) && now >= start - JOIN_LEAD_MS && now < end;

/** Whole minutes, rounded up, so it never says "in 0m" before an event has begun. */
const minutesBetween = (from: number, to: number) =>
  Math.max(1, Math.ceil((to - from) / MINUTE_MS));

export const formatClock = (time: number, timeFormat: "24h" | "12h" = "24h") =>
  format(time, timeFormat === "12h" ? "h:mm a" : "HH:mm");

/** The muted part after the title: "in 8m", "at 12:30", "20m left", "(all day)". */
export const formatEventTiming = (
  line: Exclude<EventLine, { kind: "none" }>,
  now: number,
  timeFormat: "24h" | "12h" = "24h",
) => {
  const { event } = line;

  if (line.kind === "allDay") {
    return "(all day)";
  }

  if (line.kind === "now") {
    const left = minutesBetween(now, event.end);

    return left <= 60
      ? `${left}m left`
      : `until ${formatClock(event.end, timeFormat)}`;
  }

  const until = minutesBetween(now, event.start);

  return until <= 60
    ? `in ${until}m`
    : `at ${formatClock(event.start, timeFormat)}`;
};

/** The events that touch today, with all-day ones apart, as the agenda lists them. */
export const getTodaysEvents = (events: CalendarEvent[], now: number) => {
  const startOfToday = startOfDay(now).getTime();
  const endOfToday = addDays(startOfToday, 1).getTime();
  const today = events.filter(
    ({ start, end }) => end > startOfToday && start < endOfToday,
  );

  return {
    allDay: today.filter(({ allDay }) => allDay),
    timed: today.filter(({ allDay }) => !allDay),
  };
};

/** The small label on the agenda's next event: "in 8m" while it's close, else "Next". */
export const formatEventBadge = (
  line: Exclude<EventLine, { kind: "none" }>,
  now: number,
) => {
  if (line.kind === "now") {
    return "Now";
  }

  const until = minutesBetween(now, line.event.start);

  return until <= 60 ? `in ${until}m` : "Next";
};

/** Which service a meeting link is for, as a name people know. */
const matchesHost = (hostname: string, allowedHost: string) =>
  hostname === allowedHost || hostname.endsWith(`.${allowedHost}`);

export const getMeetingProvider = (link: string) => {
  const { hostname } = new URL(link);

  if (matchesHost(hostname, "zoom.us")) {
    return "Zoom";
  }

  return matchesHost(hostname, "teams.microsoft.com")
    ? "Microsoft Teams"
    : "Google Meet";
};
