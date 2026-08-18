import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export const buttonVariants = (opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) => {
  const { variant = "primary", size = "md", className } = opts ?? {};
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium",
    "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-gradient-brand text-white shadow-glow-brand hover:opacity-90 hover:shadow-brand-500/40 active:scale-[0.98]":
        variant === "primary",
      "bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 dark:text-brand-300 active:scale-[0.98]":
        variant === "secondary",
      "border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10 active:scale-[0.98]":
        variant === "outline",
      "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white active:scale-[0.98]":
        variant === "ghost",
      "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]":
        variant === "destructive",
      "glass text-zinc-800 hover:bg-white/80 dark:text-zinc-100 active:scale-[0.98]":
        variant === "glass",
    },
    {
      "h-9 px-4 text-sm": size === "sm",
      "h-10 px-5 text-sm": size === "md",
      "h-12 px-6 text-base": size === "lg",
      "h-9 w-9": size === "icon",
    },
    className
  );
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);

Button.displayName = "Button";
