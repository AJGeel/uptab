import { addMonths } from "date-fns";
import { storage } from "webextension-polyfill";

import { FeedbackFrequency } from "../settings/types";

const STORAGE_KEY = "feedbackAskedAt";

const MONTHS_BETWEEN_ASKS: Record<FeedbackFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  never: Infinity,
};

/** Due once the last ask is as old as the chosen interval. */
export const isFeedbackDue = (
  askedAt: number,
  frequency: FeedbackFrequency,
  now = Date.now(),
) =>
  frequency !== "never" &&
  addMonths(askedAt, MONTHS_BETWEEN_ASKS[frequency]).getTime() <= now;

export const setFeedbackAsked = () =>
  storage.local.set({ [STORAGE_KEY]: Date.now() });

/** When the last ask was. A first look only starts the clock, so nobody is asked on day one. */
export const getFeedbackAskedAt = async () => {
  const askedAt = (await storage.local.get(STORAGE_KEY))[STORAGE_KEY] as
    number | undefined;

  if (askedAt !== undefined) {
    return askedAt;
  }

  await setFeedbackAsked();

  return Date.now();
};
