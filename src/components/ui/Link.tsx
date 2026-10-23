import { ComponentProps } from "react";

import { cn } from "@/src/utils";

type Props = ComponentProps<"a"> & { href: string };

const Link = ({ className, children, ...props }: Props) => (
  <a
    {...props}
    className={cn(
      "duration-150 hover:text-sky-800 active:scale-90 active:opacity-60",
      className,
    )}
  >
    {children}
  </a>
);

export default Link;
