import { addDays, startOfDay } from "date-fns";

import { getCalendarUrl, hasCalendarAccess } from "./calendarConnection";
import { parseCalendar } from "./parseCalendar";
import type { CalendarEvent } from "./types";

/**
 * `reconnect`: the address was reset in Google, or the access was taken back.
 * `offline`: anything else, such as no connection or Google being down.
 */
export class CalendarError extends Error {
  constructor(readonly kind: "reconnect" | "offline") {
    // Never put the address in here: errors can end up in reports.
    super(`Calendar unavailable: ${kind}`);
  }
}

/** Google answers with these once the secret address has been reset. */
const isAddressGone = (status: number) => status === 403 || status === 404;

export const getCalendarEvents = async (
  now = new Date(),
): Promise<CalendarEvent[]> => {
  const url = await getCalendarUrl();

  // Without an address there's nothing to show, and nothing was disconnected.
  if (!url) {
    return [];
  }

  // The browser can't tell "no access" from "no connection" once fetch fails.
  if (!(await hasCalendarAccess())) {
    throw new CalendarError("reconnect");
  }

  let response: Response;

  try {
    // Fresh data every time: Google's own copy is already behind.
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new CalendarError("offline");
  }

  if (isAddressGone(response.status)) {
    throw new CalendarError("reconnect");
  }

  if (!response.ok) {
    throw new CalendarError("offline");
  }

  try {
    // Today and tomorrow, so a tab left open past midnight still has events.
    const from = startOfDay(now);

    return parseCalendar(await response.text(), from, addDays(from, 2));
  } catch {
    throw new CalendarError("offline");
  }
};
