/*
 * TEMPORARY, for looking at every state of the calendar widget without a real
 * calendar. Delete this file, CalendarDebugPanel, useCalendarDebugStore, and
 * their use in CalendarWidget and Homescreen when it's no longer needed.
 */
import { addDays, startOfDay } from "date-fns";

import type { CalendarStatus } from "./calendarStatus";
import type { CalendarEvent } from "./types";

export const DEBUG_STATES = [
  "notConnected",
  "loading",
  "next",
  "later",
  "now",
  "allDay",
  "none",
  "stale",
  "unavailable",
  "reconnect",
] as const;

export type DebugState = (typeof DEBUG_STATES)[number];

const MINUTE = 60_000;
const MEET = "https://meet.google.com/abc-defg-hij";

const timed = (
  id: string,
  title: string,
  now: number,
  startMinutes: number,
  minutes: number,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => ({
  id,
  title,
  start: now + startMinutes * MINUTE,
  end: now + (startMinutes + minutes) * MINUTE,
  allDay: false,
  ...extra,
});

const birthday = (now: number): CalendarEvent => ({
  id: "birthday",
  title: "Kim's birthday",
  start: startOfDay(now).getTime(),
  end: addDays(startOfDay(now), 1).getTime(),
  allDay: true,
});

export const getDebugView = (
  state: DebugState,
  now: number,
): {
  status: CalendarStatus;
  events: CalendarEvent[];
  dataUpdatedAt: number;
} => {
  const breakfast = timed("breakfast", "Breakfast with Joe", now, -200, 50, {
    location: "Cafe Zuid",
  });
  const planning = timed("planning", "Planning", now, 150, 60, {
    location: "Room 4",
  });
  const standup = timed("standup", "Standup", now, 8, 15, {
    meetingLink: MEET,
  });
  const review = timed("review", "Design review", now, -10, 30, {
    meetingLink: MEET,
  });
  const lunch = timed("lunch", "Lunch with Sanne", now, 90, 60, {
    location: "Restaurant Noord, Amsterdam",
  });

  const view = (
    status: CalendarStatus,
    events: CalendarEvent[],
    minutesAgo = 4,
  ) => ({ status, events, dataUpdatedAt: now - minutesAgo * MINUTE });

  switch (state) {
    case "notConnected":
      return view("notConnected", []);
    case "loading":
      return view("loading", []);
    case "next":
      return view("ready", [birthday(now), breakfast, standup, planning]);
    case "later":
      return view("ready", [breakfast, lunch]);
    case "now":
      return view("ready", [breakfast, review, planning]);
    case "allDay":
      return view("ready", [birthday(now), breakfast]);
    case "none":
      return view("ready", [breakfast]);
    case "stale":
      return view("stale", [breakfast, standup, planning], 95);
    case "unavailable":
      return view("unavailable", []);
    default:
      return view("reconnect", []);
  }
};
