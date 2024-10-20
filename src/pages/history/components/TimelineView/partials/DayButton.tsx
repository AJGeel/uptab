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
        "flex w-20 flex-col items-center rounded-md bg-gray-50 px-2 py-1 border border-gray-200 duration-150 hover:border-black hover:bg-black hover:text-white focus-visible:ring-2 ring-offset-2 ring-gray-300 outline-none",
        isActive && "bg-black text-white border-black"
      )}
    >
      <p className="text-[12px] font-semibold capitalize">{title}</p>
      <p className="text-[10px]">{format(date, "MMM d")}</p>
    </button>
  );
};

export default DayButton;
