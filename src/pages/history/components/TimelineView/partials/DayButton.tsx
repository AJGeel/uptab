import { format, isToday, isYesterday } from "date-fns";

import { cn } from "@/src/utils";

type DayButtonProps = {
  date: Date;
  isActive: boolean;
  onClick: () => void;
};

const DayButton = ({ date, isActive, onClick }: DayButtonProps) => {
  const title = (() => {
    if (isToday(date)) {
      return "today";
    }

    if (isYesterday(date)) {
      return "yesterday";
    }

    return format(date, "EEEE");
  })();

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-20 flex-col items-center rounded-md bg-gray-50 px-2 py-1 outline outline-1 outline-black/10 duration-150 hover:bg-black hover:text-white",
        isActive && "bg-black text-white"
      )}
    >
      <p className="text-[12px] font-semibold capitalize">{title}</p>
      <p className="text-[10px]">{format(date, "MMM d")}</p>
    </button>
  );
};

export default DayButton;
