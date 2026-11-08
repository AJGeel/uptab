import { useNotification } from "@/src/hooks/useNotification";
import { FeedbackFrequency } from "@/src/services/settings/types";

import FeedbackNotification from "./FeedbackNotification";
import UpdateNotification, { NotificationVariant } from "./UpdateNotification";

type Props = {
  variant?: NotificationVariant;
  showUpdates: boolean;
  feedbackFrequency: FeedbackFrequency;
};

/** An update, or else a feedback ask: never both in one tab. */
const Notification = ({ variant, showUpdates, feedbackFrequency }: Props) => {
  const { kind, onHide } = useNotification({ showUpdates, feedbackFrequency });

  if (kind === "update" && showUpdates) {
    return <UpdateNotification variant={variant} onHide={onHide} />;
  }

  if (kind === "feedback") {
    return <FeedbackNotification variant={variant} onHide={onHide} />;
  }

  return null;
};

export default Notification;
