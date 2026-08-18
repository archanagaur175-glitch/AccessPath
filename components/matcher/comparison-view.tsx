"use client";

import {
  MapPin,
  Percent,
  DollarSign,
  CalendarDays,
  GraduationCap,
  Star,
} from "lucide-react";
import type { MatchResult } from "@/lib/matching/scoring-engine";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { StrengthIndexRing } from "@/components/matcher/strength-index-ring";
import { CATEGORY_META } from "@/lib/matching/meta";
import { formatCurrency } from "@/lib/utils";

interface ComparisonViewProps {
  open: boolean;
  onClose: () => void;
  matches: MatchResult[];
}

export function ComparisonView({ open, onClose, matches }: ComparisonViewProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compare schools"
      description={`${matches.length} of 3 selected — side by side.`}
      size="xl"
    >
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {matches.map((match) => {
          const meta = CATEGORY_META[match.category];
          return (
            <div
              key={match.college.id}
              className="flex flex-col rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold leading-tight">
                  {match.college.name}
                </h3>
                <Badge variant="category" category={match.category}>
                  {meta.label}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <StrengthIndexRing
                  value={match.strengthIndex}
                  category={match.category}
                  size={72}
                />
                <div className="flex-1 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                    {match.college.location}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Percent
                      className="h-3.5 w-3.5 shrink-0 text-brand-500"
                      aria-hidden
                    />
                    Admit {(match.college.admit_rate * 100).toFixed(1)}%
                  </p>
                  <p className="flex items-center gap-1.5">
                    <DollarSign
                      className="h-3.5 w-3.5 shrink-0 text-brand-500"
                      aria-hidden
                    />
                    {formatCurrency(match.college.tuition_estimate)}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarDays
                      className="h-3.5 w-3.5 shrink-0 text-brand-500"
                      aria-hidden
                    />
                    {match.college.deadline
                      ? new Date(match.college.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                  Programs
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.college.programs?.slice(0, 4).map((program) => (
                    <span
                      key={program}
                      className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  <Star className="h-3.5 w-3.5" aria-hidden />
                  Why it scores {match.strengthIndex}
                </p>
                <ul className="space-y-1.5">
                  {match.rationale.slice(0, 3).map((note, i) => (
                    <li
                      key={i}
                      className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
