import { TrashIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

import { cn } from "@/src/utils";

import IconButton from "../../../ui/IconButton";

type Props = {
  label: string;
  /** Shown before the label. */
  icon?: ReactNode;
  isActive: boolean;
  onSelect: () => void;
  /** Shown under the label, as part of the same item. */
  details?: ReactNode;
  /** Without this, the row can't be deleted: it's GPS. */
  onDelete?: () => void;
};

const LocationRow = ({
  label,
  icon,
  isActive,
  onSelect,
  details,
  onDelete,
}: Props) => (
  <div
    className="group flex cursor-pointer items-center gap-3 border-b border-b-black/10 py-3 last:border-b-0"
    onClick={onSelect}
  >
    <button
      role="radio"
      aria-checked={isActive}
      aria-label={`Use ${label}`}
      className={cn(
        "mt-0.5 size-5 shrink-0 rounded-full border-2 ring-sky-500 duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
        isActive
          ? "border-sky-500 bg-sky-500 shadow-[inset_0_0_0_3px_white]"
          : "border-gray-300 hover:border-sky-500",
      )}
    />

    <div className="grow space-y-2">
      <p className="flex items-center gap-1.5 font-semibold duration-150 group-hover:text-sky-800">
        {label}
        {icon}
      </p>

      {details && (
        <div className="cursor-default" onClick={(e) => e.stopPropagation()}>
          {details}
        </div>
      )}
    </div>

    {onDelete && (
      <IconButton
        hideBorder
        aria-label={`Delete ${label}`}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <TrashIcon className="size-4" />
      </IconButton>
    )}
  </div>
);

export default LocationRow;
