import { ReactNode } from "react";

import { cn } from "@/src/utils";

type Option = {
  value: string;
  label: string;
  /** Shown instead of the label, which is then only for screen readers and the tooltip. */
  icon?: ReactNode;
};

type Props = {
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
  /** Tighter, for crowded places. */
  compact?: boolean;
  disabled?: boolean;
  className?: string;
};

/** A handful of choices, all in view, one of them chosen. */
const SegmentedControl = ({
  value,
  options,
  onValueChange,
  ariaLabel,
  compact,
  disabled,
  className,
}: Props) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className={cn(
      "flex shrink-0 gap-1 rounded-xl bg-black/5 p-1",
      compact && "gap-0.5 p-0.5",
      className,
    )}
  >
    {options.map((option) => {
      const isActive = option.value === value;

      return (
        <button
          key={option.value}
          role="radio"
          aria-checked={isActive}
          aria-label={option.icon ? option.label : undefined}
          title={option.icon ? option.label : undefined}
          disabled={disabled}
          onClick={() => onValueChange(option.value)}
          className={cn(
            disabled && "pointer-events-none",
            compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
            "rounded-lg font-medium whitespace-nowrap ring-sky-500 duration-150 focus-visible:ring-2 focus-visible:outline-hidden active:scale-95",
            isActive
              ? cn(
                  "bg-surface shadow-xs outline-1 outline-black/5 outline-solid",
                  option.icon ? "text-sky-500" : "text-black",
                )
              : option.icon
                ? "text-gray-300 hover:text-gray-500"
                : "text-gray-600 hover:text-black",
          )}
        >
          {option.icon ?? option.label}
        </button>
      );
    })}
  </div>
);

export default SegmentedControl;
