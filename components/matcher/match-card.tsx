"use client";

import { useState } from "react";
import {
  MapPin,
  DollarSign,
  Percent,
  CalendarDays,
  ChevronDown,
  CircleDot,
} from "lucide-react";
import type { MatchResult } from "@/lib/matching/scoring-engine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StrengthIndexRing } from "@/components/matcher/strength-index-ring";
import { CATEGORY_META } from "@/lib/matching/meta";
import { cn, formatCurrency } from "@/lib/utils";

interface MatchCardProps {
  match: MatchResult;
  selected: boolean;
  onToggleCompare: () => void;
  onAddToTracker?: () => void;
}

export function MatchCard({
  match,
  selected,
  onToggleCompare,
  onAddToTracker,
}: MatchCardProps) {
  const { college, strengthIndex, category, dimensions, rationale } = match;
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[category];

  return (
    <Card
      variant="glass"
      hoverable
      className={cn(
        "flex flex-col p-5",
        selected && "ring-2 ring-brand-500/60 shadow-glow-brand"
      )}
    >
      <div className="flex items-start gap-4">
        <StrengthIndexRing value={strengthIndex} category={category} size={96} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-bold text-zinc-900 dark:text-white">
                {college.name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                {college.location}
              </p>
            </div>
            <Badge variant="category" category={category} className="shrink-0">
              {meta.label}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Percent className="h-3 w-3" aria-hidden />
              Admit {(college.admit_rate * 100).toFixed(1)}%
            </span>
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3 w-3" aria-hidden />
              {formatCurrency(college.tuition_estimate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" aria-hidden />
              {new Date(college.deadline ?? "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {college.description ? (
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {college.description}
        </p>
      ) : null}

      <div className="mt-4 space-y-1.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
          aria-expanded={expanded}
        >
          Why this is a match
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
        </button>
        {expanded ? (
          <ul className="space-y-1.5 pt-1 animate-fade-in">
            {dimensions.map((d) => (
              <li
                key={d.name}
                className="flex gap-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300"
              >
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    d.score >= 0.6
                      ? "bg-safety-500"
                      : d.score >= 0.4
                        ? "bg-target-500"
                        : "bg-reach-500"
                  )}
                  aria-hidden
                />
                <span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    {d.name}:
                  </span>{" "}
                  {d.note}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {rationale[0] ?? "See the full breakdown."}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-4 dark:border-white/10">
        <Button
          type="button"
          variant={selected ? "primary" : "ghost"}
          size="sm"
          onClick={onToggleCompare}
          aria-pressed={selected}
        >
          <CircleDot className="h-3.5 w-3.5" aria-hidden />
          {selected ? "In comparison" : "Compare"}
        </Button>
        {onAddToTracker ? (
          <Button type="button" variant="ghost" size="sm" onClick={onAddToTracker}>
            Add to tracker
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
