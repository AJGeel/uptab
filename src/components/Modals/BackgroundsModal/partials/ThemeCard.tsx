import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { cn } from "@/src/utils";

export type Cover = {
  id: string;
  /** Shown while the thumbnail loads, or if there is none. */
  color: string;
  thumbnailUrl: string | null;
};

type Props = {
  name: string;
  count: number;
  /** Up to 4 photos, shown as a mosaic. */
  covers: Cover[];
  isSelected: boolean;
  /** The last selected theme can't be turned off. */
  isLocked: boolean;
  onClick: () => void;
  /** Shows a "Manage" button on the card. */
  onManage?: () => void;
};

const ThemeCard = ({
  name,
  count,
  covers,
  isSelected,
  isLocked,
  onClick,
  onManage,
}: Props) => {
  // Set when the locked card is clicked: it shakes and says why.
  const [isNudging, setIsNudging] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!isNudging) {
      return;
    }

    const timeout = setTimeout(() => setIsNudging(false), 2000);

    return () => clearTimeout(timeout);
  }, [isNudging]);

  const nudge = () => {
    setIsNudging(true);
    setIsShaking(true);
  };

  return (
    <div
      className={cn("relative flex", isShaking && "animate-shake")}
      onAnimationEnd={() => setIsShaking(false)}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={isLocked ? nudge : onClick}
        className={cn(
          "group flex flex-1 flex-col overflow-hidden rounded-xl border bg-white text-left ring-sky-500 duration-150 focus-visible:ring-2 focus-visible:outline-hidden",
          isSelected
            ? "border-sky-500 ring-1"
            : "border-black/10 opacity-70 hover:opacity-100",
          isLocked && "cursor-default",
        )}
      >
        <div
          className={cn(
            "relative grid h-24 w-full gap-px duration-300 group-hover:scale-105",
            covers.length > 1 && "grid-cols-2",
            covers.length > 2 && "grid-rows-2",
          )}
        >
          {covers.map((cover, i) => (
            <div
              key={cover.id}
              className={cn(
                "bg-cover bg-center",
                covers.length === 3 && i === 0 && "row-span-2",
              )}
              style={{
                backgroundColor: cover.color,
                backgroundImage: cover.thumbnailUrl
                  ? `url("${cover.thumbnailUrl}")`
                  : undefined,
              }}
            />
          ))}
          {isSelected && (
            <CheckCircleIcon className="absolute top-2 right-2 size-6 rounded-full bg-white text-sky-500 shadow-sm" />
          )}
        </div>
        <div className="relative bg-white px-3 py-2">
          <p className="font-semibold">{name}</p>
          <p
            aria-live="polite"
            className={cn(
              "text-sm text-gray-700 duration-150",
              isNudging && "text-sky-600",
            )}
          >
            {isNudging
              ? "Keep one theme on"
              : `${count} ${count === 1 ? "photo" : "photos"}`}
          </p>
        </div>
      </button>
      {onManage && (
        <button
          type="button"
          onClick={onManage}
          className="absolute right-2 bottom-2 rounded-lg px-2 py-1 text-sm font-medium text-sky-600 ring-sky-500 duration-150 hover:bg-sky-50 focus-visible:ring-2 focus-visible:outline-hidden"
        >
          Manage
        </button>
      )}
    </div>
  );
};

export default ThemeCard;
