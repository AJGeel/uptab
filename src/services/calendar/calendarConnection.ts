import { permissions, storage } from "webextension-polyfill";

import { CALENDAR_ORIGIN } from "./constants";

/*
 * The secret address is a password. It lives only here, in this device's local
 * storage: never in synced storage, a query key, or the persisted query cache.
 */
const URL_KEY = "calendarUrl";

const ORIGIN = { origins: [CALENDAR_ORIGIN] };

export const getCalendarUrl = async () =>
  ((await storage.local.get(URL_KEY))[URL_KEY] as string | undefined) ??
  undefined;

export const hasCalendarAccess = () => permissions.contains(ORIGIN);

/**
 * Asks the browser for access to Google Calendar and, once allowed, keeps the
 * address. Call it straight from a click: browsers refuse to prompt after an
 * `await`, so nothing before the request may be asynchronous.
 */
export const connectCalendar = (url: string) => {
  const request = permissions.request(ORIGIN);

  return request.then(async (isGranted) => {
    if (isGranted) {
      await storage.local.set({ [URL_KEY]: url });
    }

    return isGranted;
  });
};

/** Forgets the address and gives the access back. */
export const disconnectCalendar = async () => {
  await storage.local.remove(URL_KEY);
  await permissions.remove(ORIGIN);
};
