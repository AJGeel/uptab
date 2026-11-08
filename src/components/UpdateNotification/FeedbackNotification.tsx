import { ChatCircleDotsIcon, XIcon } from "@phosphor-icons/react";
import { runtime } from "webextension-polyfill";

import { buildFeedbackUrl } from "@/src/services/feedback/feedbackUrl";
import { cn } from "@/src/utils";

import { NotificationVariant, notificationStyles } from "./UpdateNotification";

type Props = {
  variant?: NotificationVariant;
  onHide: () => void;
};

/** Looks like the update notification: a nudge every few months to give feedback. */
const FeedbackNotification = ({ variant = "sidebar", onHide }: Props) => (
  <div
    className={cn(
      "flex w-full items-center gap-2 rounded-2xl p-2 pl-4 duration-150",
      notificationStyles[variant],
    )}
  >
    <a
      className="flex grow items-center gap-2 rounded-xl py-2 text-left ring-sky-500 focus-visible:ring-2 focus-visible:outline-hidden"
      href={buildFeedbackUrl(
        runtime.getManifest().version,
        navigator.userAgent,
      )}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onHide}
    >
      <ChatCircleDotsIcon weight="duotone" className="size-5 shrink-0" />
      Enjoying UpTab? Tell me what you think.
    </a>
    <button
      className="flex items-center gap-1 rounded-xl px-3 py-2 duration-150 hover:bg-sky-800/10 hover:text-sky-800"
      onClick={onHide}
    >
      Close
      <XIcon className="size-4" />
    </button>
  </div>
);

export default FeedbackNotification;
