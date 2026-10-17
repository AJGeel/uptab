import { cn } from "@/src/utils";

type Props = {
  label: string;
  size?: "sm" | "lg";
};

export const Hotkey = ({ label, size = "sm" }: Props) => (
  <code
    className={cn(
      "flex items-center justify-center border border-b-4 border-sky-900/30 bg-white font-mono font-bold text-sky-600 shadow-xs",
      size === "sm" && "w-10 rounded-xl py-1.5 text-sm",
      size === "lg" && "min-w-14 rounded-2xl px-3 py-2 text-xl",
    )}
  >
    {label}
  </code>
);
