import { ChevronRightIcon } from "@heroicons/react/24/solid";
import cn from "@src/utils/cn";
import InfoWidget from "./InfoWidget";

type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => (
  <div
    className={cn(
      `relative bg-white flex-1 max-w-[600px] p-6 duration-500 z-10`,
      isExpanded ? "ml-0" : `-ml-[600px]`
    )}
  >
    <button
      className={cn(
        "absolute top-7 border rounded-full p-2 bg-white shadow duration-500",
        isExpanded ? "-right-4" : "-right-14"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <ChevronRightIcon
        className={cn("w-4 h-4 duration-500", isExpanded ? "rotate-180" : "")}
      />
    </button>
    <InfoWidget className={isExpanded ? "" : "opacity-0"} />
  </div>
);

export default Sidebar;
