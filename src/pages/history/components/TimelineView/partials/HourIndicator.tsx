import { cn } from "@/src/utils";

type HourIndicatorProps = {
  hour: string;
  isAvailable: boolean;
  isActive: boolean;
};

const HourIndicator = ({ hour, isAvailable, isActive }: HourIndicatorProps) => (
  <button
    className={cn(
      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs duration-150 text-gray-300",
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

export default HourIndicator;
