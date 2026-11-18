const GOOGLE_UID_SUFFIX = "@google.com";

/**
 * The calendar's own id, which sits in the secret address:
 * `…/calendar/ical/<id>/private-<secret>/basic.ics`. Only the id is returned,
 * never the secret.
 */
export const getCalendarId = (feedUrl: string) => {
  const id = /\/calendar\/ical\/([^/]+)\//.exec(feedUrl)?.[1];

  try {
    return id && decodeURIComponent(id);
  } catch {
    return undefined;
  }
};

/** `20261117T090000Z` for a moment, or `20261117` for an all-day date: Google's instance suffix. */
const formatInstance = (time: Date, isAllDay: boolean) => {
  const iso = time.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

  return isAllDay ? iso.slice(0, 8) : iso;
};

/** Google Calendar's day view, for events that can't be linked to one by one. */
export const getDayUrl = (start: number) => {
  const day = new Date(start);

  return `https://calendar.google.com/calendar/r/day/${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`;
};

type EventLinkInput = {
  uid: string;
  start: number;
  isAllDay: boolean;
  /** For an occurrence of a repeating event: which one, as it was originally scheduled. */
  instance?: Date;
  calendarId?: string;
};

/**
 * The page of one event in Google Calendar. Google builds these from the
 * event's id and its calendar's id, which the feed has, so nothing else is
 * needed. Anything else falls back to the day it's on.
 */
export const getEventUrl = ({
  uid,
  start,
  isAllDay,
  instance,
  calendarId,
}: EventLinkInput) => {
  if (!calendarId || !uid.endsWith(GOOGLE_UID_SUFFIX)) {
    return getDayUrl(start);
  }

  const id = uid.slice(0, -GOOGLE_UID_SUFFIX.length);
  const eventId = instance ? `${id}_${formatInstance(instance, isAllDay)}` : id;
  let eid: string;

  try {
    eid = btoa(`${eventId} ${calendarId}`).replace(/=+$/, "");
  } catch {
    // An id with characters base64 can't take as they are.
    return getDayUrl(start);
  }

  return `https://calendar.google.com/calendar/event?eid=${encodeURIComponent(eid)}`;
};

/** A Google Maps search for a place written out as text, as the feed gives it. */
export const getMapsUrl = (location: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

/** Locations can be a web address, such as a video call, which isn't a place. */
export const isPlace = (location: string) =>
  !/^https?:\/\//i.test(location.trim());
