import { BugBeetleIcon, XIcon } from "@phosphor-icons/react";

import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { cn } from "@/src/utils";

import { NotificationVariant, notificationStyles } from "./UpdateNotification";

type Props = {
  variant?: NotificationVariant;
  onHide: () => void;
};

/**
 * Looks like the feedback ask. Clicking it opens the error reports switch and
 * leaves the nudge up: only Close ends it, for good.
 */
const ErrorReportsNotification = ({ variant = "sidebar", onHide }: Props) => {
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-2xl p-2 pl-4 duration-150",
        notificationStyles[variant],
      )}
    >
      <button
        className="flex grow items-center gap-2 rounded-xl py-2 text-left ring-sky-500 focus-visible:ring-2 focus-visible:outline-hidden"
        onClick={() => openSettingsSection("appearance", "errorReports")}
      >
        <BugBeetleIcon weight="duotone" className="size-5 shrink-0" />
        Help me fix bugs! Want to send error reports?
      </button>
      <button
        className="flex items-center gap-1 rounded-xl px-3 py-2 duration-150 hover:bg-sky-800/10 hover:text-sky-800 dark:hover:bg-sky-500/25 dark:hover:text-sky-300"
        onClick={onHide}
      >
        Close
        <XIcon className="size-4" />
      </button>
    </div>
  );
};

export default ErrorReportsNotification;
