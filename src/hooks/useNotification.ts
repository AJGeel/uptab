import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  getErrorReportsNudgedAt,
  isErrorReportsNudgeDue,
  setErrorReportsNudged,
} from "@/src/services/errorReportsNudge";
import {
  getFeedbackHistory,
  isFeedbackDue,
  setFeedbackAsked,
} from "@/src/services/feedbackPrompt/feedbackSchedule";
import {
  NotificationKind,
  getSessionNotification,
  setSessionNotification,
} from "@/src/services/notificationSession";
import { FeedbackFrequency } from "@/src/services/settings/types";
import { getUpdateNotification } from "@/src/services/updateNotification/getUpdateNotification";
import { setUpdateNotification } from "@/src/services/updateNotification/setUpdateNotification";

type Options = {
  showUpdates: boolean;
  feedbackFrequency: FeedbackFrequency;
  isErrorReportingOn: boolean;
};

const queryKey = ["notification"];

/** In the order they're shown: only the first one that's due gets its turn. */
const PRIORITY: NotificationKind[] = ["update", "errorReports", "feedback"];

/**
 * The one notification this browser session shows: an update, a nudge about
 * error reports, or else a feedback ask. The first one shown locks out the
 * others until the browser restarts, and keeps showing in new tabs until it's
 * closed. What's pending is read once, so closing one doesn't bring up another.
 */
export const useNotification = ({
  showUpdates,
  feedbackFrequency,
  isErrorReportingOn,
}: Options) => {
  const queryClient = useQueryClient();

  // Shared, so hiding the notification in one place hides it everywhere.
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const feedback = await getFeedbackHistory();

      return {
        hasUpdate: !!(await getUpdateNotification()).newUpdate,
        feedback,
        errorReportsNudgedAt: await getErrorReportsNudgedAt(),
        sessionKind: await getSessionNotification(),
      };
    },
    staleTime: Infinity,
    networkMode: "always",
  });

  const isDue = (kind: NotificationKind) => {
    if (!data) {
      return false;
    }

    if (kind === "update") {
      return showUpdates && data.hasUpdate;
    }

    if (kind === "errorReports") {
      return isErrorReportsNudgeDue({
        nudgedAt: data.errorReportsNudgedAt,
        firstSeenAt: data.feedback.firstSeenAt,
        isEnabled: isErrorReportingOn,
      });
    }

    return isFeedbackDue(data.feedback, feedbackFrequency);
  };

  const getKind = () => {
    if (data?.sessionKind) {
      return isDue(data.sessionKind) ? data.sessionKind : null;
    }

    return PRIORITY.find(isDue) ?? null;
  };

  const kind = getKind();

  // The first one to show is the one for the rest of the session.
  useEffect(() => {
    if (kind && data && !data.sessionKind) {
      void setSessionNotification(kind);
      queryClient.setQueryData(queryKey, { ...data, sessionKind: kind });
    }
  }, [kind, data, queryClient]);

  const onHide = () => {
    if (!data || !kind) {
      return;
    }

    const now = Date.now();

    queryClient.setQueryData(queryKey, {
      ...data,
      hasUpdate: kind === "update" ? false : data.hasUpdate,
      errorReportsNudgedAt:
        kind === "errorReports" ? now : data.errorReportsNudgedAt,
      feedback:
        kind === "feedback"
          ? { ...data.feedback, askedAt: now }
          : data.feedback,
    });

    if (kind === "update") {
      setUpdateNotification(false);
    } else if (kind === "errorReports") {
      void setErrorReportsNudged();
    } else {
      void setFeedbackAsked();
    }
  };

  return { kind, onHide };
};
