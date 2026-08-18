"use client";

import { ChevronLeft, ChevronRight, CheckSquare, GripVertical } from "lucide-react";
import type { Application, CollegeCategory } from "@/lib/supabase/types";
import { Badge, categoryLabel } from "@/components/ui/badge";
import { DeadlineBadge } from "@/components/tracker/deadline-badge";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
  application: Application;
  collegeName: string;
  category: CollegeCategory;
  isDragging?: boolean;
  onOpen: (application: Application) => void;
  onMove: (application: Application, direction: "left" | "right") => void;
  onDragStart: (application: Application) => void;
  onDragEnd: () => void;
  draggable?: boolean;
}

export function MilestoneCard({
  application,
  collegeName,
  category,
  isDragging,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
  draggable = true,
}: MilestoneCardProps) {
  const done = application.checklist.filter((c) => c.done).length;
  const total = Math.max(application.checklist.length, 1);
  const pct = Math.round((done / total) * 100);

  return (
    <div
      draggable={draggable}
      onDragStart={(event) => {
        onDragStart(application);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/application-id", application.id);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group cursor-grab rounded-2xl border border-zinc-200/70 bg-white/70 p-3.5 transition-all duration-200",
        "hover:border-brand-400/60 hover:shadow-glass active:cursor-grabbing",
        "dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-400/50",
        isDragging && "opacity-40 ring-2 ring-brand-500/40"
      )}
    >
      <div className="flex items-center gap-2">
        <GripVertical
          className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => onOpen(application)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate font-display text-sm font-semibold text-zinc-900 dark:text-white">
            {collegeName}
          </span>
        </button>
        <Badge variant="category" category={category} className="shrink-0 text-[10px]">
          {categoryLabel(category)}
        </Badge>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <DeadlineBadge deadline={application.deadline} />
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <CheckSquare className="h-3 w-3" aria-hidden />
          {done}/{total}
        </span>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-white/10"
        aria-hidden
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            pct === 100 ? "bg-safety-500" : pct >= 60 ? "bg-target-500" : "bg-reach-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          {pct === 0 ? "Not started" : pct === 100 ? "Checklist complete" : "In progress"}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove(application, "left")}
            aria-label={`Move ${collegeName} to previous column`}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-900/5 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onMove(application, "right")}
            aria-label={`Move ${collegeName} to next column`}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-900/5 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
