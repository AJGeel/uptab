import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { cn } from "@src/utils";
import InfoWidget from "./InfoWidget";
import IconButton from "./IconButton";

type Props = {
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
    <IconButton
      className={cn(
        "absolute top-7 group",
        isExpanded ? "-right-4" : "-right-14"
      )}
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
    >
      <ChevronRightIcon
        className={cn(
          "w-4 h-4 group-hover:text-sky-500 duration-300",
          isExpanded ? "rotate-180" : ""
        )}
      />
    </IconButton>
    <InfoWidget className={isExpanded ? "" : "opacity-0"} />
  </div>
);

export default Sidebar;
