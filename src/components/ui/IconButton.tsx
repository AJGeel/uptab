import { ComponentProps } from "react";

import { cn } from "@/src/utils";

type Props = ComponentProps<"button"> & { hideBorder?: true };

const IconButton = ({ className, children, hideBorder, ...props }: Props) => (
  <button
    className={cn(
      "rounded-xl border bg-white p-2 shadow-sm ring-sky-500 duration-300 focus-within:outline-hidden hover:ring-3 active:scale-90 active:ring-sky-500/0",
      hideBorder && "border-none shadow-none",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
