import { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/src/utils";

import Tooltip from "./Tooltip";

type Props = PropsWithChildren<{
  /** `inline` sits in a sentence; `sm` and `lg` are standalone keys. */
  size?: "inline" | "sm" | "lg";
  /** Tells, after a moment's hover, that this is a key to press. */
  hint?: boolean;
}>;

const sizes = {
  inline:
    "mx-0.5 -my-1 inline-block min-w-[1.75em] rounded-md border-b-2 px-1.5 py-0.5 text-center align-baseline text-[0.8em] leading-none",
  sm: "flex w-10 items-center justify-center rounded-xl border-b-4 py-1.5 text-sm",
  lg: "flex min-w-14 items-center justify-center rounded-2xl border-b-4 px-3 py-2 text-xl",
} as const;

/** The key as text, when that's all the children are. */
const getKeyName = (children: ReactNode) => {
  if (typeof children === "string") {
    return children;
  }

  return Array.isArray(children) && children.every((c) => typeof c === "string")
    ? children.join("")
    : "";
};

/** A keyboard key. */
const Kbd = ({ size = "inline", hint = true, children }: Props) => {
  const key = getKeyName(children);

  const kbd = (
    <kbd
      className={cn(
        "border border-sky-900/30 bg-white font-mono font-bold text-sky-600 shadow-xs",
        sizes[size],
      )}
    >
      {children}
    </kbd>
  );

  return hint && key ? <Tooltip label={`Press ${key}`}>{kbd}</Tooltip> : kbd;
};

export default Kbd;
