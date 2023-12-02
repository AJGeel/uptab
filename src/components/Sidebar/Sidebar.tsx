import { cn } from "@src/utils";
import InfoWidget from "../InfoWidget";
import { SidebarExpandButton } from "./SidebarExpandButton";
import Shortlinks from "../Shortlinks/Shortlinks";
import Bookmarks from "../Bookmarks/Bookmarks";

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
    <div className="p-6 h-full overflow-y-auto">
      <InfoWidget className={isExpanded ? "" : "opacity-0"} />
      <Shortlinks />
      <Bookmarks />
    </div>
  </div>
);

export default Sidebar;
