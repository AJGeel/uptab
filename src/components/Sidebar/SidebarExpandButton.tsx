import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { cn } from "@/src/utils";

import { Props } from "./Sidebar";
import IconButton from "../ui/IconButton";

export const SidebarExpandButton = ({ isExpanded, setIsExpanded }: Props) => (
  <IconButton
    className={cn(
      "absolute top-7 group mr-6 sm:mr-0",
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
);
