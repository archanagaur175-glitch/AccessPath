"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CollegeCategory } from "@/lib/supabase/types";
import { CATEGORY_META } from "@/lib/matching/meta";

interface DistributionDonutProps {
  counts: Record<CollegeCategory, number>;
  total: number;
}

export function DistributionDonut({ counts, total }: DistributionDonutProps) {
  const data = (["reach", "target", "safety"] as CollegeCategory[]).map((category) => ({
    name: CATEGORY_META[category].label,
    category,
    value: counts[category],
  }));

  if (total === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>Build your profile to see your list distribution.</p>
      </div>
    );
  }

  return (
    <div className="flex h-64 flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={82}
            paddingAngle={2}
            strokeWidth={2}
            animationDuration={700}
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_META[entry.category].color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(99,102,241,0.25)",
              background: "rgba(255,255,255,0.92)",
              color: "#18181b",
            }}
            formatter={(value, name) => {
              const count = typeof value === "number" ? value : Number(value);
              return [
                `${count} schools · ${total > 0 ? Math.round((count / total) * 100) : 0}%`,
                name,
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-2 flex items-center justify-center gap-5 text-sm">
        {data.map((entry) => (
          <span
            key={entry.category}
            className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_META[entry.category].color }}
              aria-hidden
            />
            {entry.name} · {entry.value}
          </span>
        ))}
      </div>
    </div>
  );
}
