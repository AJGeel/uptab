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
  inline: "inline",
} as const;

const buttonStyles = {
  primary:
    "bg-sky-500 text-white hover:brightness-110 active:brightness-100 px-4 py-3",
  secondary: "bg-transparent hover:bg-black/5 active:bg-gray-200 px-4 py-3",
  inline:
    "underline text-black/70 font-normal hover:text-black hover:no-underline duration-0 rounded-xs",
};

const Button = ({
  label,
  onClick,
  className,
  variant = buttonVariants.primary,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center rounded-xl leading-none font-medium ring-sky-500 duration-150 focus:ring-2 focus:ring-offset-2 focus:outline-hidden active:ring-2 active:ring-offset-2",
      variant === buttonVariants.primary && buttonStyles.primary,
      variant === buttonVariants.secondary && buttonStyles.secondary,
      variant === buttonVariants.inline && buttonStyles.inline,
      className,
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;
