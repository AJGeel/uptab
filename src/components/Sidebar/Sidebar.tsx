import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { cn } from "@/src/utils";

import { SidebarExpandButton } from "./partials/SidebarExpandButton";
import Bookmarks from "../Bookmarks/Bookmarks";
import InfoWidget from "../InfoWidget/InfoWidget";
import Shortlinks from "../Shortlinks/Shortlinks";
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
        "absolute bg-white flex-1 max-w-[600px] w-full duration-500 z-10 h-screen left-0 top-0",
        isExpanded ? "-translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarExpandButton
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <div className="h-full overflow-y-auto p-6">
        {settings?.sidebar.showUpdates && <UpdateNotification />}
        {settings?.sidebar.showInfoWidget && (
          <InfoWidget className={isExpanded ? "" : "opacity-0"} />
        )}
        {settings?.sidebar.showShortlinks && <Shortlinks />}
        {settings?.sidebar.showBookmarks && <Bookmarks />}
        <button
          className="mt-6 text-left text-black/70 underline hover:text-black hover:no-underline"
          onClick={() => setActiveModal(Modals.settings)}
        >
          Edit preferences
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
