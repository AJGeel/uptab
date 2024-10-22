import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { cn } from "@/src/utils";

type PaginationButtonProps = {
  icon: "left" | "right";
  onClick: () => void;
  isDisabled?: boolean;
};

const PaginationButton = ({
  icon,
  onClick,
  isDisabled,
}: PaginationButtonProps) => (
  <button
    className={cn(
      "rounded-md border bg-gray-50 px-1.5 py-2 text-gray-600 duration-150 focus-visible:ring-2 ring-offset-2 ring-gray-300 outline-none",
      isDisabled && "opacity-50",
      !isDisabled && "hover:bg-black hover:text-white"
    )}
    disabled={isDisabled}
    onClick={onClick}
  >
    {icon === "left" ? (
      <ChevronLeftIcon className="size-3" />
    ) : (
      <ChevronRightIcon className="size-3" />
    )}
  </button>
);

export default PaginationButton;
