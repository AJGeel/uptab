import { ButtonHTMLAttributes } from "react";

import { cn } from "@/src/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  className?: string;
  variant?: (typeof buttonVariants)[keyof typeof buttonVariants];
};

export const buttonVariants = {
  primary: "primary",
  secondary: "secondary",
} as const;

const Button = ({
  label,
  onClick,
  className,
  variant = buttonVariants.primary,
}: ButtonProps) => (
  <button
    className={cn(
      variant === buttonVariants.primary &&
        "bg-sky-500 text-white hover:brightness-110 active:brightness-100",
      variant === buttonVariants.secondary &&
        "bg-white hover:bg-gray-100 active:bg-gray-200",
      "inline-flex items-center justify-center rounded px-4 py-3 font-medium leading-none ring-offset-2 duration-150 focus:outline-none focus:ring-2 active:ring-2 ring-sky-500",
      className
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;
