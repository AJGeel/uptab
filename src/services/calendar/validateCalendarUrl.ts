import { CalendarConnection, getConnection } from "./providers";

type Result =
  { ok: true; url: string; connection: CalendarConnection } | { ok: false };

/**
 * Accepts only an address from a supported calendar, and says which one.
 * `webcal://` is quietly turned into `https://`, as that is what "Add
 * calendar" links use.
 */
export const validateCalendarUrl = (input: string): Result => {
  const trimmed = input.trim().replace(/^webcal:\/\//i, "https://");
  const connection = getConnection(trimmed);

  if (!connection) {
    return { ok: false };
  }

  return { ok: true, url: new URL(trimmed).href, connection };
};
