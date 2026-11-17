import { CALENDAR_HOST } from "./constants";

type Result = { ok: true; url: string } | { ok: false };

/**
 * Accepts only a Google Calendar address. `webcal://` is quietly turned into
 * `https://`, since that is what Google's "Add calendar" links use.
 */
export const validateCalendarUrl = (input: string): Result => {
  const trimmed = input.trim().replace(/^webcal:\/\//i, "https://");

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "https:" || url.hostname !== CALENDAR_HOST) {
      return { ok: false };
    }

    return { ok: true, url: url.href };
  } catch {
    return { ok: false };
  }
};
