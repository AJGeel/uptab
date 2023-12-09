import { cn } from "@/src/utils";

import { SidebarExpandButton } from "./SidebarExpandButton";
import Bookmarks from "../Bookmarks/Bookmarks";
import InfoWidget from "../InfoWidget";
import Shortlinks from "../Shortlinks/Shortlinks";

export type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => (
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
      <InfoWidget className={isExpanded ? "" : "opacity-0"} />
      <Shortlinks />
      <Bookmarks />
    </div>
  </div>
);

export default Sidebar;
