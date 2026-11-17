import { CalendarError } from "./calendarError";

/** Events older than this get the "not updated recently" icon. */
export const STALE_AFTER_MS = 60 * 60 * 1000;

export type CalendarStatus =
  /** Not known yet, as the saved address is still being read. */
  | "pending"
  | "notConnected"
  | "loading"
  | "reconnect"
  /** Failed, and nothing saved to show instead. */
  | "unavailable"
  /** Showing saved events, because the last refresh failed or is old. */
  | "stale"
  | "ready";

type Input = {
  isConnected: boolean | undefined;
  hasEvents: boolean;
  error: unknown;
  dataUpdatedAt: number;
  now: number;
};

export const getCalendarStatus = ({
  isConnected,
  hasEvents,
  error,
  dataUpdatedAt,
  now,
}: Input): CalendarStatus => {
  if (isConnected === undefined) {
    return "pending";
  }

  if (!isConnected) {
    return "notConnected";
  }

  if (error instanceof CalendarError && error.kind === "reconnect") {
    return "reconnect";
  }

  if (!hasEvents) {
    return error ? "unavailable" : "loading";
  }

  return error || now - dataUpdatedAt > STALE_AFTER_MS ? "stale" : "ready";
};
