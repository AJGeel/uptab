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
