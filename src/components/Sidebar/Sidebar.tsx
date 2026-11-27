import { useBookmarks } from "@/src/hooks/queries/useBookmarks";
import { useShortlinks } from "@/src/hooks/queries/useShortlinks";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useNotificationData } from "@/src/hooks/useNotification";
import { useSettings } from "@/src/hooks/useSettings";
import { cn } from "@/src/utils";

import { SidebarExpandButton } from "./partials/SidebarExpandButton";
import Bookmarks from "../Bookmarks/Bookmarks";
import InfoWidget from "../InfoWidget/InfoWidget";
import Shortlinks from "../Shortlinks/Shortlinks";
import Button, { buttonVariants } from "../ui/Button";
import FeedbackPrompt from "../ui/FeedbackPrompt";
import Notification from "../UpdateNotification/Notification";

export type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => {
  const { data: settings } = useSettings();
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );

  const { isPending: isNotificationPending } = useNotificationData();
  const { isPending: isShortlinksPending } = useShortlinks(
    !!settings?.sidebar.showShortlinks,
  );
  const { isPending: isBookmarksPending } = useBookmarks(
    !!settings?.sidebar.showBookmarks,
  );

  /*
   * Each of these arrives on its own and would push what's below it down. The
   * column waits for all of them, and then fades in as one. A hidden card
   * isn't fetched, so it isn't waited for.
   */
  const isReady =
    !!settings &&
    !isNotificationPending &&
    !(settings.sidebar.showShortlinks && isShortlinksPending) &&
    !(settings.sidebar.showBookmarks && isBookmarksPending);

  return (
    <div
      data-setting="sidebar.isOpen"
      className={cn(
        "absolute top-0 left-0 z-20 h-screen w-full max-w-150 flex-1 bg-surface duration-500 [--widget-hover:color-mix(in_oklab,var(--color-black)_5%,transparent)]",
        isExpanded ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <SidebarExpandButton
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      {/* Off-screen while collapsed, so it's skipped by the keyboard and screen readers. */}
      <div
        inert={!isExpanded}
        className={cn(
          "flex h-full flex-col overflow-y-auto p-6 transition-opacity duration-200",
          !isReady && "opacity-0",
        )}
      >
        {isReady && (
          <>
            <Notification
              showUpdates={settings.sidebar.showUpdates}
              feedbackFrequency={settings.sidebar.feedbackFrequency}
              isErrorReportingOn={settings.privacy.errorReporting}
            />
            {settings.sidebar.showInfoWidget && (
              <InfoWidget isSidebar settingId="sidebar.showInfoWidget" />
            )}
            {settings.sidebar.showShortlinks && <Shortlinks />}
            {settings.sidebar.showBookmarks && <Bookmarks />}
          </>
        )}
        <div className="mt-auto flex items-center gap-2 pt-6 first:mt-0">
          <Button
            className="leading-normal first:mt-0"
            variant={buttonVariants.inline}
            onClick={() => openSettingsSection("sidebar")}
            label="Edit preferences"
          />
          <p>&middot;</p>
          <Button
            className="leading-normal first:mt-0"
            variant={buttonVariants.inline}
            onClick={() => setActiveModal(Modals.hotkey)}
            label="View hotkeys"
          />
          {settings?.sidebar.showFeedbackPrompt && (
            <>
              <p>&middot;</p>
              <FeedbackPrompt />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
