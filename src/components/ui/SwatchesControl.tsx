import { CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/src/utils";

import Tooltip from "./Tooltip";

type Swatch = {
  value: string;
  label: string;
  color: string;
  /** For the check mark, where white wouldn't show on the colour. */
  checkColor?: string;
};

type Props = {
  value: string;
  swatches: Swatch[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
};

/** Colours to choose from, one chosen. */
const SwatchesControl = ({
  value,
  swatches,
  onValueChange,
  ariaLabel,
}: Props) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className="flex shrink-0 gap-1.5"
  >
    {swatches.map((swatch) => {
      const isActive = swatch.value === value;

      return (
        <Tooltip key={swatch.value} label={swatch.label} delay={150}>
          <button
            role="radio"
            aria-checked={isActive}
            aria-label={swatch.label}
            onClick={() => onValueChange(swatch.value)}
            style={{ background: swatch.color, color: swatch.checkColor }}
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-white ring-gray-900/60 ring-offset-2 duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:outline-hidden active:scale-95",
              isActive && "ring-2",
              // A gradient is the rainbow, which turns slowly.
              swatch.color.includes("gradient") &&
                "motion-safe:animate-swatch-spin",
            )}
          >
            {isActive && <CheckIcon weight="bold" className="size-3" />}
          </button>
        </Tooltip>
      );
    })}
  </div>
);

export default SwatchesControl;
