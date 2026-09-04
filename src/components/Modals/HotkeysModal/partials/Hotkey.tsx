import { cn } from "@/src/utils";

type Props = {
  label: string;
  size?: "sm" | "lg";
};

export const Hotkey = ({ label, size = "sm" }: Props) => (
  <code
    className={cn(
      "flex items-center justify-center border border-sky-900/30 border-b-4 bg-white font-mono font-bold text-sky-600 shadow-sm",
      size === "sm" && "w-10 py-1.5 text-sm rounded-xl",
      size === "lg" && "min-w-14 px-3 py-2 text-xl rounded-2xl",
    )}
  >
    {label}
  </code>
);
