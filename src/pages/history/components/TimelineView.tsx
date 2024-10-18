import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

import { generateHourArray } from "@/src/services/history/generateHourArray";

import HourIndicator from "./HourIndicator";

type TimelineViewProps = {
  /**
   * @TODO activeDay is currently not used, but may be in the future.
   */
  activeDay?: string;
  activeHour?: string;
  availableHours: string[];
};

const allHours = generateHourArray();

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
