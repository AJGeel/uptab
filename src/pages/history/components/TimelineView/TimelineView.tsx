import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { isSameDay, isToday, subDays } from "date-fns";
import { useMemo, useState } from "react";

import { generateDayArray } from "@/src/services/history/generateDayArray";
import { generateHourArray } from "@/src/services/history/generateHourArray";

import DayButton from "./partials/DayButton";
import HourIndicator from "./partials/HourIndicator";
import PaginationButton from "./partials/PaginationButton";

type TimelineViewProps = {
  activeDay?: string;
  activeHour?: string;
  availableHours: string[];
};

const allHours = generateHourArray();
const today = new Date();

const TimelineView = ({
  activeHour,
  activeDay,
  availableHours,
}: TimelineViewProps) => {
  const [rangeStart, setRangeStart] = useState<Date>(today);
  const range = useMemo(() => generateDayArray(rangeStart), [rangeStart]);

  return (
    <>
      <div className="flex items-stretch justify-between gap-6">
        <PaginationButton
          icon="left"
          onClick={() => {
            const newDate = subDays(rangeStart, -1);
            setRangeStart(newDate);
          }}
          isDisabled={isToday(rangeStart)}
        />
        <div className="flex items-center gap-2">
          {range.map((day) => (
            <DayButton
              key={String(day)}
              date={day}
              onClick={() => alert(`TODO: Navigate to ${String(day)}`)}
              isActive={isSameDay(day, activeDay || "")}
            />
          ))}
        </div>
        <PaginationButton
          icon="right"
          onClick={() => {
            const newDate = subDays(rangeStart, 1);

            setRangeStart(newDate);
          }}
        />
      </div>
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
    </>
  );
};

export default TimelineView;
