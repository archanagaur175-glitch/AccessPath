"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MatchResult } from "@/lib/matching/scoring-engine";
import { CATEGORY_META } from "@/lib/matching/meta";

interface StrengthTrendChartProps {
  current: MatchResult[];
  adjusted: MatchResult[];
}

/**
 * Shows how the Admission Strength Index shifts for the top 6 schools when the
 * student's profile changes (the "what-if" scenario).
 */
export function StrengthTrendChart({ current, adjusted }: StrengthTrendChartProps) {
  const data = current.slice(0, 6).map((match) => {
    const adjustedMatch = adjusted.find((m) => m.college.id === match.college.id);
    return {
      name: match.college.name.split(" ")[0],
      fullName: match.college.name,
      Current: match.strengthIndex,
      "If profile changes": adjustedMatch?.strengthIndex ?? match.strengthIndex,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.15)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} interval={0} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#71717a" }} />
        <Tooltip
          labelFormatter={(_, payload) =>
            (payload?.[0]?.payload?.fullName as string) ?? ""
          }
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(99,102,241,0.25)",
            background: "rgba(255,255,255,0.92)",
            color: "#18181b",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="Current"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#6366f1" }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="If profile changes"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ r: 3, fill: "#f59e0b" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function categoryAxisColor(category: string): string {
  return CATEGORY_META[category as keyof typeof CATEGORY_META]?.color ?? "#6366f1";
}
