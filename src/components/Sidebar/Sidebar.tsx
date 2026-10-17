import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { cn } from "@/src/utils";

import { SidebarExpandButton } from "./partials/SidebarExpandButton";
import Bookmarks from "../Bookmarks/Bookmarks";
import InfoWidget from "../InfoWidget/InfoWidget";
import Shortlinks from "../Shortlinks/Shortlinks";
import Button, { buttonVariants } from "../ui/Button";
import FeedbackPrompt from "../ui/FeedbackPrompt";
import UpdateNotification from "../UpdateNotification/UpdateNotification";

export type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => {
  const { data: settings } = useSettings();
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 z-20 h-screen w-full max-w-150 flex-1 bg-white duration-500",
        isExpanded ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <SidebarExpandButton
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <div className="flex h-full flex-col overflow-y-auto p-6">
        {settings?.sidebar.showUpdates && <UpdateNotification />}
        {settings?.sidebar.showInfoWidget && <InfoWidget />}
        {settings?.sidebar.showShortlinks && <Shortlinks />}
        {settings?.sidebar.showBookmarks && <Bookmarks />}
        <div className="mt-auto flex items-center gap-2 pt-6 first:mt-0">
          <Button
            className="leading-normal first:mt-0"
            variant={buttonVariants.inline}
            onClick={() => setActiveModal(Modals.settings)}
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
