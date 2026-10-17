import { ReactNode } from "react";

import { cn } from "@/src/utils";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

const Link = ({ href, className, children }: Props) => (
  <a
    href={href}
    className={cn(
      "duration-150 hover:text-sky-800 active:scale-90 active:opacity-60",
      className,
    )}
  >
    {children}
  </a>
);

export default Link;
