"use client";

import type { CollegeCategory } from "@/lib/supabase/types";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CATEGORY_META } from "@/lib/matching/meta";

interface StrengthIndexRingProps {
  value: number;
  category: CollegeCategory;
  size?: number;
}

export function StrengthIndexRing({
  value,
  category,
  size = 108,
}: StrengthIndexRingProps) {
  return (
    <ProgressRing
      value={value}
      size={size}
      strokeWidth={9}
      color={CATEGORY_META[category].color}
      label={`Admission strength index ${value} of 100, ${CATEGORY_META[category].label}`}
    />
  );
}
