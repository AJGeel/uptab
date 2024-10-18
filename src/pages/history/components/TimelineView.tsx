import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

import { generateHourArray } from "@/src/services/history/generateHourArray";
import { cn } from "@/src/utils";

type TimelineViewProps = {
  /**
   * @TODO activeDay is currently not used, but may be in the future.
   */
  activeDay?: string;
  activeHour?: string;
  availableHours: string[];
};

const allHours = generateHourArray();

const HourIndicator = ({
  hour,
  isAvailable,
  isActive,
}: {
  hour: string;
  isAvailable: boolean;
  isActive: boolean;
}) => (
  <button
    className={cn(
      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs duration-150 text-black/30",
      isAvailable &&
        "bg-gray-50 border border-black/5 text-black hover:bg-black hover:text-white",
      isActive && "bg-black text-white font-medium"
    )}
    onClick={() => {
      alert(`To do: navigate to hour ${hour}`);
    }}
    disabled={!isAvailable}
    key={hour}
  >
    {hour}
  </button>
);

const TimelineView = ({ activeHour, availableHours }: TimelineViewProps) => (
  <div className="flex w-full items-center justify-center gap-1 overflow-x-auto">
    <MoonIcon className="mr-auto size-4 shrink-0 text-gray-600" />
    {allHours.map((hour) => (
      <HourIndicator
        key={hour}
        hour={hour}
        isActive={hour === activeHour}
        isAvailable={availableHours.includes(hour)}
      />
    ))}
    <SunIcon className="ml-auto size-4 shrink-0 text-gray-600" />
  </div>
);

export default TimelineView;
