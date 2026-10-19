import { CheckCircleIcon } from "@heroicons/react/24/solid";

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
};

const ThemeCard = ({
  name,
  count,
  covers,
  isSelected,
  isLocked,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-pressed={isSelected}
    title={isLocked ? "At least one theme stays on" : undefined}
    onClick={isLocked ? undefined : onClick}
    className={cn(
      "group flex flex-col overflow-hidden rounded-xl border bg-white text-left ring-sky-500 duration-150 focus-visible:ring-2 focus-visible:outline-hidden",
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
      <p className="text-sm text-gray-700">
        {count} {count === 1 ? "photo" : "photos"}
      </p>
    </div>
  </button>
);

export default ThemeCard;
