import { CaretRightIcon } from "@phosphor-icons/react";

import { cn } from "@/src/utils";

import IconButton from "../../ui/IconButton";
import { Props } from "../Sidebar";

export const SidebarExpandButton = ({ isExpanded, setIsExpanded }: Props) => (
  <IconButton
    data-setting="sidebar.isOpen"
    className={cn(
      "group absolute top-7 mr-6 sm:mr-0",
      isExpanded ? "-right-4" : "-right-14",
    )}
    onClick={() => {
      setIsExpanded(!isExpanded);
    }}
  >
    <CaretRightIcon
      weight="bold"
      className={cn(
        "size-4 duration-300 group-hover:text-sky-500",
        isExpanded ? "rotate-180" : "",
      )}
    />
  </IconButton>
);
