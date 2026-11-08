import { addMonths, addWeeks } from "date-fns";
import { storage } from "webextension-polyfill";

import { FeedbackFrequency } from "../settings/types";

const ASKED_KEY = "feedbackAskedAt";
const FIRST_SEEN_KEY = "feedbackFirstSeenAt";
const WEEKS_BEFORE_FIRST_ASK = 2;

const MONTHS_BETWEEN_ASKS: Record<FeedbackFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  never: Infinity,
};

export type FeedbackHistory = {
  /** The last ask, if there has been one. */
  askedAt?: number;
  firstSeenAt: number;
};

/** The first ask comes after a short wait (right away on dev), the rest at the chosen interval. */
export const isFeedbackDue = (
  { askedAt, firstSeenAt }: FeedbackHistory,
  frequency: FeedbackFrequency,
  now = Date.now(),
) => {
  if (frequency === "never") {
    return false;
  }

  if (askedAt === undefined) {
    return (
      import.meta.env.VITE_IS_DEV === "true" ||
      addWeeks(firstSeenAt, WEEKS_BEFORE_FIRST_ASK).getTime() <= now
    );
  }

  return addMonths(askedAt, MONTHS_BETWEEN_ASKS[frequency]).getTime() <= now;
};

export const setFeedbackAsked = () =>
  storage.local.set({ [ASKED_KEY]: Date.now() });

/** A first look only starts the clock, so nobody is asked on day one. */
export const getFeedbackHistory = async (): Promise<FeedbackHistory> => {
  const stored = await storage.local.get([ASKED_KEY, FIRST_SEEN_KEY]);
  const askedAt = stored[ASKED_KEY] as number | undefined;
  const firstSeenAt = stored[FIRST_SEEN_KEY] as number | undefined;

  if (firstSeenAt !== undefined) {
    return { askedAt, firstSeenAt };
  }

  const now = Date.now();

  await storage.local.set({ [FIRST_SEEN_KEY]: now });

  return { askedAt, firstSeenAt: now };
};
