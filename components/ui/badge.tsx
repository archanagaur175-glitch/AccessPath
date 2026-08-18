import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { CollegeCategory } from "@/lib/supabase/types";

type BadgeVariant =
  "neutral" | "brand" | "success" | "warning" | "danger" | "outline" | "category";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  category?: CollegeCategory;
}

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300",
  brand: "bg-brand-500/15 text-brand-700 dark:bg-brand-500/25 dark:text-brand-300",
  success: "bg-safety-500/15 text-safety-700 dark:bg-safety-500/25 dark:text-safety-300",
  warning: "bg-reach-500/15 text-reach-700 dark:bg-reach-500/25 dark:text-reach-300",
  danger: "bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300",
  outline: "border border-zinc-300 text-zinc-700 dark:border-white/20 dark:text-zinc-300",
  category: "",
};

const categoryClasses: Record<CollegeCategory, string> = {
  reach: "bg-reach-500/15 text-reach-700 dark:bg-reach-500/25 dark:text-reach-300",
  target: "bg-target-500/15 text-target-700 dark:bg-target-500/25 dark:text-target-300",
  safety: "bg-safety-500/15 text-safety-700 dark:bg-safety-500/25 dark:text-safety-300",
};

export function categoryLabel(category: CollegeCategory): string {
  return category[0].toUpperCase() + category.slice(1);
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", category, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        base,
        variant === "category"
          ? categoryClasses[category ?? "target"]
          : variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
