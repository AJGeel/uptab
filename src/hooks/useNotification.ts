import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getFeedbackHistory,
  isFeedbackDue,
  setFeedbackAsked,
} from "@/src/services/feedbackPrompt/feedbackSchedule";
import { FeedbackFrequency } from "@/src/services/settings/types";
import { getUpdateNotification } from "@/src/services/updateNotification/getUpdateNotification";
import { setUpdateNotification } from "@/src/services/updateNotification/setUpdateNotification";

type Options = {
  showUpdates: boolean;
  feedbackFrequency: FeedbackFrequency;
};

const queryKey = ["notification"];

/**
 * The one notification this tab shows: an update, or else a feedback ask. What's
 * pending is read once, so closing one doesn't bring up the other in the same tab.
 */
export const useNotification = ({
  showUpdates,
  feedbackFrequency,
}: Options) => {
  const queryClient = useQueryClient();

  // Shared, so hiding the notification in one place hides it everywhere.
  const { data } = useQuery({
    queryKey,
    queryFn: async () => ({
      hasUpdate: !!(await getUpdateNotification()).newUpdate,
      feedback: await getFeedbackHistory(),
    }),
    staleTime: Infinity,
    networkMode: "always",
  });

  const kind =
    showUpdates && data?.hasUpdate
      ? "update"
      : data && isFeedbackDue(data.feedback, feedbackFrequency)
        ? "feedback"
        : null;

  const onHide = () => {
    queryClient.setQueryData(queryKey, {
      hasUpdate: false,
      feedback: { ...data?.feedback, askedAt: Date.now() },
    });

    if (kind === "update") {
      setUpdateNotification(false);
    } else if (kind === "feedback") {
      setFeedbackAsked();
    }
  };

  return { kind, onHide };
};
