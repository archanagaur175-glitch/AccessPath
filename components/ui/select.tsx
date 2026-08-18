"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    const id = useId();
    return (
      <div className="relative">
        <select
          ref={ref}
          id={props.id ?? id}
          className={cn(
            "h-11 w-full appearance-none rounded-2xl border border-zinc-300 bg-white/70 px-4 pr-10 text-sm text-zinc-900",
            "transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            "dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
      </div>
    );
  }
);
Select.displayName = "Select";
