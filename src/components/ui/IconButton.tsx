import { ComponentProps } from "react";

import { cn } from "@/src/utils";

type Props = ComponentProps<"button"> & { hideBorder?: true };

const IconButton = ({ className, children, hideBorder, ...props }: Props) => (
  <button
    className={cn(
      "rounded-xl p-2 bg-white shadow duration-300 hover:ring ring-sky-500 focus-within:outline-none active:ring-sky-500/0 active:scale-90 border",
      hideBorder && "shadow-none border-none",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
