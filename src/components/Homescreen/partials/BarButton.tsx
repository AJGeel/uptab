import { ButtonHTMLAttributes } from "react";

import useLongHover from "@/src/hooks/useLongHover";
import { cn } from "@/src/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Shown above the button after a long hover. */
  tooltip: string;
};

/** A button in the homescreen's bottom bar, with a tooltip on long hover. */
const BarButton = ({ tooltip, className, children, ...props }: Props) => {
  const { isLongHovering, hoverProps } = useLongHover();

  return (
    <button
      type="button"
      {...props}
      {...hoverProps}
      className={cn(
        "relative rounded-xl p-2 duration-150 hover:bg-white/15",
        className,
      )}
    >
      {children}
      {/* Visual hint only, so the button keeps its own accessible name. */}
      <span
        aria-hidden
        className={cn(
          // Resets the bar's white, shadowed text, which would be unreadable here.
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-sm border border-sky-900/10 bg-white px-2 py-1.5 text-xs whitespace-nowrap text-black opacity-0 shadow-sm duration-200 text-shadow-none",
          isLongHovering && "opacity-100",
        )}
      >
        {tooltip}
      </span>
    </button>
  );
};

export default BarButton;
