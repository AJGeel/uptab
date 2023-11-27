import { cn } from "@src/utils";
import InfoWidget from "../InfoWidget";
import { SidebarExpandButton } from "./SidebarExpandButton";
import Shortlinks from "../Shortlinks/Shortlinks";

export type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => (
  <div
    className={cn(
      `relative bg-white flex-1 max-w-[600px] p-6 duration-500 z-10`,
      isExpanded ? "ml-0" : "-ml-[600px]"
    )}
  >
    <SidebarExpandButton
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
    <InfoWidget className={isExpanded ? "" : "opacity-0"} />
    <Shortlinks />
  </div>
);

export default Sidebar;
