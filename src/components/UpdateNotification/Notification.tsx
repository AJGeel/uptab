import { useNotification } from "@/src/hooks/useNotification";
import { FeedbackFrequency } from "@/src/services/settings/types";

import ErrorReportsNotification from "./ErrorReportsNotification";
import FeedbackNotification from "./FeedbackNotification";
import UpdateNotification, { NotificationVariant } from "./UpdateNotification";

type Props = {
  variant?: NotificationVariant;
  showUpdates: boolean;
  feedbackFrequency: FeedbackFrequency;
  isErrorReportingOn: boolean;
};

/** An update, an error reports nudge or a feedback ask: one per browser session. */
const Notification = ({
  variant,
  showUpdates,
  feedbackFrequency,
  isErrorReportingOn,
}: Props) => {
  const { kind, onHide } = useNotification({
    showUpdates,
    feedbackFrequency,
    isErrorReportingOn,
  });

  if (kind === "update" && showUpdates) {
    return <UpdateNotification variant={variant} onHide={onHide} />;
  }

  if (kind === "errorReports") {
    return <ErrorReportsNotification variant={variant} onHide={onHide} />;
  }

  if (kind === "feedback") {
    return <FeedbackNotification variant={variant} onHide={onHide} />;
  }

  return null;
};

export default Notification;
