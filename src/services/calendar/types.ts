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
  /** Where the event is in Google Calendar. */
  url: string;
  /** Your answer to the invitation, when the feed says. Left out for your own events. */
  response?: "accepted" | "tentative" | "declined" | "needsAction";
};
