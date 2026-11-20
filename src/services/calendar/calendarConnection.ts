import { permissions, storage } from "webextension-polyfill";

import { getConnection } from "./providers";

/*
 * The secret address is a password. It lives only here, in this device's local
 * storage: never in synced storage, a query key, or the persisted query cache.
 */
const URL_KEY = "calendarUrl";

/** Only the site the address is on, not every supported one. */
const getOrigin = (url: string) => ({
  origins: [`https://${getConnection(url)!.host}/*`],
});

export const getCalendarUrl = async () =>
  ((await storage.local.get(URL_KEY))[URL_KEY] as string | undefined) ??
  undefined;

export const hasCalendarAccess = (url: string) =>
  permissions.contains(getOrigin(url));

/**
 * Asks the browser for access to the address's site and, once allowed, keeps the
 * address. Call it straight from a click: browsers refuse to prompt after an
 * `await`, so nothing before the request may be asynchronous.
 */
export const connectCalendar = (url: string) => {
  const request = permissions.request(getOrigin(url));

  return request.then(async (isGranted) => {
    if (isGranted) {
      await storage.local.set({ [URL_KEY]: url });
    }

    return isGranted;
  });
};

/** Forgets the address and gives the access back. */
export const disconnectCalendar = async () => {
  const url = await getCalendarUrl();

  await storage.local.remove(URL_KEY);

  if (url && getConnection(url)) {
    await permissions.remove(getOrigin(url));
  }
};
