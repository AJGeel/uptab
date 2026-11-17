/** Plain data only, so it can be cached as JSON. Times are epoch milliseconds. */
export type CalendarEvent = {
  id: string;
  title: string;
  start: number;
  /** All-day events end at the start of the next local day (exclusive). */
  end: number;
  allDay: boolean;
  location?: string;
  meetingLink?: string;
};
