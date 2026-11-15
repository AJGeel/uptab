import { addDays } from "date-fns";
import { storage } from "webextension-polyfill";

const NUDGED_KEY = "errorReportsNudgedAt";
const DAYS_BEFORE_NUDGE = 1;

/**
 * Shown a day after the first look (right away on dev), and until it's closed:
 * once closed, never again for the life of the install. Not at all when error
 * reports are on already.
 */
export const isErrorReportsNudgeDue = ({
  nudgedAt,
  firstSeenAt,
  isEnabled,
  now = Date.now(),
}: {
  nudgedAt?: number;
  firstSeenAt: number;
  isEnabled: boolean;
  now?: number;
}) =>
  !isEnabled &&
  nudgedAt === undefined &&
  (import.meta.env.VITE_IS_DEV === "true" ||
    addDays(firstSeenAt, DAYS_BEFORE_NUDGE).getTime() <= now);

export const getErrorReportsNudgedAt = async () =>
  (await storage.local.get(NUDGED_KEY))[NUDGED_KEY] as number | undefined;

/** Closing the nudge is what ends it: opening the setting from it doesn't. */
export const setErrorReportsNudged = () =>
  storage.local.set({ [NUDGED_KEY]: Date.now() });
