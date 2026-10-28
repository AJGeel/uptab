import { CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/src/utils";

type Swatch = { value: string; label: string; color: string };

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
  <div role="radiogroup" aria-label={ariaLabel} className="flex shrink-0 gap-2">
    {swatches.map((swatch) => {
      const isActive = swatch.value === value;

      return (
        <button
          key={swatch.value}
          role="radio"
          aria-checked={isActive}
          aria-label={swatch.label}
          title={swatch.label}
          onClick={() => onValueChange(swatch.value)}
          style={{ backgroundColor: swatch.color }}
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-white ring-gray-900/60 ring-offset-2 duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:outline-hidden active:scale-95",
            isActive && "ring-2",
          )}
        >
          {isActive && <CheckIcon weight="bold" className="size-3.5" />}
        </button>
      );
    })}
  </div>
);

export default SwatchesControl;
