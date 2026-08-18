"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  children?: ReactNode;
  label?: string;
}

const DEFAULT_COLORS = ["#22c55e", "#6366f1", "#f59e0b", "#ef4444"];

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  color,
  trackColor,
  className,
  children,
  label,
}: ProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const safe = clamp(Math.round(value), 0, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(safe));
    return () => cancelAnimationFrame(frame);
  }, [safe]);

  const resolvedColor =
    color ??
    (safe >= 75
      ? DEFAULT_COLORS[0]
      : safe >= 50
        ? DEFAULT_COLORS[1]
        : safe >= 35
          ? DEFAULT_COLORS[2]
          : DEFAULT_COLORS[3]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={label ?? `Strength index ${safe} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "currentColor"}
          strokeOpacity={0.12}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <>
            <span className="font-display text-2xl font-bold tabular-nums">{safe}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              index
            </span>
          </>
        )}
      </div>
    </div>
  );
}
