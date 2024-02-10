import { ComponentProps } from "react";

import { cn } from "@/src/utils";

type Props = ComponentProps<"button">;

const IconButton = ({ className, children, ...props }: Props) => (
  <button
    className={cn(
      "rounded-full p-2 bg-white shadow duration-300 hover:ring ring-sky-500 focus-within:outline-none active:ring-sky-500/0 active:scale-90 border",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
