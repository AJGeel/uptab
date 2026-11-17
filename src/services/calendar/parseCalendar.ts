import ICAL from "ical.js";

import type { CalendarEvent } from "./types";

/** Stops a daily event from years ago from looping forever. */
const MAX_OCCURRENCES = 10_000;

const MEETING_LINK =
  /https:\/\/(?:meet\.google\.com\/[a-z0-9-]+|[a-z0-9.-]*zoom\.us\/(?:j|my)\/[^\s"<>]+|teams\.microsoft\.com\/l\/meetup-join\/[^\s"<>]+)/i;

const findMeetingLink = (event: ICAL.Event) => {
  const { component } = event;
  const candidates = [
    component.getFirstPropertyValue("x-google-conference"),
    event.location,
    event.description,
  ];

  for (const text of candidates) {
    const link = typeof text === "string" ? MEETING_LINK.exec(text)?.[0] : "";

    if (link) {
      return link;
    }
  }
};

/** All-day events are local days, not UTC instants. */
const toMillis = (time: ICAL.Time) =>
  time.isDate
    ? new Date(time.year, time.month - 1, time.day).getTime()
    : time.toJSDate().getTime();

const isCancelled = (event: ICAL.Event) =>
  String(event.component.getFirstPropertyValue("status")).toUpperCase() ===
  "CANCELLED";

const toCalendarEvent = (
  event: ICAL.Event,
  start: ICAL.Time,
  end: ICAL.Time,
): CalendarEvent => {
  const startMs = toMillis(start);

  return {
    id: `${event.uid}@${startMs}`,
    title: event.summary || "Untitled event",
    start: startMs,
    end: toMillis(end),
    allDay: start.isDate,
    location: event.location || undefined,
    meetingLink: findMeetingLink(event),
  };
};

/**
 * Reads a calendar feed into the events that overlap `from`–`to`, with
 * recurring events expanded. Sorted by start; cancelled events are dropped.
 */
export const parseCalendar = (
  ics: string,
  from: Date,
  to: Date,
): CalendarEvent[] => {
  const root = new ICAL.Component(ICAL.parse(ics));

  for (const zone of root.getAllSubcomponents("vtimezone")) {
    ICAL.TimezoneService.register(zone);
  }

  const events = root
    .getAllSubcomponents("vevent")
    .map((c) => new ICAL.Event(c));
  const masters = new Map<string, ICAL.Event>();
  const singles: ICAL.Event[] = [];
  const exceptions: ICAL.Event[] = [];

  for (const event of events) {
    if (event.isRecurrenceException()) {
      exceptions.push(event);
    } else if (event.isRecurring()) {
      masters.set(event.uid, event);
    } else {
      singles.push(event);
    }
  }

  for (const exception of exceptions) {
    const master = masters.get(exception.uid);

    if (master) {
      master.relateException(exception);
    } else {
      // Its series isn't in the feed, so it stands alone.
      singles.push(exception);
    }
  }

  const fromMs = from.getTime();
  const toMs = to.getTime();
  const result: CalendarEvent[] = [];

  const add = (event: ICAL.Event, start: ICAL.Time, end: ICAL.Time) => {
    if (isCancelled(event)) {
      return;
    }

    const item = toCalendarEvent(event, start, end);

    if (item.end > fromMs && item.start < toMs) {
      result.push(item);
    }
  };

  for (const event of singles) {
    add(event, event.startDate, event.endDate);
  }

  for (const master of masters.values()) {
    const iterator = master.iterator();

    for (let i = 0; i < MAX_OCCURRENCES; i++) {
      const next = iterator.next();

      if (!next || toMillis(next) >= toMs) {
        break;
      }

      const { item, startDate, endDate } = master.getOccurrenceDetails(next);

      add(item, startDate, endDate);
    }
  }

  return result.sort((a, b) => a.start - b.start || a.end - b.end);
};
