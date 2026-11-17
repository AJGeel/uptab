/** TEMPORARY: buttons to force the calendar widget into each of its states. */
import { useCalendarDebugStore } from "@/src/hooks/stores/useCalendarDebugStore";
import { DEBUG_STATES } from "@/src/services/calendar/debugView";
import { cn } from "@/src/utils";

const CalendarDebugPanel = () => {
  const { state, setState } = useCalendarDebugStore();

  return (
    <div className="fixed bottom-3 left-1/2 z-30 flex max-w-[90vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl bg-surface/90 p-1.5 text-xs text-black shadow-lg backdrop-blur-lg">
      <span className="px-2 font-semibold">Calendar debug</span>
      {[null, ...DEBUG_STATES].map((option) => (
        <button
          key={option ?? "live"}
          className={cn(
            "rounded-lg px-2 py-1 duration-150 hover:bg-black/5 active:scale-95",
            state === option && "bg-black/10 font-semibold",
          )}
          onClick={() => setState(option)}
        >
          {option ?? "live"}
        </button>
      ))}
    </div>
  );
};

export default CalendarDebugPanel;
