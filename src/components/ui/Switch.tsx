import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { ComponentProps } from "react";

import { cn } from "@/src/utils";

const Switch = ({
  className,
  ...props
}: ComponentProps<typeof BaseSwitch.Root>) => (
  <BaseSwitch.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 ring-sky-500 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden data-checked:bg-sky-500 data-disabled:cursor-not-allowed data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <BaseSwitch.Thumb className="pointer-events-none block size-5 translate-x-0 rounded-full bg-surface shadow-lg ring-0 transition-transform data-checked:translate-x-5" />
  </BaseSwitch.Root>
);

export { Switch };
