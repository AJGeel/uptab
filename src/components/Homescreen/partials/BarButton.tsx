import { ButtonHTMLAttributes } from "react";

import Tooltip from "@/src/components/ui/Tooltip";
import { cn } from "@/src/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Shown above the button after a long hover. */
  tooltip: string;
};

/** A button in the homescreen's bottom bar, with a tooltip on long hover. */
const BarButton = ({ tooltip, className, children, ...props }: Props) => (
  <Tooltip label={tooltip}>
    <button
      type="button"
      {...props}
      className={cn("rounded-xl p-2 duration-150 hover:bg-white/15", className)}
    >
      {children}
    </button>
  </Tooltip>
);

export default BarButton;
