import type { CollegeCategory } from "@/lib/supabase/types";

export const CATEGORY_META: Record<
  CollegeCategory,
  { label: string; color: string; softBg: string; solid: string }
> = {
  reach: {
    label: "Reach",
    color: "#f59e0b",
    softBg: "bg-reach-500/15 text-reach-700 dark:bg-reach-500/25 dark:text-reach-300",
    solid: "bg-reach-500",
  },
  target: {
    label: "Target",
    color: "#3b82f6",
    softBg: "bg-target-500/15 text-target-700 dark:bg-target-500/25 dark:text-target-300",
    solid: "bg-target-500",
  },
  safety: {
    label: "Safety",
    color: "#22c55e",
    softBg: "bg-safety-500/15 text-safety-700 dark:bg-safety-500/25 dark:text-safety-300",
    solid: "bg-safety-500",
  },
};
