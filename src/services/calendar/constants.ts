// No imports: the manifest reads this at build time.
export const CALENDAR_HOST = "calendar.google.com";

/** The only site UpTab asks to read, and only once a calendar is connected. */
export const CALENDAR_ORIGIN = `https://${CALENDAR_HOST}/*`;
