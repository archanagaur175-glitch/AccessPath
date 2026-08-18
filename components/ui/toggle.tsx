"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onCheckedChange, label, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        checked ? "bg-brand-500" : "bg-zinc-300 dark:bg-white/15",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
);
Toggle.displayName = "Toggle";
