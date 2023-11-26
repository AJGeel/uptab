import { cn } from "@src/utils";
import { ReactNode } from "react";

type Props = {
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

const IconButton = ({ className, onClick, children }: Props) => (
  <button
    className={cn(
      "rounded-full p-2 bg-white shadow duration-300 hover:ring ring-sky-500 active:ring-sky-500/0 active:scale-90 border",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default IconButton;
