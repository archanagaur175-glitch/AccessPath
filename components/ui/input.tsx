import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-2xl border border-zinc-300 bg-white/70 px-4 text-sm text-zinc-900",
        "placeholder:text-zinc-400 transition-all duration-200",
        "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
        "dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500",
        "dark:focus:border-brand-400 dark:focus:ring-brand-400/30",
        invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
