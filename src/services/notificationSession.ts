import { storage } from "webextension-polyfill";

export type NotificationKind = "update" | "errorReports" | "feedback";

const KEY = "notificationShownThisSession";

/*
 * `storage.session` lasts until the browser closes. Firefox before 115 lacks
 * it, and there nothing locks: each tab then shows what's due.
 */

/** The notification this browser session has shown, if any. */
export const getSessionNotification = async () => {
  try {
    return (await storage.session.get(KEY))[KEY] as
      NotificationKind | undefined;
  } catch {
    return undefined;
  }
};

export const setSessionNotification = async (kind: NotificationKind) => {
  try {
    await storage.session.set({ [KEY]: kind });
  } catch {
    // No session storage: see above.
  }
};
