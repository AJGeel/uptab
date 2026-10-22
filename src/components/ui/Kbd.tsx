import { PropsWithChildren } from "react";

import { cn } from "@/src/utils";

type Props = PropsWithChildren<{
  /** `inline` sits in a sentence; `sm` and `lg` are standalone keys. */
  size?: "inline" | "sm" | "lg";
}>;

const sizes = {
  inline:
    "mx-0.5 -my-1 inline-block min-w-[1.75em] rounded-md border-b-2 px-1.5 py-0.5 text-center align-baseline text-[0.8em] leading-none",
  sm: "flex w-10 items-center justify-center rounded-xl border-b-4 py-1.5 text-sm",
  lg: "flex min-w-14 items-center justify-center rounded-2xl border-b-4 px-3 py-2 text-xl",
} as const;

/** A keyboard key. */
const Kbd = ({ size = "inline", children }: Props) => (
  <kbd
    className={cn(
      "border border-sky-900/30 bg-white font-mono font-bold text-sky-600 shadow-xs",
      sizes[size],
    )}
  >
    {children}
  </kbd>
);

export default Kbd;
