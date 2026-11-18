import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { MIN_RETRY_MS } from "@/src/hooks/queries/useLocationAndWeather";
import { cn } from "@/src/utils";
import { delay } from "@/src/utils/delay";

import Tooltip from "../../ui/Tooltip";

type Props = { onRefresh: () => Promise<unknown> };

const IDLE_LABEL = "Refresh (updates itself every hour)";

const BUSY_LABELS = [
  "Asking Google nicely…",
  "Shaking the calendar…",
  "Fetching your whole year, sorry…",
  "Counting your meetings…",
  "Dusting off the agenda…",
  "Checking what you forgot…",
  "Looking for free time…",
  "Reading 1 MB so you don't have to…",
];

const pickBusyLabel = () =>
  BUSY_LABELS[Math.floor(Math.random() * BUSY_LABELS.length)];

/** Fetches the calendar again now, rather than at the next hourly refresh. */
const RefreshButton = ({ onRefresh }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyLabel, setBusyLabel] = useState(BUSY_LABELS[0]);

  const refresh = async () => {
    // Not disabled while busy, as that would close the tooltip that's showing the copy.
    if (isRefreshing) {
      return;
    }

    setBusyLabel(pickBusyLabel());
    setIsRefreshing(true);
    await Promise.all([onRefresh(), delay(MIN_RETRY_MS)]);
    setIsRefreshing(false);
  };

  return (
    <Tooltip label={isRefreshing ? busyLabel : IDLE_LABEL} side="bottom">
      <button
        aria-label="Refresh"
        aria-disabled={isRefreshing}
        className="group rounded-lg p-1.5 text-gray-700 duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-sky-500 active:scale-90"
        onClick={refresh}
      >
        <ArrowClockwiseIcon
          className={cn(
            "size-5",
            isRefreshing
              ? // Holds the hover's half turn and spins from there, so nothing jumps.
                "rotate-180 animate-spin"
              : // A playful half turn on hover, with a little overshoot.
                "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 motion-reduce:transition-none",
          )}
        />
      </button>
    </Tooltip>
  );
};

export default RefreshButton;
